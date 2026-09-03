'use client';

import React from 'react';
import { FileText, Key, Hash, Coins, Clock, Layers, CheckCircle2 } from 'lucide-react';
import { DecodedEnvelope } from '@/lib/types';

interface EnvelopeDecoderProps {
  envelope: DecodedEnvelope;
}

export function EnvelopeDecoder({ envelope }: EnvelopeDecoderProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-stellar-card border border-stellar-border rounded-xl p-4">
          <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
            <Key className="w-3.5 h-3.5 text-stellar-cyan" />
            <span>Source Account</span>
          </div>
          <p className="font-mono text-xs text-gray-200 truncate" title={envelope.sourceAccount}>
            {envelope.sourceAccount}
          </p>
        </div>

        <div className="bg-stellar-card border border-stellar-border rounded-xl p-4">
          <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
            <Hash className="w-3.5 h-3.5 text-stellar-purple" />
            <span>Sequence Number</span>
          </div>
          <p className="font-mono text-xs font-semibold text-gray-200">{envelope.sequenceNumber}</p>
        </div>

        <div className="bg-stellar-card border border-stellar-border rounded-xl p-4">
          <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
            <Coins className="w-3.5 h-3.5 text-stellar-green" />
            <span>Base Fee (stroops)</span>
          </div>
          <p className="font-mono text-xs font-semibold text-gray-200">{envelope.fee} stroops</p>
        </div>
      </div>

      {envelope.feeBump && (
        <div className="p-3 bg-stellar-amber/10 border border-stellar-amber/30 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-stellar-amber">
            <Coins className="w-4 h-4" />
            <span className="font-semibold">Fee-Bump Wrapped:</span>
            <span className="font-mono text-gray-300">Payer: {envelope.feeBump.feeSource}</span>
          </div>
          <span className="font-mono bg-stellar-dark/60 px-2 py-0.5 rounded text-stellar-amber border border-stellar-amber/20">
            Outer Fee: {envelope.feeBump.fee} stroops
          </span>
        </div>
      )}

      <div className="bg-stellar-card border border-stellar-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-stellar-accent" />
            <h3 className="text-sm font-semibold text-white">
              Operations Tree ({envelope.operations.length})
            </h3>
          </div>
          {envelope.hasSorobanData && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stellar-purple/20 text-stellar-purple border border-stellar-purple/30">
              Soroban Smart Contract Invocation
            </span>
          )}
        </div>

        <div className="space-y-3">
          {envelope.operations.map((op, index) => (
            <div
              key={index}
              className="bg-stellar-dark/70 border border-stellar-border rounded-lg p-3.5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-stellar-cyan bg-stellar-cyan/10 px-2 py-0.5 rounded border border-stellar-cyan/20">
                  Op #{index + 1}: {op.type}
                </span>
                {op.sourceAccount && (
                  <span className="text-[11px] font-mono text-gray-400">
                    Op Source: {op.sourceAccount.substring(0, 8)}...
                  </span>
                )}
              </div>

              <div className="bg-stellar-card/50 rounded p-2.5 font-mono text-xs text-gray-300 overflow-x-auto max-h-40">
                <pre>{JSON.stringify(op.details, null, 2)}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
