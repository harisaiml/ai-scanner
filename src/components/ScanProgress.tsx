'use client';

import { useState, useEffect } from 'react';

interface ScanProgressProps {
  progress: number;
  currentStep: string;
  status: string;
}

const SCAN_STEPS = [
  { id: 'validating', name: 'Validating URL', status: 'pending' },
  { id: 'researching', name: 'Researching website', status: 'pending' },
  { id: 'identifying', name: 'Identifying business', status: 'pending' },
  { id: 'understanding', name: 'Understanding services', status: 'pending' },
  { id: 'mapping', name: 'Mapping customer journey', status: 'pending' },
  { id: 'detecting', name: 'Detecting lead channels', status: 'pending' },
  { id: 'analyzing', name: 'Analyzing processes', status: 'pending' },
  { id: 'opportunities', name: 'Finding opportunities', status: 'pending' },
  { id: 'scoring', name: 'Scoring opportunities', status: 'pending' },
  { id: 'generating', name: 'Generating report', status: 'pending' },
];

export default function ScanProgress({ progress, currentStep, status }: ScanProgressProps) {
  const [steps, setSteps] = useState(SCAN_STEPS);
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Animate loading dots
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update step statuses based on progress
    const updatedSteps = SCAN_STEPS.map((step, index) => {
      const stepProgress = (index + 1) * 10;
      if (progress >= stepProgress) {
        return { ...step, status: 'completed' };
      } else if (progress >= (index) * 10 && progress < stepProgress) {
        return { ...step, status: 'in_progress' };
      }
      return step;
    });
    setSteps(updatedSteps);
  }, [progress]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#ef4444]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#ef4444] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Analyzing Your Business</h2>
          <p className="text-[#737373]">
            {currentStep || 'Initializing...'}{dots}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#737373]">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="progress-bar h-2">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                step.status === 'completed'
                  ? 'bg-[#22c55e]/10'
                  : step.status === 'in_progress'
                  ? 'bg-[#ef4444]/10'
                  : 'bg-[#141414]'
              }`}
            >
              {/* Status Icon */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                step.status === 'completed'
                  ? 'bg-[#22c55e]'
                  : step.status === 'in_progress'
                  ? 'bg-[#ef4444]'
                  : 'bg-[#262626]'
              }`}>
                {step.status === 'completed' ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.status === 'in_progress' ? (
                  <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[#737373]" />
                )}
              </div>

              {/* Step Name */}
              <span className={`flex-1 ${
                step.status === 'completed'
                  ? 'text-[#22c55e]'
                  : step.status === 'in_progress'
                  ? 'text-white'
                  : 'text-[#737373]'
              }`}>
                {step.name}
              </span>

              {/* Status Text */}
              {step.status === 'completed' && (
                <span className="badge badge-green">Complete</span>
              )}
              {step.status === 'in_progress' && (
                <span className="badge badge-red animate-pulse">In Progress</span>
              )}
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-[#141414] rounded-lg border border-[#262626]">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-[#737373] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-[#737373]">
              <p className="mb-1">This scan typically takes 1-2 minutes depending on website complexity.</p>
              <p>Our AI is analyzing your website to identify automation opportunities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
