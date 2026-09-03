'use client';

import React from 'react';
import { Play, CheckCircle2, XCircle, Activity, Sparkles, MessageSquare } from 'lucide-react';
import { SimulationResult } from '@/lib/types';

interface SimulationPanelProps {
  simulation: SimulationResult | null;
  isSimulating: boolean;
}

export function SimulationPanel({ simulation, isSimulating }: SimulationPanelProps) {
  if (isSimulating) {
    return (
      <div className="bg-stellar-card border border-stellar-border rounded-xl p-12 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-stellar-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <div>
          <h3 className="text-sm font-semibold text-white">Simulating Execution on Soroban RPC...</h3>
          <p className="text-xs text-gray-400">Evaluating CPU footprint, memory bytes, min fees, and return codes.</p>
        </div>
      </div>
    );
  }

  if (!simulation) {
    return (
      <div className="bg-stellar-card border border-stellar-border rounded-xl p-8 text-center space-y-3">
        <Activity className="w-8 h-8 text-gray-500 mx-auto" />
        <h3 className="text-sm font-semibold text-white">Simulation Idle</h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Click <strong>Simulate Pre-Execution</strong> above to dry-run this transaction envelope against live network RPC nodes without broadcasting to the ledger.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Simulation Outcome Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between ${
          simulation.success
            ? 'bg-stellar-green/10 border-stellar-green/30 text-stellar-green'
            : 'bg-stellar-red/10 border-stellar-red/30 text-stellar-red'
        }`}
      >
        <div className="flex items-center space-x-3">
          {simulation.success ? (
            <CheckCircle2 className="w-6 h-6 shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 shrink-0" />
          )}
          <div>
            <h3 className="font-bold text-sm">
              Simulation Outcome: {simulation.status}
            </h3>
            <p className="text-xs text-gray-300">
              {simulation.success
                ? 'Transaction executed cleanly in VM simulation. No state changes broadcast.'
                : simulation.error || 'Execution failed during RPC VM simulation.'}
            </p>
          </div>
        </div>

        {simulation.minResourceFee && (
          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Min Resource Fee</span>
            <span className="font-mono text-sm font-bold text-white">{simulation.minResourceFee} stroops</span>
          </div>
        )}
      </div>

      {/* Return Values */}
      {simulation.results && simulation.results.length > 0 && (
        <div className="bg-stellar-card border border-stellar-border rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-stellar-amber" />
            <h3 className="text-sm font-semibold text-white">Simulation Return Values</h3>
          </div>

          <div className="space-y-2">
            {simulation.results.map((res, idx) => (
              <div key={idx} className="bg-stellar-dark/80 border border-stellar-border rounded-lg p-3 space-y-1">
                <div className="text-xs font-semibold text-gray-400 font-mono">Result #{idx + 1}:</div>
                <div className="font-mono text-xs text-stellar-cyan bg-stellar-card p-2 rounded overflow-x-auto">
                  <pre>{JSON.stringify(res.returnValue, null, 2)}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emitted Events */}
      {simulation.events && simulation.events.length > 0 && (
        <div className="bg-stellar-card border border-stellar-border rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-stellar-purple" />
            <h3 className="text-sm font-semibold text-white">
              Emitted Events ({simulation.events.length})
            </h3>
          </div>

          <div className="space-y-2">
            {simulation.events.map((ev, idx) => (
              <div key={idx} className="bg-stellar-dark/80 border border-stellar-border rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-stellar-purple font-semibold">Event Type: {ev.type}</span>
                  {ev.contractId && (
                    <span className="text-gray-400 text-[11px]">Contract: {ev.contractId.substring(0, 10)}...</span>
                  )}
                </div>

                {ev.topics.length > 0 && (
                  <div className="text-xs font-mono text-gray-300">
                    Topics: <span className="text-stellar-cyan">{ev.topics.join(' > ')}</span>
                  </div>
                )}

                <div className="font-mono text-xs text-gray-200 bg-stellar-card p-2 rounded truncate">
                  Value: {ev.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
