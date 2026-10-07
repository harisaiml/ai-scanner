'use client';

import { useState } from 'react';

interface ScanFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  error?: string;
}

export default function ScanForm({ onSubmit, isSubmitting, error }: ScanFormProps) {
  const [formData, setFormData] = useState({
    websiteUrl: '',
    companyName: '',
    industry: '',
    location: '',
    employeesCount: '',
    leadsPerMonth: '',
    currentCrm: '',
    additionalContext: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="card p-8">
        {error && (
          <div className="mb-6 p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg text-[#ef4444] text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Website URL - Required */}
          <div>
            <label htmlFor="websiteUrl" className="block text-sm font-medium mb-2">
              Website URL <span className="text-[#ef4444]">*</span>
            </label>
            <input
              type="url"
              id="websiteUrl"
              name="websiteUrl"
              required
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder="https://example-roofing.com"
              className="input"
            />
            <p className="mt-1 text-xs text-[#737373]">Enter the website you want to analyze</p>
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium mb-2">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="ABC Roofing"
              className="input"
            />
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium mb-2">
              Industry
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select an industry</option>
              <option value="Roofing">Roofing</option>
              <option value="HVAC">HVAC</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Landscaping">Landscaping</option>
              <option value="Home Cleaning">Home Cleaning</option>
              <option value="Auto Repair">Auto Repair</option>
              <option value="Medical">Medical</option>
              <option value="Legal">Legal</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Insurance">Insurance</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Marketing">Marketing</option>
              <option value="Technology">Technology</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Texas, USA"
              className="input"
            />
          </div>

          {/* Advanced Options Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-[#737373] hover:text-white transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Advanced Options
          </button>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-6 pt-4 border-t border-[#262626]">
              {/* Employees Count */}
              <div>
                <label htmlFor="employeesCount" className="block text-sm font-medium mb-2">
                  Number of Employees
                </label>
                <select
                  id="employeesCount"
                  name="employeesCount"
                  value={formData.employeesCount}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select range</option>
                  <option value="1">Just me</option>
                  <option value="2-5">2-5</option>
                  <option value="6-10">6-10</option>
                  <option value="11-25">11-25</option>
                  <option value="26-50">26-50</option>
                  <option value="51+">51+</option>
                </select>
              </div>

              {/* Leads Per Month */}
              <div>
                <label htmlFor="leadsPerMonth" className="block text-sm font-medium mb-2">
                  Approximate Leads per Month
                </label>
                <input
                  type="number"
                  id="leadsPerMonth"
                  name="leadsPerMonth"
                  value={formData.leadsPerMonth}
                  onChange={handleChange}
                  placeholder="50"
                  min="0"
                  className="input"
                />
              </div>

              {/* Current CRM */}
              <div>
                <label htmlFor="currentCrm" className="block text-sm font-medium mb-2">
                  Current CRM (if any)
                </label>
                <select
                  id="currentCrm"
                  name="currentCrm"
                  value={formData.currentCrm}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">None / Not sure</option>
                  <option value="HubSpot">HubSpot</option>
                  <option value="Salesforce">Salesforce</option>
                  <option value="Pipedrive">Pipedrive</option>
                  <option value="Zoho">Zoho CRM</option>
                  <option value="Keap">Keap</option>
                  <option value="GoHighLevel">GoHighLevel</option>
                  <option value="Custom">Custom-built</option>
                  <option value="Spreadsheet">Spreadsheets</option>
                </select>
              </div>

              {/* Additional Context */}
              <div>
                <label htmlFor="additionalContext" className="block text-sm font-medium mb-2">
                  Additional Context
                </label>
                <textarea
                  id="additionalContext"
                  name="additionalContext"
                  value={formData.additionalContext}
                  onChange={handleChange}
                  placeholder="Any specific challenges or areas of focus..."
                  rows={3}
                  className="input resize-none"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !formData.websiteUrl}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg"
          >
            {isSubmitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Scanning...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Scan Business
              </>
            )}
          </button>
        </div>

        <p className="mt-6 text-xs text-[#737373] text-center">
          By clicking "Scan Business", you agree to let us analyze your website.
          This scan is free and takes about 1-2 minutes.
        </p>
      </form>
    </div>
  );
}
