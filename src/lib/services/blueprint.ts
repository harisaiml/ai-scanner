// Blueprint and Report Generation Service

import { generateContent, generateJSON } from '../gemini';
import type {
  Opportunity,
  BusinessProfile,
  Blueprint,
  BlueprintStep,
  Report,
  ReportContent,
  AutomationHealth,
  NextStep,
} from '../types';

export async function generateBlueprint(opportunity: Opportunity, profile: BusinessProfile): Promise<Blueprint> {
  const context = `
Business: ${profile.company_name || 'Unknown'}
Industry: ${profile.industry || 'Unknown'}
Opportunity: ${opportunity.title}
Problem: ${opportunity.problem}
Evidence: ${JSON.stringify(opportunity.evidence)}
`;

  const prompt = `Generate a detailed automation blueprint for this opportunity. Return ONLY valid JSON.

Context:
${context}

Generate a practical workflow with:
- Trigger: What starts this automation
- Steps: Detailed workflow steps with tools/actions
- Technology stack: Recommended tools (n8n, CRM, AI, etc.)
- Human handoffs: Where humans need to intervene
- Failure handling: How to handle errors/timeouts

Return JSON format:
{
  "opportunity_id": "${opportunity.id || ''}",
  "title": "Blueprint title",
  "trigger_description": "What triggers this automation",
  "workflow_steps": [
    {
      "order": 1,
      "action": "action name",
      "description": "detailed description",
      "trigger": "optional trigger for this step",
      "inputs": ["required inputs"],
      "ai_action": "if AI is involved",
      "decision": "decision point if any",
      "destination": "where data goes",
      "human_handoff": false,
      "failure_handling": "how to handle failure"
    }
  ],
  "technology_stack": ["recommended tools"],
  "human_handoffs": [
    {
      "stage": "stage name",
      "reason": "why human needed",
      "notification": "how to notify"
    }
  ],
  "failure_handling": "overall failure handling strategy"
}

Return ONLY the JSON object, no markdown formatting.`;

  try {
    const result = await generateJSON<Omit<Blueprint, 'scan_id' | 'created_at'>>(prompt);
    return {
      ...result,
      scan_id: opportunity.scan_id,
      created_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating blueprint:', error);
    return generateDefaultBlueprint(opportunity);
  }
}

function generateDefaultBlueprint(opportunity: Opportunity): Blueprint {
  const category = opportunity.category || 'General';

  const defaultBlueprints: Record<string, Blueprint> = {
    'Lead Response': {
      id: '',
      opportunity_id: opportunity.id || '',
      scan_id: opportunity.scan_id,
      title: 'Instant Lead Response System',
      trigger_description: 'New lead submitted via website form',
      workflow_steps: [
        { order: 1, action: 'Webhook Trigger', description: 'Form submission triggers n8n workflow', automation: 'auto' },
        { order: 2, action: 'Data Extraction', description: 'Extract lead details from form', automation: 'auto' },
        { order: 3, action: 'AI Response Generation', description: 'Generate personalized instant response', automation: 'ai', ai_action: 'Create tailored acknowledgment message' },
        { order: 4, action: 'Email Delivery', description: 'Send AI-generated response to lead', automation: 'auto' },
        { order: 5, action: 'Owner Notification', description: 'Notify owner with lead details and urgency', automation: 'auto' },
        { order: 6, action: 'CRM Entry', description: 'Create/update lead record in CRM', automation: 'auto' },
      ],
      technology_stack: ['n8n', 'AI (Gemini/Claude)', 'Email', 'CRM'],
      human_handoffs: [
        { stage: 'Owner Review', reason: 'High-value leads need personal attention', notification: 'SMS + Email' },
      ],
      failure_handling: 'If AI fails, send template response. Retry 3x, then alert owner.',
      created_at: new Date().toISOString(),
    },
    'Follow-Up': {
      id: '',
      opportunity_id: opportunity.id || '',
      scan_id: opportunity.scan_id,
      title: 'Automated Follow-Up Sequence',
      trigger_description: 'Time-based or action-based trigger',
      workflow_steps: [
        { order: 1, action: 'Trigger Event', description: 'Lead action or time elapsed', automation: 'auto' },
        { order: 2, action: 'Segment Lead', description: 'Categorize lead by engagement level', automation: 'auto' },
        { order: 3, action: 'Select Sequence', description: 'Choose appropriate follow-up sequence', automation: 'auto' },
        { order: 4, action: 'Send Message', description: 'Send personalized email/SMS', automation: 'auto' },
        { order: 5, action: 'Track Engagement', description: 'Monitor opens, clicks, replies', automation: 'auto' },
        { order: 6, action: 'Update Lead Score', description: 'Adjust score based on engagement', automation: 'auto' },
      ],
      technology_stack: ['n8n', 'Email', 'SMS', 'CRM'],
      human_handoffs: [
        { stage: 'Reply Handling', reason: 'Human responses need personal replies', notification: 'Email to owner' },
      ],
      failure_handling: 'If message fails, retry via alternate channel. After 3 attempts, flag for manual review.',
      created_at: new Date().toISOString(),
    },
    'Lead Qualification': {
      id: '',
      opportunity_id: opportunity.id || '',
      scan_id: opportunity.scan_id,
      title: 'AI Lead Qualification System',
      trigger_description: 'New lead enters system',
      workflow_steps: [
        { order: 1, action: 'Lead Capture', description: 'Collect lead from any source', automation: 'auto' },
        { order: 2, action: 'AI Analysis', description: 'Analyze lead data and behavior', automation: 'ai', ai_action: 'Score and qualify lead based on criteria' },
        { order: 3, action: 'Lead Scoring', description: 'Assign score based on fit and engagement', automation: 'auto' },
        { order: 4, action: 'Routing Decision', description: 'Route based on score', automation: 'auto', decision: 'HOT → Owner, WARM → Nurture, COLD → Sequence' },
        { order: 5, action: 'CRM Update', description: 'Update lead with score and qualification', automation: 'auto' },
        { order: 6, action: 'Notification', description: 'Alert appropriate party based on routing', automation: 'auto' },
      ],
      technology_stack: ['n8n', 'AI (Gemini/Claude)', 'CRM', 'Email'],
      human_handoffs: [
        { stage: 'Hot Lead Alert', reason: 'Immediate personal outreach needed', notification: 'SMS + Push' },
      ],
      failure_handling: 'If AI unavailable, apply rule-based scoring. Always log qualification attempt.',
      created_at: new Date().toISOString(),
    },
  };

  return defaultBlueprints[category] || {
    id: '',
    opportunity_id: opportunity.id || '',
    scan_id: opportunity.scan_id,
    title: `${category} Automation`,
    trigger_description: 'Process trigger',
    workflow_steps: [
      { order: 1, action: 'Trigger', description: 'Start of automation', automation: 'auto' },
      { order: 2, action: 'Process', description: 'Main processing step', automation: 'manual' },
      { order: 3, action: 'Deliver', description: 'Deliver result', automation: 'auto' },
    ],
    technology_stack: ['n8n', 'AI', 'CRM'],
    human_handoffs: [],
    failure_handling: 'Alert owner on failure',
    created_at: new Date().toISOString(),
  };
}

export async function generateReport(
  scanId: string,
  profile: BusinessProfile,
  opportunities: Opportunity[],
  blueprints: Blueprint[]
): Promise<Report> {
  // Calculate automation health
  const automationHealth = calculateAutomationHealth(profile, opportunities);

  // Determine unknowns
  const unknowns: string[] = [];
  if (!profile.company_name) unknowns.push('Company name could not be confirmed from public information');
  if (!profile.industry) unknowns.push('Industry classification could not be determined');
  if (!profile.lead_channels || profile.lead_channels.length === 0) unknowns.push('Lead capture mechanisms could not be confirmed');
  unknowns.push('Internal team size and workflow could not be assessed');
  unknowns.push('Existing software stack could not be verified');
  unknowns.push('Current response times could not be measured');

  // Generate next steps
  const nextSteps = generateNextSteps(opportunities);

  const reportContent: ReportContent = {
    businessSnapshot: {
      companyName: profile.company_name || 'Unknown',
      industry: profile.industry || 'Unknown',
      location: profile.location || 'Not specified',
      services: profile.services || [],
      targetCustomers: profile.target_customers || [],
      businessModel: 'Service-based',
      primaryCTA: profile.lead_channels?.[0] || 'Contact',
    },
    customerJourney: profile.customer_journey,
    automationHealth,
    topOpportunities: opportunities.slice(0, 5),
    processMap: generateProcessMap(profile, opportunities),
    blueprints: blueprints.slice(0, 3),
    potentialImpact: calculatePotentialImpact(profile, opportunities),
    unknowns,
    nextSteps,
  };

  return {
    id: '',
    scan_id: scanId,
    content: reportContent,
    created_at: new Date().toISOString(),
  };
}

function calculateAutomationHealth(
  profile: BusinessProfile,
  opportunities: Opportunity[]
): AutomationHealth {
  const findStatus = (category: string, keyword: string): 'automated' | 'partial' | 'manual' | 'unknown' => {
    const opp = opportunities.find(o =>
      o.category?.toLowerCase().includes(category) ||
      o.title?.toLowerCase().includes(keyword)
    );
    if (!opp) return 'unknown';
    if (opp.priority_score >= 7) return 'manual';
    if (opp.priority_score >= 4) return 'partial';
    return 'automated';
  };

  return {
    leadCapture: profile.website_features?.hasContactForm ? 'partial' : findStatus('lead', 'capture'),
    leadResponse: findStatus('response', 'response'),
    qualification: findStatus('qualification', 'qualification'),
    booking: profile.website_features?.hasBookingSystem ? 'partial' : findStatus('booking', 'booking'),
    followUp: findStatus('follow', 'follow'),
    support: profile.website_features?.hasFAQ ? 'partial' : findStatus('support', 'support'),
    reviews: profile.website_features?.hasTestimonials ? 'partial' : findStatus('review', 'review'),
  };
}

function generateProcessMap(profile: BusinessProfile, opportunities: Opportunity[]): {
  nodes: any[];
  edges: any[];
} {
  const nodes: any[] = [];
  const edges: any[] = [];

  const journey = profile.customer_journey || [];
  const journeyNodes = [
    { id: 'discovery', label: 'Discovery' },
    { id: 'website', label: 'Website Visit' },
    { id: 'contact', label: 'Contact/Lead Capture' },
    { id: 'response', label: 'Response' },
    { id: 'qualification', label: 'Qualification' },
    { id: 'estimate', label: 'Estimate/Consultation' },
    { id: 'booking', label: 'Booking' },
    { id: 'service', label: 'Service Delivery' },
    { id: 'followup', label: 'Follow-Up' },
    { id: 'review', label: 'Review' },
  ];

  // Add nodes with status
  for (const node of journeyNodes) {
    const journeyStage = journey.find(j =>
      j.stage.toLowerCase().includes(node.label.toLowerCase())
    );
    const opp = opportunities.find(o =>
      node.label.toLowerCase().includes(o.category?.toLowerCase() || '')
    );

    let status: 'automated' | 'partial' | 'manual' | 'unknown' = 'unknown';
    let evidence = 'No evidence available';
    let confidence = 50;

    if (journeyStage) {
      status = journeyStage.automation_status || 'unknown';
      evidence = journeyStage.evidence;
      confidence = journeyStage.evidence_type === 'observed' ? 90 :
                   journeyStage.evidence_type === 'inferred' ? 70 : 30;
    }

    if (opp && opp.priority_score > 5) {
      status = 'manual';
      evidence = opp.problem || evidence;
    }

    nodes.push({
      id: node.id,
      label: node.label,
      category: node.label,
      status,
      evidence,
      evidenceType: journeyStage?.evidence_type || 'unknown',
      confidence,
      recommendations: opp ? [opp.automation_solution || ''] : [],
    });
  }

  // Add edges
  for (let i = 0; i < journeyNodes.length - 1; i++) {
    edges.push({
      from: journeyNodes[i].id,
      to: journeyNodes[i + 1].id,
    });
  }

  return { nodes, edges };
}

function calculatePotentialImpact(
  profile: BusinessProfile,
  opportunities: Opportunity[]
): { hoursPerMonth?: number; estimatedValue?: number; assumptions: string[]; scenarios?: any[] } {
  const leadsPerMonth = profile.services?.length ? 50 : undefined; // Default assumption
  const minutesPerLead = 10;

  const assumptions: string[] = [
    'Based on industry average for businesses of this type',
    'Assumes current manual handling of leads',
    'Actual results may vary based on team efficiency',
  ];

  if (!leadsPerMonth) {
    return {
      assumptions: [...assumptions, 'Insufficient data for hours estimate'],
    };
  }

  const baseHours = (leadsPerMonth * minutesPerLead) / 60;

  return {
    hoursPerMonth: Math.round(baseHours),
    estimatedValue: Math.round(baseHours * 50 * 4), // $50/hour estimate
    assumptions,
    scenarios: [
      { leadsPerMonth: 25, minutesPerLead: 10, hoursPerMonth: Math.round((25 * 10) / 60) },
      { leadsPerMonth: 50, minutesPerLead: 10, hoursPerMonth: Math.round((50 * 10) / 60) },
      { leadsPerMonth: 100, minutesPerLead: 10, hoursPerMonth: Math.round((100 * 10) / 60) },
    ],
  };
}

function generateNextSteps(opportunities: Opportunity[]): NextStep[] {
  const steps: NextStep[] = [];

  // Quick Wins (high priority, easy to implement)
  const quickWins = opportunities.filter(o => o.priority_score >= 7).slice(0, 2);
  quickWins.forEach((opp, i) => {
    steps.push({
      phase: 'Quick Wins',
      title: opp.title,
      description: opp.automation_solution || '',
      priority: i + 1,
    });
  });

  // Next Systems
  const nextSystems = opportunities.filter(o => o.priority_score >= 5 && o.priority_score < 7).slice(0, 2);
  nextSystems.forEach((opp, i) => {
    steps.push({
      phase: 'Next Systems',
      title: opp.title,
      description: opp.automation_solution || '',
      priority: i + 1,
    });
  });

  // Strategic Systems
  const strategic = opportunities.filter(o => o.priority_score < 5).slice(0, 2);
  strategic.forEach((opp, i) => {
    steps.push({
      phase: 'Strategic Systems',
      title: opp.title,
      description: opp.automation_solution || '',
      priority: i + 1,
    });
  });

  return steps;
}
