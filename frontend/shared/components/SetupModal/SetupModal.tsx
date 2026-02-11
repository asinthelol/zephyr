'use client';

import { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { SetupModalProps } from '@/shared/components/types';

export function SetupModal({ isOpen, onClose }: SetupModalProps) {
  const [mode, setMode] = useState<'choice' | 'apiKey'>('choice');
  const [apiKey, setApiKey] = useState('');
  const [domain, setDomain] = useState('');

  if (!isOpen) return null;

  const handleDummyData = () => {
    onClose({ useDummyData: true });
  }

  const handleApiKeySubmit = () => {
    if (apiKey.trim() && domain.trim()) {
      onClose({
        useDummyData: false,
        apiKey: apiKey.trim(),
        domain: domain.trim(),
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <div className="bg-card-bg border border-border-default rounded-lg max-w-md w-full p-6 shadow-xl">

        {mode === 'choice' && (
          <>
            <h2 className="text-text-primary text-2xl font-semibold mb-2">
              Welcome to Zephyr Analytics
            </h2>
            <p className="text-text-muted text-sm mb-6">
              Choose how you&#39;d like to get started
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setMode('apiKey')}
                className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-text-primary rounded-lg transition-colors text-left"
              >
                <div className="font-medium mb-1">Add API Key</div>
                <div className="text-sm opacity-90">
                  Connect your website to start tracking real data
                </div>
              </button>

              <button
                onClick={handleDummyData}
                className="w-full p-4 bg-analytics-item-bg hover:bg-card-bg border border-border-default rounded-lg transition-colors text-left"
              >
                <div className="font-medium text-text-primary mb-1">
                  Use Demo Data
                </div>
                <div className="text-sm text-text-muted">
                  Explore the dashboard with example data
                </div>
              </button>
            </div>
          </>
        )}

        {mode === 'apiKey' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-text-primary text-xl font-semibold">
                Add Your Website
              </h2>
              <button
                onClick={() => setMode('choice')}
                className="p-2 hover:bg-analytics-item-bg rounded transition-colors"
              >
                <MdClose className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                  Website Domain
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com"
                  className="w-full px-4 py-2 bg-analytics-item-bg border border-border-default rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                  API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full px-4 py-2 bg-analytics-item-bg border border-border-default rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
                <p className="text-text-muted text-xs mt-2">
                  Get your API key from your Zephyr Analytics dashboard
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleApiKeySubmit}
                  disabled={!apiKey.trim() || !domain.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-text-primary rounded-lg transition-colors font-medium"
                >
                  Continue
                </button>
                <button
                  onClick={handleDummyData}
                  className="px-4 py-2 bg-analytics-item-bg hover:bg-card-bg border border-border-default text-text-primary rounded-lg transition-colors"
                >
                  Use Demo Instead
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}