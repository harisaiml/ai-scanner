// Analysis Service - Builds business profile and detects opportunities

import { generateContent, generateJSON } from '../gemini';
import type {
  ResearchResult,
  BusinessProfile,
  JourneyStage,
  ObservedProcess,
  Opportunity,
  OpportunityEvidence,
  WorkflowStep,
} from '../types';

export interface AnalysisResult {
  businessProfile: Partial<BusinessProfile>;
  customerJourney: JourneyStage[];
  observedProcesses: ObservedProcess[];
  opportunities: Opportunity[];
}

const OPPORTUNITY_CATEGORIES = [
  'Lead Capture',
  'Lead Response',
  'Lead Qualification',
  'Follow-Up',
  'Booking',
  'Phone',
  'Customer Support',
  'Reviews',
  'Internal Administration',
];

export async function analyzeBusiness(
  research: ResearchResult,
  userInput?: {
    industry?: string;
    leadsPerMonth?: number;
    employeesCount?: string;
    additionalContext?: string;
  }
): Promise<AnalysisResult> {
  const combinedContext = `
User-provided context:
- Industry: ${userInput?.industry || 'Not specified'}
- Leads per month: ${userInput?.leadsPerMonth || 'Not specified'}
- Employees: ${userInput?.employeesCount || 'Not specified'}
- Additional context: ${userInput?.additionalContext || 'None'}

Research findings:
${JSON.stringify(research, null, 2)}
`;

  // Build business profile
  const businessProfile = buildBusinessProfile(research, userInput);

  // Map customer journey
  const customerJourney = await mapCustomerJourney(research, businessProfile);

  // Analyze processes
  const observedProcesses = analyzeProcesses(research, businessProfile);

  // Detect opportunities
  const opportunities = await detectOpportunities(research, businessProfile, customerJourney, observedProcesses);

  return {
    businessProfile,
    customerJourney,
    observedProcesses,
    opportunities,
  };
}

function buildBusinessProfile(
  research: ResearchResult,
  userInput?: { industry?: string; leadsPerMonth?: number }
): Partial<BusinessProfile> {
  const { businessSignals, leadGenSignals, websiteFeatures } = research;

  // Determine lead channels
  const leadChannels: string[] = [];
  if (businessSignals.contactMethods?.some((m: string) => m.toLowerCase().includes('form'))) {
    leadChannels.push('Website Form');
  }
  if (businessSignals.contactMethods?.some((m: string) => m.toLowerCase().includes('phone'))) {
    leadChannels.push('Phone');
  }
  if (businessSignals.contactMethods?.some((m: string) => m.toLowerCase().includes('email'))) {
    leadChannels.push('Email');
  }
  if (leadGenSignals.chatbots) {
    leadChannels.push('Chatbot');
  }

  // Determine booking methods
  const bookingMethods: string[] = [];
  if (websiteFeatures.hasBookingSystem) {
    bookingMethods.push('Online Booking');
  }
  if (businessSignals.contactMethods?.some((m: string) => m.toLowerCase().includes('phone'))) {
    bookingMethods.push('Phone Scheduling');
  }

  // Determine contact methods
  const contactMethods: string[] = [];
  if (websiteFeatures.hasContactForm) contactMethods.push('Website Form');
  if (websiteFeatures.hasPhoneCTA) contactMethods.push('Phone');
  if (websiteFeatures.hasEmailContact) contactMethods.push('Email');
  if (websiteFeatures.hasLiveChat || websiteFeatures.hasChatbot) contactMethods.push('Chat');

  return {
    company_name: businessSignals.companyName || userInput?.industry || 'Unknown Business',
    industry: businessSignals.industry || userInput?.industry || null,
    services: businessSignals.services || [],
    target_customers: businessSignals.targetCustomers || [],
    lead_channels: leadChannels.length > 0 ? leadChannels : ['Unknown'],
    booking_methods: bookingMethods.length > 0 ? bookingMethods : [],
    contact_methods: contactMethods.length > 0 ? contactMethods : ['Unknown'],
    website_features: websiteFeatures,
  };
}

async function mapCustomerJourney(
  research: ResearchResult,
  profile: Partial<BusinessProfile>
): Promise<JourneyStage[]> {
  const contentSummary = `
Services: ${profile.services?.join(', ') || 'Unknown'}
Lead channels: ${profile.lead_channels?.join(', ') || 'Unknown'}
Contact methods: ${profile.contact_methods?.join(', ') || 'Unknown'}
Industry: ${profile.industry || 'Unknown'}
`;

  const prompt = `Based on the following business information, map out the most likely customer journey stages. Return ONLY valid JSON.

Business Info:
${contentSummary}

Research signals:
- Lead gen signals: ${JSON.stringify(research.leadGenSignals)}
- Operational signals: ${JSON.stringify(research.operationalSignals)}

Create a customer journey with stages like:
- Awareness/Discovery
- Website Visit
- Lead Capture/Contact
- Qualification
- Consultation/Estimate
- Booking/Commitment
- Service Delivery
- Follow-up
- Review/Referral

Return JSON array format:
[
  {
    "stage": "stage name",
    "description": "what happens at this stage",
    "evidence": "what evidence exists for this stage",
    "evidence_type": "observed|inferred|unknown",
    "automation_status": "automated|partial|manual|unknown"
  }
]

Return ONLY the JSON array, no markdown formatting.`;

  try {
    const result = await generateJSON<JourneyStage[]>(prompt);
    return result.length > 0 ? result : getDefaultJourney(profile);
  } catch (error) {
    console.error('Error mapping customer journey:', error);
    return getDefaultJourney(profile);
  }
}

function getDefaultJourney(profile: Partial<BusinessProfile>): JourneyStage[] {
  return [
    {
      stage: 'Discovery',
      description: 'Customer discovers business through search, referral, or advertising',
      evidence: 'Website presence indicates online discovery channel',
      evidence_type: 'inferred',
      automation_status: 'unknown',
    },
    {
      stage: 'Website Visit',
      description: 'Customer visits website to learn about services',
      evidence: 'Website exists and is accessible',
      evidence_type: 'observed',
      automation_status: 'automated',
    },
    {
      stage: 'Lead Capture',
      description: 'Customer submits inquiry through available form or contact method',
      evidence: profile.lead_channels?.length ? `Available: ${profile.lead_channels.join(', ')}` : 'No evidence found',
      evidence_type: profile.lead_channels?.length ? 'observed' : 'unknown',
      automation_status: profile.lead_channels?.length ? 'partial' : 'unknown',
    },
    {
      stage: 'Initial Response',
      description: 'Business responds to incoming lead',
      evidence: 'No automated response system detected',
      evidence_type: 'inferred',
      automation_status: 'manual',
    },
    {
      stage: 'Qualification',
      description: 'Business assesses lead fit and needs',
      evidence: 'No qualification workflow detected',
      evidence_type: 'inferred',
      automation_status: 'manual',
    },
    {
      stage: 'Estimate/Consultation',
      description: 'Business provides quote or schedules consultation',
      evidence: profile.services?.length ? `Services offered: ${profile.services[0]}` : 'Unknown',
      evidence_type: 'inferred',
      automation_status: 'manual',
    },
    {
      stage: 'Booking',
      description: 'Customer books service appointment',
      evidence: profile.booking_methods?.length ? `Available: ${profile.booking_methods.join(', ')}` : 'No booking system detected',
      evidence_type: profile.booking_methods?.length ? 'observed' : 'unknown',
      automation_status: profile.booking_methods?.length ? 'partial' : 'unknown',
    },
    {
      stage: 'Service Delivery',
      description: 'Service is performed',
      evidence: 'Service business identified',
      evidence_type: 'observed',
      automation_status: 'unknown',
    },
    {
      stage: 'Follow-Up',
      description: 'Business follows up after service',
      evidence: 'No follow-up automation detected',
      evidence_type: 'inferred',
      automation_status: 'manual',
    },
  ];
}

function analyzeProcesses(
  research: ResearchResult,
  profile: Partial<BusinessProfile>
): ObservedProcess[] {
  const processes: ObservedProcess[] = [];
  const { leadGenSignals, operationalSignals, websiteFeatures } = research;

  // Lead Capture Analysis
  if (leadGenSignals.contactForms || leadGenSignals.quoteForms || leadGenSignals.bookingForms) {
    processes.push({
      category: 'Lead Capture',
      process: 'Form Submission',
      description: 'Customers can submit inquiries through website forms',
      evidence_type: 'observed',
      evidence: `Found: ${[
        leadGenSignals.contactForms ? `${leadGenSignals.contactForms} contact form(s)` : null,
        leadGenSignals.quoteForms ? `${leadGenSignals.quoteForms} quote form(s)` : null,
        leadGenSignals.bookingForms ? `${leadGenSignals.bookingForms} booking form(s)` : null,
      ].filter(Boolean).join(', ')}`,
    });
  } else {
    processes.push({
      category: 'Lead Capture',
      process: 'Form Submission',
      description: 'Limited or no form-based lead capture detected',
      evidence_type: 'unknown',
      evidence: 'No contact, quote, or booking forms detected',
    });
  }

  // Phone Analysis
  if (leadGenSignals.phoneNumbers && leadGenSignals.phoneNumbers.length > 0) {
    processes.push({
      category: 'Phone',
      process: 'Phone Inquiries',
      description: 'Phone is a contact method for leads',
      evidence_type: 'observed',
      evidence: `Phone number(s) found: ${leadGenSignals.phoneNumbers.slice(0, 2).join(', ')}`,
    });
  }

  // Chat Analysis
  if (leadGenSignals.chatbots || leadGenSignals.liveChat) {
    processes.push({
      category: 'Customer Support',
      process: 'Live Chat',
      description: 'Real-time chat support available',
      evidence_type: 'observed',
      evidence: leadGenSignals.chatbots ? 'AI chatbot detected' : 'Live chat detected',
    });
  }

  // Quote/Estimate Process
  if (operationalSignals.quotes || operationalSignals.estimates || websiteFeatures.hasQuoteForm) {
    processes.push({
      category: 'Estimates',
      process: 'Quote Generation',
      description: 'Business provides quotes or estimates',
      evidence_type: 'observed',
      evidence: 'Quote/estimate functionality mentioned on website',
    });
  }

  // Scheduling
  if (operationalSignals.scheduling || websiteFeatures.hasBookingSystem) {
    processes.push({
      category: 'Booking',
      process: 'Appointment Scheduling',
      description: 'Customers can schedule appointments',
      evidence_type: 'observed',
      evidence: 'Booking/scheduling system detected',
    });
  }

  // Follow-up
  if (operationalSignals.followUps) {
    processes.push({
      category: 'Follow-Up',
      process: 'Customer Follow-Up',
      description: 'Follow-up communication with customers',
      evidence_type: 'observed',
      evidence: 'Follow-up process mentioned',
    });
  } else {
    processes.push({
      category: 'Follow-Up',
      process: 'Customer Follow-Up',
      description: 'No follow-up automation detected',
      evidence_type: 'inferred',
      evidence: 'Likely manual follow-up process',
    });
  }

  // Reviews
  if (operationalSignals.reviews || websiteFeatures.hasTestimonials) {
    processes.push({
      category: 'Reviews',
      process: 'Review Collection',
      description: 'Business collects or displays customer reviews',
      evidence_type: 'observed',
      evidence: 'Testimonials/reviews section detected',
    });
  }

  return processes;
}

async function detectOpportunities(
  research: ResearchResult,
  profile: Partial<BusinessProfile>,
  journey: JourneyStage[],
  processes: ObservedProcess[]
): Promise<Opportunity[]> {
  const opportunities: Opportunity[] = [];

  // Analyze each category for opportunities
  const analysisContext = `
Business: ${profile.company_name}
Industry: ${profile.industry}
Services: ${profile.services?.join(', ') || 'Unknown'}
Lead Channels: ${profile.lead_channels?.join(', ') || 'Unknown'}
Processes Found: ${processes.map(p => p.process).join(', ')}

Research Data:
- Lead Gen: ${JSON.stringify(research.leadGenSignals)}
- Operational: ${JSON.stringify(research.operationalSignals)}
- Features: ${JSON.stringify(research.websiteFeatures)}
`;

  const prompt = `Analyze this business for automation opportunities. Return ONLY valid JSON.

Business Context:
${analysisContext}

Customer Journey:
${JSON.stringify(journey)}

For each of these categories, determine if there's an automation opportunity:

1. **Lead Capture** - How are leads being captured? Is there room for improvement?
2. **Lead Response** - How quickly does the business respond to new leads?
3. **Lead Qualification** - Is there a process to qualify leads?
4. **Follow-Up** - Are there automated follow-up sequences?
5. **Booking** - Is scheduling/booking automated?
6. **Phone** - How are phone inquiries handled?
7. **Customer Support** - Is there automated support (FAQ bot, etc.)?
8. **Reviews** - Is review collection automated?
9. **Internal Administration** - Any repetitive manual tasks?

Return a JSON array of opportunities:
[
  {
    "title": "Opportunity title",
    "category": "Category from list above",
    "problem": "What problem does this solve?",
    "evidence": [{"type": "observed|inferred|unknown", "description": "evidence description"}],
    "evidence_type": "observed|inferred|unknown",
    "automation_solution": "Brief description of the automation solution",
    "workflow": [{"step": "step name", "description": "what happens", "automation": "auto|manual|ai"}],
    "business_impact": 1-10,
    "frequency": 1-10,
    "automation_fit": 1-10,
    "confidence": 1-100,
    "reasoning": "Why this is an opportunity"
  }
]

Only include opportunities with confidence > 30. Return ONLY the JSON array.`;

  try {
    const result = await generateJSON<Opportunity[]>(prompt);
    const scoredOpportunities = result.map(opp => ({
      ...opp,
      priority_score: calculatePriorityScore(opp),
    }));
    return scoredOpportunities.sort((a, b) => b.priority_score - a.priority_score);
  } catch (error) {
    console.error('Error detecting opportunities:', error);
    return generateDefaultOpportunities(research, profile);
  }
}

function calculatePriorityScore(opp: Partial<Opportunity>): number {
  const impact = opp.business_impact || 5;
  const frequency = opp.frequency || 5;
  const automationFit = opp.automation_fit || 5;
  const confidence = (opp.confidence || 50) / 100;

  const rawScore = impact * frequency * automationFit * confidence;
  // Normalize to 1-10 scale
  const normalized = Math.min(10, Math.max(1, Math.round(rawScore / 10)));
  return normalized;
}

function generateDefaultOpportunities(
  research: ResearchResult,
  profile: Partial<BusinessProfile>
): Opportunity[] {
  const opportunities: Opportunity[] = [];

  // Lead Response Opportunity
  if (!research.leadGenSignals?.chatbots && !research.leadGenSignals?.liveChat) {
    opportunities.push({
      id: '',
      scan_id: '',
      title: 'AI Lead Response System',
      category: 'Lead Response',
      problem: 'Incoming leads may not receive immediate response, leading to lost opportunities',
      evidence: [
        { type: 'inferred' as const, description: 'No chatbot or live chat detected' },
        { type: 'observed' as const, description: 'Contact form exists but no instant response' },
      ],
      evidence_type: 'inferred',
      automation_solution: 'Implement AI-powered instant response for website inquiries',
      workflow: [
        { step: 'Lead submits form', description: 'Customer submits contact form', automation: 'manual' as const },
        { step: 'Webhook trigger', description: 'Form submission triggers automation', automation: 'auto' as const },
        { step: 'AI Response', description: 'AI generates personalized instant response', automation: 'ai' as const },
        { step: 'Owner notification', description: 'Owner receives notification with lead details', automation: 'auto' as const },
      ],
      business_impact: 8,
      frequency: 7,
      automation_fit: 9,
      confidence: 75,
      priority_score: 0,
      reasoning: 'Lead response time is critical - immediate response significantly improves conversion rates',
      created_at: new Date().toISOString(),
    });
  }

  // Follow-up Opportunity
  opportunities.push({
    id: '',
    scan_id: '',
    title: 'Automated Follow-Up Sequences',
    category: 'Follow-Up',
    problem: 'Manual follow-up is inconsistent and time-consuming',
    evidence: [
      { type: 'inferred' as const, description: 'No automated follow-up detected' },
      { type: 'observed' as const, description: 'Business accepts leads via multiple channels' },
    ],
    evidence_type: 'inferred',
    automation_solution: 'Create automated email/SMS follow-up sequences for different lead stages',
    workflow: [
      { step: 'Trigger event', description: 'Lead action or time-based trigger', automation: 'auto' as const },
      { step: 'Sequence selection', description: 'Choose appropriate follow-up sequence', automation: 'auto' as const },
      { step: 'Send message', description: 'Send personalized email/SMS', automation: 'auto' as const },
      { step: 'Track engagement', description: 'Monitor opens, clicks, replies', automation: 'auto' as const },
    ],
    business_impact: 7,
    frequency: 6,
    automation_fit: 9,
    confidence: 70,
    priority_score: 0,
    reasoning: 'Consistent follow-up dramatically improves conversion and customer experience',
    created_at: new Date().toISOString(),
  });

  // Lead Qualification
  if (profile.lead_channels?.length && profile.lead_channels.length > 1) {
    opportunities.push({
      id: '',
      scan_id: '',
      title: 'AI Lead Qualification',
      category: 'Lead Qualification',
      problem: 'All leads are treated equally without qualification scoring',
      evidence: [
        { type: 'inferred' as const, description: 'No lead scoring system visible' },
        { type: 'observed' as const, description: 'Multiple lead channels exist' },
      ],
      evidence_type: 'inferred',
      automation_solution: 'AI-powered lead qualification to route hot leads immediately',
      workflow: [
        { step: 'Lead captured', description: 'Lead comes through any channel', automation: 'manual' as const },
        { step: 'AI qualification', description: 'AI analyzes and scores lead', automation: 'ai' as const },
        { step: 'Routing decision', description: 'Hot leads to owner, warm leads to nurture', automation: 'auto' as const },
        { step: 'CRM update', description: 'Lead data and score saved to CRM', automation: 'auto' as const },
      ],
      business_impact: 8,
      frequency: 7,
      automation_fit: 8,
      confidence: 65,
      priority_score: 0,
      reasoning: 'Qualification ensures right leads get right attention at right time',
      created_at: new Date().toISOString(),
    });
  }

  // Calculate priority scores
  return opportunities.map(opp => ({
    ...opp,
    priority_score: calculatePriorityScore(opp),
  })).sort((a, b) => b.priority_score - a.priority_score);
}
