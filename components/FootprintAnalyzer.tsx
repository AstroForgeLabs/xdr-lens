'use client';

import React from 'react';
import { Cpu, HardDrive, Lock, ShieldCheck, Database, KeyRound, AlertTriangle } from 'lucide-react';
import { SorobanResourceSummary } from '@/lib/types';

interface FootprintAnalyzerProps {
  resources: SorobanResourceSummary | null;
  simulatedCpu?: number;
  simulatedMem?: number;
  simulatedMinFee?: string;
}

export function FootprintAnalyzer({
  resources,
  simulatedCpu,
  simulatedMem,
  simulatedMinFee,
}: FootprintAnalyzerProps) {
  if (!resources) {
    return (
      <div className="bg-stellar-card border border-stellar-border rounded-xl p-8 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-stellar-amber mx-auto" />
        <h3 className="text-sm font-semibold text-white">No Soroban Data Footprint Detected</h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          This transaction envelope does not contain Soroban resources or contract host functions. Footprint inspection is only available for Soroban smart contract calls.
        </p>
      </div>
    );
  }

  const cpuInst = simulatedCpu || resources.cpuInstructions;
  const memBytes = simulatedMem || resources.memoryBytes;
  const minFee = simulatedMinFee || resources.minResourceFee;

  return (
    <div className="space-y-4">
      {/* Resource Metrics Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-stellar-card border border-stellar-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-stellar-accent" />
              <span>CPU Instructions</span>
            </span>
            <span className="text-[10px] text-stellar-accent font-semibold uppercase">Gas Meter</span>
          </div>
          <p className="font-mono text-lg font-bold text-white">
            {cpuInst.toLocaleString()} <span className="text-xs font-normal text-gray-400">insns</span>
          </p>
        </div>

        <div className="bg-stellar-card border border-stellar-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center space-x-1.5">
              <HardDrive className="w-4 h-4 text-stellar-cyan" />
              <span>RAM / Read Bytes</span>
            </span>
            <span className="text-[10px] text-stellar-cyan font-semibold uppercase">Footprint Size</span>
          </div>
          <p className="font-mono text-lg font-bold text-white">
            {(memBytes / 1024).toFixed(2)} <span className="text-xs font-normal text-gray-400">KB</span>
          </p>
        </div>

        <div className="bg-stellar-card border border-stellar-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center space-x-1.5">
              <KeyRound className="w-4 h-4 text-stellar-green" />
              <span>Min Resource Fee</span>
            </span>
            <span className="text-[10px] text-stellar-green font-semibold uppercase">Estimated</span>
          </div>
          <p className="font-mono text-lg font-bold text-white">
            {minFee} <span className="text-xs font-normal text-gray-400">stroops</span>
          </p>
        </div>
      </div>

      {/* Ledger Footprint Keys Breakdown */}
      <div className="bg-stellar-card border border-stellar-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-stellar-purple" />
            <h3 className="text-sm font-semibold text-white">
              Ledger Storage Footprint Breakdown ({resources.footprintKeys.length} Keys)
            </h3>
          </div>
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="flex items-center space-x-1 text-stellar-cyan">
              <Lock className="w-3 h-3" />
              <span>ReadOnly: {resources.readOnlyFootprintCount}</span>
            </span>
            <span className="flex items-center space-x-1 text-stellar-amber">
              <ShieldCheck className="w-3 h-3" />
              <span>ReadWrite: {resources.readWriteFootprintCount}</span>
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          {resources.footprintKeys.map((key, idx) => (
            <div
              key={idx}
              className="bg-stellar-dark/80 border border-stellar-border rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded border ${
                      key.accessType === 'readOnly'
                        ? 'bg-stellar-cyan/10 text-stellar-cyan border-stellar-cyan/30'
                        : 'bg-stellar-amber/10 text-stellar-amber border-stellar-amber/30'
                    }`}
                  >
                    {key.accessType}
                  </span>
                  <span className="text-xs font-semibold text-white capitalize">{key.type} Storage Key</span>
                </div>
                <p className="text-xs font-mono text-gray-300">{key.details}</p>
                {key.contractId && (
                  <p className="text-[11px] font-mono text-gray-400 truncate max-w-md">
                    Contract ID: {key.contractId}
                  </p>
                )}
              </div>

              <div className="shrink-0 font-mono text-[10px] text-gray-500 bg-stellar-card px-2 py-1 rounded border border-stellar-border">
                Hash: {key.keyXdr.substring(0, 12)}...
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
