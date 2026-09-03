'use client';

import React from 'react';
import { Code2, Play, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { SAMPLES, XdrSample } from '@/lib/samples';

interface XdrInputProps {
  xdr: string;
  onChange: (val: string) => void;
  onClear: () => void;
  onSimulate: () => void;
  isSimulating: boolean;
  error?: string | null;
}

export function XdrInput({
  xdr,
  onChange,
  onClear,
  onSimulate,
  isSimulating,
  error,
}: XdrInputProps) {
  return (
    <div className="bg-stellar-card border border-stellar-border rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-stellar-accent" />
          <h2 className="text-base font-semibold text-white">Stellar / Soroban XDR Payload</h2>
        </div>
        <div className="flex items-center space-x-2">
          {xdr && (
            <button
              onClick={onClear}
              className="flex items-center space-x-1 text-xs text-gray-400 hover:text-stellar-red transition-colors px-2 py-1 rounded bg-stellar-dark/50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-3 overflow-x-auto pb-1">
        <span className="text-xs font-medium text-gray-400 flex items-center space-x-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-stellar-amber" />
          <span>Samples:</span>
        </span>
        {SAMPLES.map((sample: XdrSample) => (
          <button
            key={sample.id}
            onClick={() => onChange(sample.xdr)}
            className="text-xs px-2.5 py-1 rounded-md bg-stellar-dark/80 hover:bg-stellar-accent/20 border border-stellar-border text-gray-300 hover:text-stellar-accent transition-colors shrink-0 font-mono"
            title={sample.description}
          >
            {sample.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <textarea
          value={xdr}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste Base64 TransactionEnvelope or TransactionResult XDR string..."
          rows={5}
          className="w-full bg-stellar-dark border border-stellar-border rounded-lg p-3 font-mono text-xs text-gray-200 focus:outline-none focus:border-stellar-accent transition-colors placeholder:text-gray-600 resize-y"
        />
      </div>

      {error && (
        <div className="mt-3 p-3 rounded-lg bg-stellar-red/10 border border-stellar-red/30 flex items-start space-x-2.5 text-xs text-stellar-red">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">XDR Parse Error: </span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          {xdr ? `${xdr.trim().length} characters` : 'Ready for decoding & simulation'}
        </div>
        <button
          onClick={onSimulate}
          disabled={!xdr.trim() || isSimulating}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-stellar-accent to-stellar-purple hover:from-stellar-accentHover hover:to-stellar-purple text-white font-medium text-xs shadow-lg shadow-stellar-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          <span>{isSimulating ? 'Simulating on RPC...' : 'Simulate Pre-Execution'}</span>
        </button>
      </div>
    </div>
  );
}
