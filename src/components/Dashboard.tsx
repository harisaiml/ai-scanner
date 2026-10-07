'use client';

import { useState } from 'react';

interface DashboardProps {
  businessProfile?: any;
  opportunities?: any[];
  blueprints?: any[];
  report?: any;
  onReset: () => void;
}

export default function Dashboard({ businessProfile, opportunities, blueprints, report, onReset }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'processes' | 'opportunities' | 'blueprints' | 'report'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'processes', label: 'Process Map', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { id: 'opportunities', label: 'Opportunities', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'blueprints', label: 'Blueprints', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'report', label: 'Full Report', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];

  const profile = report?.content?.businessSnapshot || businessProfile;
  const health = report?.content?.automationHealth;
  const processMap = report?.content?.processMap;
  const potentialImpact = report?.content?.potentialImpact;
  const nextSteps = report?.content?.nextSteps;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'automated':
        return <span className="badge badge-green">Automated</span>;
      case 'partial':
        return <span className="badge badge-yellow">Partial</span>;
      case 'manual':
        return <span className="badge badge-red">Manual</span>;
      default:
        return <span className="badge badge-gray">Unknown</span>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'automated':
        return '#22c55e';
      case 'partial':
        return '#eab308';
      case 'manual':
        return '#ef4444';
      default:
        return '#737373';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-sm text-[#737373] hover:text-white transition-colors mb-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            New Scan
          </button>
          <h2 className="text-3xl font-bold">
            {profile?.companyName || 'Business'} Analysis
          </h2>
          <p className="text-[#737373] mt-1">
            {profile?.industry || 'Business'} {profile?.location ? `• ${profile.location}` : ''}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Export Report
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#262626] mb-8">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#ef4444] text-white'
                  : 'border-transparent text-[#737373] hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Business Snapshot */}
            <section className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Business Snapshot</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-[#737373] uppercase tracking-wider">Company</label>
                  <p className="text-lg font-medium">{profile?.companyName || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-xs text-[#737373] uppercase tracking-wider">Industry</label>
                  <p className="text-lg font-medium">{profile?.industry || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-xs text-[#737373] uppercase tracking-wider">Services</label>
                  <p className="text-lg font-medium">
                    {profile?.services?.length > 0 ? profile.services.join(', ') : 'Not detected'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-[#737373] uppercase tracking-wider">Target Customers</label>
                  <p className="text-lg font-medium">
                    {profile?.targetCustomers?.length > 0 ? profile.targetCustomers.join(', ') : 'Not detected'}
                  </p>
                </div>
              </div>
            </section>

            {/* Automation Health */}
            {health && (
              <section className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Automation Health</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(health).map(([key, value]) => (
                    <div key={key} className="text-center p-4 bg-[#0a0a0a] rounded-lg">
                      <div
                        className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2"
                        style={{ backgroundColor: `${getStatusColor(value as string)}20` }}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getStatusColor(value as string) }}
                        />
                      </div>
                      <p className="text-xs text-[#737373] uppercase tracking-wider mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      {getStatusBadge(value as string)}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Top Opportunities Preview */}
            <section className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top Opportunities</h3>
                <button
                  onClick={() => setActiveTab('opportunities')}
                  className="text-sm text-[#ef4444] hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {opportunities?.slice(0, 3).map((opp, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded-lg">
                    <div className="w-10 h-10 bg-[#ef4444]/10 rounded-lg flex items-center justify-center text-[#ef4444] font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{opp.title}</p>
                      <p className="text-sm text-[#737373]">{opp.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-[#ef4444]">{opp.priority_score}/10</div>
                      <p className="text-xs text-[#737373]">Priority Score</p>
                    </div>
                  </div>
                ))}
                {(!opportunities || opportunities.length === 0) && (
                  <p className="text-center text-[#737373] py-8">No opportunities detected</p>
                )}
              </div>
            </section>

            {/* Potential Impact */}
            {potentialImpact && potentialImpact.hoursPerMonth && (
              <section className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Potential Impact</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-[#22c55e]/10 rounded-lg">
                    <div className="text-4xl font-bold text-[#22c55e] mb-2">
                      {potentialImpact.hoursPerMonth}
                    </div>
                    <p className="text-sm text-[#737373]">Hours/Month Saved</p>
                  </div>
                  <div className="text-center p-6 bg-[#eab308]/10 rounded-lg">
                    <div className="text-4xl font-bold text-[#eab308] mb-2">
                      ${(potentialImpact.estimatedValue || 0).toLocaleString()}
                    </div>
                    <p className="text-sm text-[#737373]">Monthly Value (est.)</p>
                  </div>
                  <div className="text-center p-6 bg-[#ef4444]/10 rounded-lg">
                    <div className="text-4xl font-bold text-[#ef4444] mb-2">
                      {Math.round((potentialImpact.hoursPerMonth || 0) * 12)}
                    </div>
                    <p className="text-sm text-[#737373]">Hours/Year Saved</p>
                  </div>
                </div>
                {potentialImpact.assumptions && (
                  <div className="mt-4 p-3 bg-[#0a0a0a] rounded-lg">
                    <p className="text-xs text-[#737373]">
                      <strong>Assumptions:</strong> {potentialImpact.assumptions[0]}
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* Next Steps */}
            {nextSteps && nextSteps.length > 0 && (
              <section className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Recommended Next Steps</h3>
                <div className="space-y-4">
                  {['Quick Wins', 'Next Systems', 'Strategic Systems'].map(phase => {
                    const phaseSteps = nextSteps.filter((s: any) => s.phase === phase);
                    if (phaseSteps.length === 0) return null;
                    return (
                      <div key={phase}>
                        <h4 className="text-sm font-medium text-[#737373] mb-2">{phase}</h4>
                        {phaseSteps.map((step: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-lg mb-2">
                            <div className="w-6 h-6 bg-[#262626] rounded text-sm flex items-center justify-center">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-medium">{step.title}</p>
                              <p className="text-sm text-[#737373]">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'processes' && (
          <div className="space-y-6">
            <section className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Journey & Process Map</h3>
              <p className="text-[#737373] mb-6">
                Visual representation of how customers move through your business and where automation opportunities exist.
              </p>

              {/* Process Map Visualization */}
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {processMap?.nodes ? (
                    <div className="flex flex-col items-center gap-4">
                      {processMap.nodes.map((node: any, index: number) => (
                        <div key={node.id} className="w-full">
                          {/* Node */}
                          <div
                            className="card p-4 flex items-center gap-4"
                            style={{
                              borderLeftColor: getStatusColor(node.status),
                              borderLeftWidth: 4,
                            }}
                          >
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${getStatusColor(node.status)}20` }}
                            >
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getStatusColor(node.status) }}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{node.label}</p>
                                {getStatusBadge(node.status)}
                              </div>
                              <p className="text-sm text-[#737373] mt-1">{node.evidence}</p>
                              {node.recommendations?.[0] && (
                                <p className="text-sm text-[#ef4444] mt-1">
                                  Recommendation: {node.recommendations[0]}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-[#737373]">Confidence</p>
                              <p className="font-medium">{node.confidence}%</p>
                            </div>
                          </div>
                          {/* Arrow */}
                          {index < processMap.nodes.length - 1 && (
                            <div className="flex justify-center py-2">
                              <svg className="w-6 h-6 text-[#737373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-[#737373]">
                      <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>Process map data not available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-[#262626]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                  <span className="text-sm">Automated</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#eab308]" />
                  <span className="text-sm">Partial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                  <span className="text-sm">Manual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#737373]" />
                  <span className="text-sm">Unknown</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">
              Automation Opportunities ({opportunities?.length || 0})
            </h3>
            {opportunities?.map((opp, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 bg-[#ef4444] rounded-lg flex items-center justify-center text-white font-semibold">
                        {index + 1}
                      </span>
                      <h4 className="text-xl font-semibold">{opp.title}</h4>
                    </div>
                    <span className="badge badge-gray">{opp.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#ef4444]">{opp.priority_score}/10</div>
                    <p className="text-sm text-[#737373]">Priority Score</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-[#737373] uppercase tracking-wider">Problem</label>
                    <p className="mt-1">{opp.problem || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-[#737373] uppercase tracking-wider">Solution</label>
                    <p className="mt-1">{opp.automation_solution || 'Not specified'}</p>
                  </div>
                </div>

                {/* Evidence */}
                <div className="mt-6 p-4 bg-[#0a0a0a] rounded-lg">
                  <label className="text-xs text-[#737373] uppercase tracking-wider mb-2 block">Evidence</label>
                  <div className="space-y-2">
                    {opp.evidence?.map((ev: any, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className={`badge ${
                          ev.type === 'observed' ? 'badge-green' :
                          ev.type === 'inferred' ? 'badge-yellow' : 'badge-gray'
                        }`}>
                          {ev.type}
                        </span>
                        <span className="text-sm">{ev.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scores */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-[#0a0a0a] rounded-lg">
                    <div className="text-xl font-semibold">{opp.business_impact}/10</div>
                    <p className="text-xs text-[#737373]">Impact</p>
                  </div>
                  <div className="text-center p-3 bg-[#0a0a0a] rounded-lg">
                    <div className="text-xl font-semibold">{opp.frequency}/10</div>
                    <p className="text-xs text-[#737373]">Frequency</p>
                  </div>
                  <div className="text-center p-3 bg-[#0a0a0a] rounded-lg">
                    <div className="text-xl font-semibold">{opp.automation_fit}/10</div>
                    <p className="text-xs text-[#737373]">Automation Fit</p>
                  </div>
                  <div className="text-center p-3 bg-[#0a0a0a] rounded-lg">
                    <div className="text-xl font-semibold">{opp.confidence}%</div>
                    <p className="text-xs text-[#737373]">Confidence</p>
                  </div>
                </div>

                {opp.reasoning && (
                  <div className="mt-4 p-3 bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-lg">
                    <p className="text-sm"><strong>Reasoning:</strong> {opp.reasoning}</p>
                  </div>
                )}
              </div>
            ))}
            {(!opportunities || opportunities.length === 0) && (
              <div className="card p-12 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-[#737373] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-[#737373]">No opportunities detected</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'blueprints' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">
              Automation Blueprints ({blueprints?.length || 0})
            </h3>
            {blueprints?.map((bp, index) => (
              <div key={index} className="card p-6">
                <h4 className="text-xl font-semibold mb-2">{bp.title}</h4>
                {bp.trigger_description && (
                  <p className="text-[#737373] mb-4">
                    <strong>Trigger:</strong> {bp.trigger_description}
                  </p>
                )}

                {/* Workflow Steps */}
                <div className="mt-6">
                  <label className="text-xs text-[#737373] uppercase tracking-wider mb-3 block">Workflow</label>
                  <div className="space-y-3">
                    {bp.workflow_steps?.map((step: any, i: number) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-[#ef4444] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {step.order || i + 1}
                        </div>
                        <div className="flex-1 p-3 bg-[#0a0a0a] rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{step.action}</span>
                            {step.automation && (
                              <span className={`badge ${
                                step.automation === 'ai' ? 'badge-red' :
                                step.automation === 'auto' ? 'badge-green' : 'badge-gray'
                              }`}>
                                {step.automation}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#737373]">{step.description}</p>
                          {step.ai_action && (
                            <p className="text-sm text-[#ef4444] mt-1">AI: {step.ai_action}</p>
                          )}
                          {step.human_handoff && (
                            <p className="text-sm text-[#eab308] mt-1">Human Handoff Required</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technology Stack */}
                {bp.technology_stack && bp.technology_stack.length > 0 && (
                  <div className="mt-6">
                    <label className="text-xs text-[#737373] uppercase tracking-wider mb-2 block">Recommended Stack</label>
                    <div className="flex flex-wrap gap-2">
                      {bp.technology_stack.map((tech: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-[#262626] rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Failure Handling */}
                {bp.failure_handling && (
                  <div className="mt-4 p-3 bg-[#eab308]/5 border border-[#eab308]/20 rounded-lg">
                    <p className="text-sm">
                      <strong className="text-[#eab308]">Failure Handling:</strong> {bp.failure_handling}
                    </p>
                  </div>
                )}
              </div>
            ))}
            {(!blueprints || blueprints.length === 0) && (
              <div className="card p-12 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-[#737373] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-[#737373]">No blueprints generated yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'report' && (
          <div className="space-y-6">
            <section className="card p-6">
              <h3 className="text-xl font-semibold mb-6">01 — Business Snapshot</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-[#737373] uppercase">Company Name</label>
                  <p className="text-lg">{profile?.companyName || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-xs text-[#737373] uppercase">Industry</label>
                  <p className="text-lg">{profile?.industry || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-xs text-[#737373] uppercase">Location</label>
                  <p className="text-lg">{profile?.location || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-xs text-[#737373] uppercase">Primary CTA</label>
                  <p className="text-lg">{profile?.primaryCTA || 'Unknown'}</p>
                </div>
              </div>
            </section>

            <section className="card p-6">
              <h3 className="text-xl font-semibold mb-6">02 — Customer Journey</h3>
              {report?.content?.customerJourney?.length > 0 ? (
                <div className="space-y-3">
                  {report.content.customerJourney.map((stage: any, i: number) => (
                    <div key={i} className="p-4 bg-[#0a0a0a] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{stage.stage}</span>
                        <span className={`badge ${
                          stage.evidence_type === 'observed' ? 'badge-green' :
                          stage.evidence_type === 'inferred' ? 'badge-yellow' : 'badge-gray'
                        }`}>
                          {stage.evidence_type}
                        </span>
                      </div>
                      <p className="text-sm text-[#737373]">{stage.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#737373]">No customer journey data available</p>
              )}
            </section>

            <section className="card p-6">
              <h3 className="text-xl font-semibold mb-6">03 — Automation Health</h3>
              {health && (
                <div className="space-y-4">
                  {Object.entries(health).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      {getStatusBadge(value as string)}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="card p-6">
              <h3 className="text-xl font-semibold mb-6">04 — Top Opportunities</h3>
              {opportunities?.slice(0, 5).map((opp, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded-lg mb-3">
                  <div className="w-8 h-8 bg-[#ef4444] rounded flex items-center justify-center text-white font-semibold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{opp.title}</p>
                    <p className="text-sm text-[#737373]">{opp.category}</p>
                  </div>
                  <span className="text-xl font-bold text-[#ef4444]">{opp.priority_score}/10</span>
                </div>
              ))}
            </section>

            <section className="card p-6">
              <h3 className="text-xl font-semibold mb-6">08 — Unknowns</h3>
              <ul className="space-y-2">
                {report?.content?.unknowns?.map((unknown: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-[#737373]">
                    <span className="text-[#ef4444]">•</span>
                    {unknown}
                  </li>
                )) || (
                  <li className="text-[#737373]">No unknowns documented</li>
                )}
              </ul>
            </section>

            <section className="card p-6">
              <h3 className="text-xl font-semibold mb-6">09 — Recommended Next Steps</h3>
              {nextSteps?.map((step: any, i: number) => (
                <div key={i} className="p-4 bg-[#0a0a0a] rounded-lg mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-[#ef4444] uppercase">{step.phase}</span>
                    <span className="text-[#737373]">•</span>
                    <span className="font-medium">{step.title}</span>
                  </div>
                  <p className="text-sm text-[#737373]">{step.description}</p>
                </div>
              ))}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
