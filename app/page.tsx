'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { XdrInput } from '@/components/XdrInput';
import { EnvelopeDecoder } from '@/components/EnvelopeDecoder';
import { FootprintAnalyzer } from '@/components/FootprintAnalyzer';
import { AuthTreeVisualizer } from '@/components/AuthTreeVisualizer';
import { SimulationPanel } from '@/components/SimulationPanel';
import { NETWORKS, StellarNetwork, DecodedEnvelope, SorobanResourceSummary, AuthNode, SimulationResult } from '@/lib/types';
import { SAMPLES } from '@/lib/samples';
import { parseXdrEnvelope, extractSorobanResourceSummary } from '@/lib/xdr-parser';
import { extractAuthTrees } from '@/lib/auth-tree-parser';
import { simulateSorobanTransaction } from '@/lib/soroban-simulator';
import { Layers, Cpu, Shield, Activity, Sparkles } from 'lucide-react';

export default function Home() {
  const [network, setNetwork] = useState<StellarNetwork>('testnet');
  const [xdr, setXdr] = useState<string>(SAMPLES[0].xdr);
  const [activeTab, setActiveTab] = useState<'envelope' | 'footprint' | 'auth' | 'simulation'>('envelope');

  const [decodedEnvelope, setDecodedEnvelope] = useState<DecodedEnvelope | null>(null);
  const [sorobanResources, setSorobanResources] = useState<SorobanResourceSummary | null>(null);
  const [authTrees, setAuthTrees] = useState<AuthNode[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Parse XDR whenever xdr or network changes
  useEffect(() => {
    if (!xdr.trim()) {
      setDecodedEnvelope(null);
      setSorobanResources(null);
      setAuthTrees([]);
      setParseError(null);
      setSimulation(null);
      return;
    }

    try {
      const passphrase = NETWORKS[network].networkPassphrase;
      const env = parseXdrEnvelope(xdr, passphrase);
      const res = extractSorobanResourceSummary(xdr, passphrase);
      const trees = extractAuthTrees(xdr, passphrase);

      setDecodedEnvelope(env);
      setSorobanResources(res);
      setAuthTrees(trees);
      setParseError(null);
    } catch (err) {
      setParseError((err as Error).message);
      setDecodedEnvelope(null);
      setSorobanResources(null);
      setAuthTrees([]);
    }
  }, [xdr, network]);

  const handleSimulate = async () => {
    if (!xdr.trim()) return;
    setIsSimulating(true);
    setActiveTab('simulation');
    
    try {
      const result = await simulateSorobanTransaction(xdr, network);
      setSimulation(result);
    } catch (err) {
      setSimulation({
        success: false,
        status: 'SIMULATION_ERROR',
        error: (err as Error).message,
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-stellar-dark text-white flex flex-col">
      <Navbar network={network} onNetworkChange={setNetwork} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Hero Banner */}
        <div className="bg-gradient-to-r from-stellar-card via-stellar-dark to-stellar-card border border-stellar-border rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-stellar-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-stellar-accent/10 border border-stellar-accent/30 text-stellar-accent text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Stellar Protocol 20+ & Soroban Smart Contract Diagnostics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Soroban Pre-Execution Diagnostic Studio
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Decode raw Base64 XDR payloads, analyze CPU gas footprint & RAM read bytes, inspect nested authorization call trees, and dry-run execution against Stellar testnet/mainnet RPC nodes before signing.
            </p>
          </div>
        </div>

        {/* XDR Input Console */}
        <XdrInput
          xdr={xdr}
          onChange={setXdr}
          onClear={() => setXdr('')}
          onSimulate={handleSimulate}
          isSimulating={isSimulating}
          error={parseError}
        />

        {/* Diagnostic Tabs */}
        {decodedEnvelope && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-stellar-border pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('envelope')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  activeTab === 'envelope'
                    ? 'bg-stellar-accent text-white shadow-lg shadow-stellar-accent/20'
                    : 'text-gray-400 hover:text-white hover:bg-stellar-card'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Envelope & Operations ({decodedEnvelope.operations.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('footprint')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  activeTab === 'footprint'
                    ? 'bg-stellar-accent text-white shadow-lg shadow-stellar-accent/20'
                    : 'text-gray-400 hover:text-white hover:bg-stellar-card'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>
                  Soroban Gas & Footprint ({sorobanResources ? sorobanResources.footprintKeys.length : 0})
                </span>
              </button>

              <button
                onClick={() => setActiveTab('auth')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  activeTab === 'auth'
                    ? 'bg-stellar-accent text-white shadow-lg shadow-stellar-accent/20'
                    : 'text-gray-400 hover:text-white hover:bg-stellar-card'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Auth Call Trees ({authTrees.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('simulation')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  activeTab === 'simulation'
                    ? 'bg-stellar-accent text-white shadow-lg shadow-stellar-accent/20'
                    : 'text-gray-400 hover:text-white hover:bg-stellar-card'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>RPC Pre-Execution Simulator</span>
              </button>
            </div>

            {/* Active Tab Panel Content */}
            <div className="pt-2">
              {activeTab === 'envelope' && <EnvelopeDecoder envelope={decodedEnvelope} />}
              {activeTab === 'footprint' && (
                <FootprintAnalyzer
                  resources={sorobanResources}
                  simulatedCpu={simulation?.cpuInstructions}
                  simulatedMem={simulation?.memoryBytes}
                  simulatedMinFee={simulation?.minResourceFee}
                />
              )}
              {activeTab === 'auth' && <AuthTreeVisualizer nodes={authTrees} />}
              {activeTab === 'simulation' && (
                <SimulationPanel simulation={simulation} isSimulating={isSimulating} />
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-stellar-border py-3 bg-stellar-dark text-center text-[10px] text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>XDR-Lens v0.1.0 • Stellar Drips Wave Program</span>
          <span className="text-gray-500">MIT License</span>
        </div>
      </footer>
    </div>
  );
}
