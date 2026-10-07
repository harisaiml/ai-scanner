'use client';

import { useState } from 'react';
import ScanForm from '@/components/ScanForm';
import ScanProgress from '@/components/ScanProgress';
import Dashboard from '@/components/Dashboard';

interface ScanData {
  scanId: string;
  status: string;
  progress: number;
  currentStep: string;
  businessProfile?: any;
  opportunities?: any[];
  blueprints?: any[];
  report?: any;
}

export default function Home() {
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanStart = async (formData: any) => {
    setIsScanning(true);
    setScanData({
      scanId: '',
      status: 'pending',
      progress: 0,
      currentStep: 'Starting scan...',
    });

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to start scan');
      }

      setScanData({
        scanId: result.scanId,
        status: 'running',
        progress: 0,
        currentStep: 'Initializing...',
      });

      // Start polling for status
      pollScanStatus(result.scanId);
    } catch (error: any) {
      setIsScanning(false);
      setScanData({
        scanId: '',
        status: 'failed',
        progress: 0,
        currentStep: error.message,
      });
    }
  };

  const pollScanStatus = async (scanId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/scan/${scanId}`);
        const data = await response.json();

        if (data.scan) {
          setScanData({
            scanId,
            status: data.scan.status,
            progress: data.scan.progress,
            currentStep: data.scan.current_step || 'Processing...',
            businessProfile: data.businessProfile,
            opportunities: data.opportunities,
            blueprints: data.blueprints,
            report: data.report,
          });

          if (data.scan.status === 'completed' || data.scan.status === 'failed') {
            setIsScanning(false);
            return;
          }
        }
      } catch (error) {
        console.error('Poll error:', error);
      }

      // Continue polling
      if (isScanning) {
        setTimeout(poll, 3000);
      }
    };

    poll();
  };

  const handleReset = () => {
    setScanData(null);
    setIsScanning(false);
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#ef4444] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold">AI Scanner</h1>
            </div>
            <nav className="flex items-center gap-6 text-sm text-[#737373]">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {!scanData || scanData.status === 'failed' ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 tracking-tight">
                Find Your Business<br />
                <span className="text-[#ef4444]">Automation Opportunities</span>
              </h2>
              <p className="text-xl text-[#737373] max-w-2xl mx-auto mb-8">
                Enter your website and let AI analyze your business processes to identify where automation can save time and increase revenue.
              </p>
            </div>

            {/* Scan Form */}
            <ScanForm onSubmit={handleScanStart} isSubmitting={isScanning} error={scanData?.status === 'failed' ? scanData.currentStep : undefined} />

            {/* Features Section */}
            <section id="features" className="mt-24">
              <h3 className="text-2xl font-semibold text-center mb-12">What We Analyze</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="card p-6">
                  <div className="w-12 h-12 bg-[#ef4444]/10 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Website Analysis</h4>
                  <p className="text-[#737373] text-sm">Deep analysis of your website structure, forms, CTAs, and customer touchpoints.</p>
                </div>
                <div className="card p-6">
                  <div className="w-12 h-12 bg-[#ef4444]/10 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Customer Journey</h4>
                  <p className="text-[#737373] text-sm">Mapping of how customers discover, contact, and engage with your business.</p>
                </div>
                <div className="card p-6">
                  <div className="w-12 h-12 bg-[#ef4444]/10 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Automation Opportunities</h4>
                  <p className="text-[#737373] text-sm">Identification of processes that can be automated to save time and reduce manual work.</p>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="mt-24">
              <h3 className="text-2xl font-semibold text-center mb-12">How It Works</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#262626] rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-semibold">1</div>
                  <h4 className="font-semibold mb-2">Enter Website</h4>
                  <p className="text-[#737373] text-sm">Provide your business website URL</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#262626] rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-semibold">2</div>
                  <h4 className="font-semibold mb-2">AI Research</h4>
                  <p className="text-[#737373] text-sm">Our AI analyzes your online presence</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#262626] rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-semibold">3</div>
                  <h4 className="font-semibold mb-2">Process Mapping</h4>
                  <p className="text-[#737373] text-sm">Maps your customer journey and processes</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#262626] rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-semibold">4</div>
                  <h4 className="font-semibold mb-2">Get Report</h4>
                  <p className="text-[#737373] text-sm">Receive detailed automation recommendations</p>
                </div>
              </div>
            </section>
          </>
        ) : isScanning ? (
          <ScanProgress
            progress={scanData.progress}
            currentStep={scanData.currentStep}
            status={scanData.status}
          />
        ) : (
          <Dashboard
            businessProfile={scanData.businessProfile}
            opportunities={scanData.opportunities}
            blueprints={scanData.blueprints}
            report={scanData.report}
            onReset={handleReset}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#262626] mt-24">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between text-sm text-[#737373]">
            <p>AI Automation Opportunity Scanner</p>
            <p>Powered by AI</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
