// TypeScript types for AI Automation Opportunity Scanner

export interface ScanInput {
  websiteUrl: string;
  companyName?: string;
  industry?: string;
  location?: string;
  employeesCount?: string;
  leadsPerMonth?: number;
  currentCrm?: string;
  additionalContext?: string;
}

export interface Company {
  id: string;
  website_url: string;
  company_name: string | null;
  industry: string | null;
  location: string | null;
  employees_count: string | null;
  leads_per_month: number | null;
  current_crm: string | null;
  additional_context: string | null;
  created_at: string;
}

export interface Scan {
  id: string;
  company_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  current_step: string | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface BusinessProfile {
  id: string;
  scan_id: string;
  company_name: string | null;
  industry: string | null;
  location: string | null;
  services: string[] | null;
  target_customers: string[] | null;
  lead_channels: string[] | null;
  booking_methods: string[] | null;
  contact_methods: string[] | null;
  website_features: WebsiteFeatures;
  customer_journey: JourneyStage[];
  observed_processes: ObservedProcess[];
  unknowns: string[] | null;
  raw_research: RawResearch;
  created_at: string;
}

export interface WebsiteFeatures {
  hasContactForm?: boolean;
  hasQuoteForm?: boolean;
  hasBookingSystem?: boolean;
  hasChatbot?: boolean;
  hasPhoneCTA?: boolean;
  hasEmailContact?: boolean;
  hasFAQ?: boolean;
  hasBlog?: boolean;
  hasTestimonials?: boolean;
  hasPricing?: boolean;
  hasPortfolio?: boolean;
  hasCaseStudies?: boolean;
  hasNewsletter?: boolean;
  hasLiveChat?: boolean;
}

export interface JourneyStage {
  stage: string;
  description: string;
  evidence: string;
  evidence_type: 'observed' | 'inferred' | 'unknown';
  automation_status?: 'automated' | 'partial' | 'manual' | 'unknown';
}

export interface ObservedProcess {
  category: string;
  process: string;
  description: string;
  evidence_type: 'observed' | 'inferred' | 'unknown';
  evidence: string;
}

export interface RawResearch {
  scrapedPages?: ScrapedPage[];
  businessSignals?: BusinessSignals;
  leadGenSignals?: LeadGenSignals;
  operationalSignals?: OperationalSignals;
}

export interface ScrapedPage {
  url: string;
  title: string;
  content: string;
  type: string;
}

export interface BusinessSignals {
  companyName?: string;
  industry?: string;
  services?: string[];
  products?: string[];
  targetCustomers?: string[];
  geographicMarket?: string;
  businessModel?: string;
  primaryCTA?: string;
  contactMethods?: string[];
}

export interface LeadGenSignals {
  contactForms?: number;
  quoteForms?: number;
  bookingForms?: number;
  phoneNumbers?: string[];
  emailAddresses?: string[];
  liveChat?: boolean;
  chatbots?: boolean;
  calendars?: boolean;
  consultationForms?: boolean;
  leadMagnets?: string[];
  newsletterForms?: boolean;
}

export interface OperationalSignals {
  quotes?: boolean;
  estimates?: boolean;
  scheduling?: boolean;
  consultations?: boolean;
  customerOnboarding?: boolean;
  followUps?: boolean;
  reviews?: boolean;
  documents?: boolean;
  reporting?: boolean;
  notifications?: boolean;
}

export interface Opportunity {
  id: string;
  scan_id: string;
  title: string;
  category: string | null;
  problem: string | null;
  evidence: OpportunityEvidence[];
  evidence_type: 'observed' | 'inferred' | 'unknown';
  automation_solution: string | null;
  workflow: WorkflowStep[];
  business_impact: number;
  frequency: number;
  automation_fit: number;
  confidence: number;
  priority_score: number;
  reasoning: string | null;
  created_at: string;
}

export interface OpportunityEvidence {
  type: 'observed' | 'inferred' | 'unknown';
  description: string;
  source?: string;
}

export interface WorkflowStep {
  step: string;
  description: string;
  tool?: string;
  automation?: 'auto' | 'manual' | 'ai';
}

export interface Blueprint {
  id: string;
  opportunity_id: string;
  scan_id: string;
  title: string | null;
  trigger_description: string | null;
  workflow_steps: BlueprintStep[];
  technology_stack: string[];
  human_handoffs: HumanHandoff[];
  failure_handling: string | null;
  created_at: string;
}

export interface BlueprintStep {
  order: number;
  action: string;
  description: string;
  trigger?: string;
  inputs?: string[];
  ai_action?: string;
  decision?: string;
  destination?: string;
  human_handoff?: boolean;
  failure_handling?: string;
  automation?: 'auto' | 'manual' | 'ai';
}

// Research result type
export interface ResearchResult {
  scrapedPages: ScrapedPage[];
  businessSignals: BusinessSignals;
  leadGenSignals: LeadGenSignals;
  operationalSignals: OperationalSignals;
  websiteFeatures: WebsiteFeatures;
}

export interface HumanHandoff {
  stage: string;
  reason: string;
  notification: string;
}

export interface Report {
  id: string;
  scan_id: string;
  content: ReportContent;
  created_at: string;
}

export interface ReportContent {
  businessSnapshot?: BusinessSnapshot;
  customerJourney?: JourneyStage[];
  automationHealth?: AutomationHealth;
  topOpportunities?: Opportunity[];
  processMap?: ProcessMapData;
  blueprints?: Blueprint[];
  potentialImpact?: ImpactEstimate;
  unknowns?: string[];
  nextSteps?: NextStep[];
}

export interface BusinessSnapshot {
  companyName: string;
  industry: string;
  location: string;
  services: string[];
  targetCustomers: string[];
  businessModel: string;
  primaryCTA: string;
}

export interface AutomationHealth {
  leadCapture: 'automated' | 'partial' | 'manual' | 'unknown';
  leadResponse: 'automated' | 'partial' | 'manual' | 'unknown';
  qualification: 'automated' | 'partial' | 'manual' | 'unknown';
  booking: 'automated' | 'partial' | 'manual' | 'unknown';
  followUp: 'automated' | 'partial' | 'manual' | 'unknown';
  support: 'automated' | 'partial' | 'manual' | 'unknown';
  reviews: 'automated' | 'partial' | 'manual' | 'unknown';
}

export interface ProcessMapData {
  nodes: ProcessNode[];
  edges: ProcessEdge[];
}

export interface ProcessNode {
  id: string;
  label: string;
  category: string;
  status: 'automated' | 'partial' | 'manual' | 'unknown';
  evidence: string;
  evidenceType: 'observed' | 'inferred' | 'unknown';
  confidence: number;
  recommendations: string[];
}

export interface ProcessEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ImpactEstimate {
  hoursPerMonth?: number;
  estimatedValue?: number;
  assumptions: string[];
  scenarios?: ImpactScenario[];
}

export interface ImpactScenario {
  leadsPerMonth: number;
  minutesPerLead: number;
  hoursPerMonth: number;
}

export interface NextStep {
  phase: 'Quick Wins' | 'Next Systems' | 'Strategic Systems';
  title: string;
  description: string;
  priority: number;
}

export interface ScanProgress {
  scanId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  steps: ScanStep[];
}

export interface ScanStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  message?: string;
}

export const SCAN_STEPS: ScanStep[] = [
  { id: 'validating', name: 'Validating URL', status: 'pending' },
  { id: 'researching', name: 'Researching website', status: 'pending' },
  { id: 'identifying', name: 'Identifying business', status: 'pending' },
  { id: 'understanding', name: 'Understanding services', status: 'pending' },
  { id: 'mapping', name: 'Mapping customer journey', status: 'pending' },
  { id: 'detecting', name: 'Detecting lead channels', status: 'pending' },
  { id: 'analyzing', name: 'Analyzing operational processes', status: 'pending' },
  { id: 'opportunities', name: 'Searching for automation opportunities', status: 'pending' },
  { id: 'scoring', name: 'Scoring opportunities', status: 'pending' },
  { id: 'generating', name: 'Generating recommendations', status: 'pending' },
];
