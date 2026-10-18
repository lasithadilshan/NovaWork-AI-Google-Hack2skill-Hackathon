import React, { useState } from 'react';
import { EnterpriseDocument } from '../types';
import {
  X,
  Layers,
  FileText,
  Shield,
  Calendar,
  User,
  Hash,
  Sparkles,
  ExternalLink,
  Tag,
  Copy,
  Check,
} from 'lucide-react';

interface DocumentInspectorModalProps {
  document: EnterpriseDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onAskCopilot: (docCode: string) => void;
}

export const DocumentInspectorModal: React.FC<DocumentInspectorModalProps> = ({
  document,
  isOpen,
  onClose,
  onAskCopilot,
}) => {
  const [activeTab, setActiveTab] = useState<'chunks' | 'fulltext'>('chunks');
  const [copiedChunkId, setCopiedChunkId] = useState<string | null>(null);

  if (!isOpen || !document) return null;

  const handleCopyChunk = (chunkId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChunkId(chunkId);
    setTimeout(() => setCopiedChunkId(null), 2000);
  };

  const getSensitivityColor = (level: string) => {
    switch (level) {
      case 'SOC2 Restricted':
        return 'bg-rose-950/70 border-rose-800 text-rose-300';
      case 'Executive Only':
        return 'bg-purple-950/70 border-purple-800 text-purple-300';
      case 'Confidential':
        return 'bg-amber-950/70 border-amber-800 text-amber-300';
      default:
        return 'bg-zinc-800 border-zinc-700 text-zinc-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl text-zinc-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800/80 bg-zinc-900/40 flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {document.code}
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${getSensitivityColor(document.sensitivity)}`}>
                <Shield className="w-2.5 h-2.5 inline mr-1" />
                {document.sensitivity}
              </span>
              <span className="text-xs text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-700/50">
                {document.category}
              </span>
            </div>

            <h2 className="text-lg font-bold text-white tracking-tight truncate">
              {document.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                {document.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                {document.lastUpdated}
              </span>
              <span className="flex items-center gap-1 font-mono text-cyan-400">
                <Layers className="w-3.5 h-3.5" />
                {document.chunks.length} Chunks Indexed
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Executive Summary & Key Entities */}
        <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/20 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="md:col-span-2 space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-400 font-semibold text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              AI Executive Summary
            </div>
            <p className="text-zinc-300 text-xs leading-relaxed">
              {document.summary}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              Indexed Entities
            </div>
            <div className="flex flex-wrap gap-1">
              {document.keyEntities.map((entity, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-300"
                >
                  {entity}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('chunks')}
              className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'chunks'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Chunk & Vector Inspector ({document.chunks.length})
            </button>
            <button
              onClick={() => setActiveTab('fulltext')}
              className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'fulltext'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Full Raw Text
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onAskCopilot(document.code);
            }}
            className="mb-2 text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/50 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Query in RAG Copilot
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'chunks' ? (
            <div className="space-y-3">
              {document.chunks.map((chunk, index) => (
                <div
                  key={chunk.chunkId}
                  className="rounded-xl border border-zinc-800/90 bg-zinc-900/30 p-3.5 space-y-2 hover:border-zinc-700/80 transition-all"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                        {chunk.chunkId}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        ~{chunk.tokenCount} tokens
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyChunk(chunk.chunkId, chunk.content)}
                      className="text-zinc-500 hover:text-zinc-300 p-1 rounded hover:bg-zinc-800 transition-colors"
                      title="Copy chunk snippet"
                    >
                      {copiedChunkId === chunk.chunkId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-zinc-300 font-mono bg-zinc-950/70 p-3 rounded-lg border border-zinc-900 leading-relaxed">
                    {chunk.content}
                  </p>

                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                      Extracted Keywords:
                    </span>
                    {chunk.keywords.map((kw, k) => (
                      <span
                        key={k}
                        className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800/80 text-zinc-400 border border-zinc-700/50"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900">
              <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {document.fullText}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
