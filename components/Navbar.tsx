'use client';

import React from 'react';
import { Layers, Network, Github, ShieldAlert, Cpu } from 'lucide-react';
import { NETWORKS, StellarNetwork } from '@/lib/types';

interface NavbarProps {
  network: StellarNetwork;
  onNetworkChange: (net: StellarNetwork) => void;
}

export function Navbar({ network, onNetworkChange }: NavbarProps) {
  return (
    <header className="border-b border-stellar-border bg-stellar-dark/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-stellar-accent to-stellar-purple flex items-center justify-center text-white shadow-lg shadow-stellar-accent/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight">XDR-Lens</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-stellar-accent/20 text-stellar-accent border border-stellar-accent/30">
                Soroban Diagnostic Studio
              </span>
            </div>
            <p className="text-xs text-gray-400">Pre-Execution Footprint & Auth Visualizer</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-stellar-card border border-stellar-border rounded-lg px-3 py-1.5">
            <Network className="w-4 h-4 text-stellar-cyan" />
            <select
              value={network}
              onChange={(e) => onNetworkChange(e.target.value as StellarNetwork)}
              className="bg-transparent text-sm text-gray-200 focus:outline-none cursor-pointer"
            >
              <option value="testnet" className="bg-stellar-card">Testnet ({NETWORKS.testnet.name})</option>
              <option value="mainnet" className="bg-stellar-card">Mainnet ({NETWORKS.mainnet.name})</option>
              <option value="futurenet" className="bg-stellar-card">Futurenet ({NETWORKS.futurenet.name})</option>
            </select>
          </div>

          <a
            href="https://github.com/SmartCraftGroup/xdr-lens"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-white transition-colors bg-stellar-card hover:bg-stellar-border px-3 py-1.5 rounded-lg border border-stellar-border"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
