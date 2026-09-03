'use client';

import React, { useState } from 'react';
import { Shield, ChevronRight, ChevronDown, CheckCircle, Key, UserCheck, AlertCircle } from 'lucide-react';
import { AuthNode } from '@/lib/types';

interface AuthTreeVisualizerProps {
  nodes: AuthNode[];
}

export function AuthTreeVisualizer({ nodes }: AuthTreeVisualizerProps) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="bg-stellar-card border border-stellar-border rounded-xl p-8 text-center space-y-3">
        <Shield className="w-8 h-8 text-gray-500 mx-auto" />
        <h3 className="text-sm font-semibold text-white">No Soroban Auth Entries</h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          This transaction does not require explicit Soroban account signature authorization trees (no sub-invocations or `require_auth` credentials present).
        </p>
      </div>
    );
  }

  return (
    <div className="bg-stellar-card border border-stellar-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-stellar-cyan" />
          <h3 className="text-sm font-semibold text-white">
            Soroban Authorization Trees ({nodes.length} Root Entries)
          </h3>
        </div>
        <span className="text-xs text-gray-400 font-mono">
          Pre-Execution Sub-Invocation Tree
        </span>
      </div>

      <div className="space-y-3">
        {nodes.map((node) => (
          <AuthTreeNodeItem key={node.id} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
}

function AuthTreeNodeItem({ node, depth }: { node: AuthNode; depth: number }) {
  const [expanded, setExpanded] = useState(true);
  const hasSub = node.subInvocations && node.subInvocations.length > 0;

  return (
    <div
      style={{ marginLeft: `${depth * 16}px` }}
      className={`border border-stellar-border rounded-lg p-3.5 bg-stellar-dark/90 transition-all ${
        depth > 0 ? 'mt-2 border-l-2 border-l-stellar-accent' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2.5">
          {hasSub ? (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-0.5 text-gray-400 hover:text-white transition-colors"
            >
              {expanded ? (
                <ChevronDown className="w-4 h-4 text-stellar-accent" />
              ) : (
                <ChevronRight className="w-4 h-4 text-stellar-accent" />
              )}
            </button>
          ) : (
            <span className="w-4 h-4 mt-0.5 inline-block" />
          )}

          <div className="space-y-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="font-mono text-xs font-bold text-stellar-green bg-stellar-green/10 px-2 py-0.5 rounded border border-stellar-green/30">
                {node.functionName}()
              </span>

              {node.credentials.type === 'address' && node.credentials.address && (
                <span className="flex items-center space-x-1 text-[11px] font-mono bg-stellar-card text-stellar-cyan px-2 py-0.5 rounded border border-stellar-border">
                  <UserCheck className="w-3 h-3" />
                  <span>Authorized by: {node.credentials.address.substring(0, 8)}...</span>
                </span>
              )}

              {node.credentials.nonce && (
                <span className="text-[11px] font-mono text-gray-400">
                  Nonce: {node.credentials.nonce}
                </span>
              )}
            </div>

            <p className="font-mono text-xs text-gray-300 truncate max-w-lg" title={node.contractId}>
              Target Contract: {node.contractId}
            </p>

            {node.args.length > 0 && (
              <div className="mt-2 bg-stellar-card/60 rounded p-2 text-xs font-mono text-gray-300">
                <span className="text-gray-400 text-[11px] block mb-0.5">Function Arguments:</span>
                <div className="space-y-0.5">
                  {node.args.map((arg, idx) => (
                    <div key={idx} className="truncate text-gray-200">
                      arg[{idx}]: {arg}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {hasSub && (
          <span className="text-[11px] font-mono text-stellar-accent bg-stellar-accent/10 px-2 py-0.5 rounded border border-stellar-accent/20">
            {node.subInvocations.length} Sub-calls
          </span>
        )}
      </div>

      {hasSub && expanded && (
        <div className="mt-3 space-y-2">
          {node.subInvocations.map((sub) => (
            <AuthTreeNodeItem key={sub.id} node={sub} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
