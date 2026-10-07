// Scan Service - Orchestrates the entire scanning pipeline

import { supabaseAdmin } from '../supabase';
import { researchWebsite } from './research';
import { analyzeBusiness } from './analysis';
import { generateBlueprint, generateReport } from './blueprint';
import type {
  ScanInput,
  Scan,
  BusinessProfile,
  Opportunity,
  Blueprint,
  Report,
  ScanStep,
} from '../types';

export interface ScanResult {
  scan: Scan;
  businessProfile?: BusinessProfile;
  opportunities?: Opportunity[];
  blueprints?: Blueprint[];
  report?: Report;
}

export class ScanService {
  private scanId: string = '';
  private steps: ScanStep[] = [
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

  async initiateScan(input: ScanInput): Promise<string> {
    // Create company record
    const { data: company, error: companyError } = await supabaseAdmin
      .from('companies')
      .insert({
        website_url: input.websiteUrl,
        company_name: input.companyName,
        industry: input.industry,
        location: input.location,
        employees_count: input.employeesCount,
        leads_per_month: input.leadsPerMonth,
        current_crm: input.currentCrm,
        additional_context: input.additionalContext,
      })
      .select()
      .single();

    if (companyError) {
      throw new Error(`Failed to create company: ${companyError.message}`);
    }

    // Create scan record
    const { data: scan, error: scanError } = await supabaseAdmin
      .from('scans')
      .insert({
        company_id: company.id,
        status: 'pending',
        progress: 0,
        current_step: 'Initializing scan...',
      })
      .select()
      .single();

    if (scanError) {
      throw new Error(`Failed to create scan: ${scanError.message}`);
    }

    this.scanId = scan.id;
    return scan.id;
  }

  async executeScan(scanId: string, input: ScanInput): Promise<ScanResult> {
    this.scanId = scanId;
    let businessProfile: BusinessProfile | undefined;
    let opportunities: Opportunity[] = [];
    let blueprints: Blueprint[] = [];
    let report: Report | undefined;

    try {
      // Update scan status to running
      await this.updateScanStatus('running', 0, 'Starting scan...');

      // Step 1: Validate URL
      await this.updateStep('validating', 'in_progress');
      const isValidUrl = this.validateUrl(input.websiteUrl);
      if (!isValidUrl) {
        throw new Error('Invalid URL provided');
      }
      await this.updateStep('validating', 'completed');
      await this.updateScanProgress(10, 'URL validated');

      // Step 2: Research Website
      await this.updateStep('researching', 'in_progress');
      const research = await researchWebsite(input.websiteUrl);
      if (!research) {
        throw new Error('Failed to research website');
      }
      await this.updateStep('researching', 'completed');
      await this.updateScanProgress(25, 'Website researched');

      // Step 3-4: Identify business and understand services
      await this.updateStep('identifying', 'in_progress');
      await this.updateStep('understanding', 'in_progress');

      const userContext = {
        industry: input.industry,
        leadsPerMonth: input.leadsPerMonth,
        employeesCount: input.employeesCount,
        additionalContext: input.additionalContext,
      };

      await this.updateStep('identifying', 'completed');
      await this.updateStep('understanding', 'completed');
      await this.updateScanProgress(40, 'Business identified');

      // Step 5: Map customer journey
      await this.updateStep('mapping', 'in_progress');
      await this.updateStep('mapping', 'completed');
      await this.updateScanProgress(50, 'Customer journey mapped');

      // Step 6: Detect lead channels
      await this.updateStep('detecting', 'in_progress');
      await this.updateStep('detecting', 'completed');
      await this.updateScanProgress(60, 'Lead channels detected');

      // Step 7: Analyze operational processes
      await this.updateStep('analyzing', 'in_progress');
      await this.updateStep('analyzing', 'completed');
      await this.updateScanProgress(70, 'Processes analyzed');

      // Step 8: Detect automation opportunities
      await this.updateStep('opportunities', 'in_progress');
      const analysisResult = await analyzeBusiness(research, userContext);
      businessProfile = {
        id: '',
        scan_id: scanId,
        company_name: analysisResult.businessProfile.company_name || null,
        industry: analysisResult.businessProfile.industry || null,
        location: analysisResult.businessProfile.location || null,
        services: analysisResult.businessProfile.services || null,
        target_customers: analysisResult.businessProfile.target_customers || null,
        lead_channels: analysisResult.businessProfile.lead_channels || null,
        booking_methods: analysisResult.businessProfile.booking_methods || null,
        contact_methods: analysisResult.businessProfile.contact_methods || null,
        website_features: analysisResult.businessProfile.website_features || {},
        customer_journey: analysisResult.customerJourney,
        observed_processes: analysisResult.observedProcesses,
        unknowns: null,
        raw_research: {
          scrapedPages: research.scrapedPages,
          businessSignals: research.businessSignals,
          leadGenSignals: research.leadGenSignals,
          operationalSignals: research.operationalSignals,
        },
        created_at: new Date().toISOString(),
      };
      await this.updateStep('opportunities', 'completed');
      await this.updateScanProgress(80, 'Opportunities detected');

      // Step 9: Score opportunities
      await this.updateStep('scoring', 'in_progress');
      opportunities = analysisResult.opportunities.map(opp => ({
        ...opp,
        scan_id: scanId,
      }));
      await this.updateStep('scoring', 'completed');
      await this.updateScanProgress(90, 'Opportunities scored');

      // Step 10: Generate recommendations
      await this.updateStep('generating', 'in_progress');

      // Generate blueprints for top opportunities
      const topOpportunities = opportunities.slice(0, 5);
      for (const opp of topOpportunities) {
        const blueprint = await generateBlueprint(opp, businessProfile);
        blueprints.push(blueprint);
      }

      // Generate final report
      report = await generateReport(scanId, businessProfile, opportunities, blueprints);

      await this.updateStep('generating', 'completed');
      await this.updateScanProgress(100, 'Scan completed');

      // Mark scan as completed
      await this.updateScanStatus('completed', 100, 'Scan completed');

      return {
        scan: {
          id: scanId,
          company_id: '',
          status: 'completed',
          progress: 100,
          current_step: 'Scan completed',
          error_message: null,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
        businessProfile,
        opportunities,
        blueprints,
        report,
      };
    } catch (error: any) {
      await this.updateScanStatus('failed', 0, `Error: ${error.message}`);
      throw error;
    }
  }

  private validateUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private async updateScanStatus(status: 'pending' | 'running' | 'completed' | 'failed', progress: number, currentStep: string) {
    const update: any = {
      status,
      progress,
      current_step: currentStep,
    };

    if (status === 'completed') {
      update.completed_at = new Date().toISOString();
    }

    await supabaseAdmin
      .from('scans')
      .update(update)
      .eq('id', this.scanId);
  }

  private async updateScanProgress(progress: number, currentStep: string) {
    await supabaseAdmin
      .from('scans')
      .update({ progress, current_step: currentStep })
      .eq('id', this.scanId);
  }

  private async updateStep(stepId: string, status: 'pending' | 'in_progress' | 'completed' | 'failed') {
    const step = this.steps.find(s => s.id === stepId);
    if (step) {
      step.status = status;
    }
  }

  getSteps(): ScanStep[] {
    return this.steps;
  }
}

// Helper functions
export async function getScanStatus(scanId: string): Promise<Scan | null> {
  const { data, error } = await supabaseAdmin
    .from('scans')
    .select('*')
    .eq('id', scanId)
    .single();

  if (error) {
    console.error('Error fetching scan status:', error);
    return null;
  }

  return data;
}

export async function getScanResults(scanId: string): Promise<{
  businessProfile: BusinessProfile | null;
  opportunities: Opportunity[];
  blueprints: Blueprint[];
  report: Report | null;
}> {
  const [profileResult, opportunitiesResult, blueprintsResult, reportResult] = await Promise.all([
    supabaseAdmin.from('business_profiles').select('*').eq('scan_id', scanId).single(),
    supabaseAdmin.from('opportunities').select('*').eq('scan_id', scanId).order('priority_score', { ascending: false }),
    supabaseAdmin.from('blueprints').select('*').eq('scan_id', scanId),
    supabaseAdmin.from('reports').select('*').eq('scan_id', scanId).single(),
  ]);

  return {
    businessProfile: profileResult.data || null,
    opportunities: opportunitiesResult.data || [],
    blueprints: blueprintsResult.data || [],
    report: reportResult.data || null,
  };
}

export async function saveScanResults(
  scanId: string,
  businessProfile: BusinessProfile,
  opportunities: Opportunity[],
  blueprints: Blueprint[],
  report: Report
): Promise<void> {
  // Save business profile
  const { error: profileError } = await supabaseAdmin
    .from('business_profiles')
    .insert({
      scan_id: scanId,
      company_name: businessProfile.company_name,
      industry: businessProfile.industry,
      location: businessProfile.location,
      services: businessProfile.services,
      target_customers: businessProfile.target_customers,
      lead_channels: businessProfile.lead_channels,
      booking_methods: businessProfile.booking_methods,
      contact_methods: businessProfile.contact_methods,
      website_features: businessProfile.website_features,
      customer_journey: businessProfile.customer_journey,
      observed_processes: businessProfile.observed_processes,
      unknowns: businessProfile.unknowns,
      raw_research: businessProfile.raw_research,
    });

  if (profileError) {
    console.error('Error saving business profile:', profileError);
  }

  // Save opportunities
  if (opportunities.length > 0) {
    const { error: oppError } = await supabaseAdmin
      .from('opportunities')
      .insert(
        opportunities.map(opp => ({
          scan_id: scanId,
          title: opp.title,
          category: opp.category,
          problem: opp.problem,
          evidence: opp.evidence,
          evidence_type: opp.evidence_type,
          automation_solution: opp.automation_solution,
          workflow: opp.workflow,
          business_impact: opp.business_impact,
          frequency: opp.frequency,
          automation_fit: opp.automation_fit,
          confidence: opp.confidence,
          priority_score: opp.priority_score,
          reasoning: opp.reasoning,
        }))
      );

    if (oppError) {
      console.error('Error saving opportunities:', oppError);
    }
  }

  // Save blueprints
  if (blueprints.length > 0) {
    const { error: blueprintError } = await supabaseAdmin
      .from('blueprints')
      .insert(
        blueprints.map(bp => ({
          scan_id: scanId,
          opportunity_id: bp.opportunity_id,
          title: bp.title,
          trigger_description: bp.trigger_description,
          workflow_steps: bp.workflow_steps,
          technology_stack: bp.technology_stack,
          human_handoffs: bp.human_handoffs,
          failure_handling: bp.failure_handling,
        }))
      );

    if (blueprintError) {
      console.error('Error saving blueprints:', blueprintError);
    }
  }

  // Save report
  const { error: reportError } = await supabaseAdmin
    .from('reports')
    .insert({
      scan_id: scanId,
      content: report.content,
    });

  if (reportError) {
    console.error('Error saving report:', reportError);
  }
}
