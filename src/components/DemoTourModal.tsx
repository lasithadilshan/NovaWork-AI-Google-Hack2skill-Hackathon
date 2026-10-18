import React from 'react';
import {
  Sparkles,
  Bot,
  Layers,
  ArrowRight,
  X,
  CheckCircle2,
  Cpu,
  FileText,
  Mic,
  KanbanSquare,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ActiveModule } from './Sidebar';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickAction: (actionType: 'test_rag' | 'test_meeting' | 'test_workflow' | 'inspect_doc') => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onQuickAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl text-zinc-100 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Judge's 1-Click Interactive Demo
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 border border-emerald-800 text-emerald-400">
                  Ready to Test
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Welcome Hackathon Judges! Test NovaWork AI's multi-agent enterprise copilot with zero setup.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Architecture flow overview */}
        <div className="my-5 p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Cpu className="w-4 h-4" />
              Autonomous Multi-Agent Architecture
            </span>
            <span className="text-[11px] font-mono text-zinc-500">Google Gemini 2.5 Flash</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-800/60">
              <div className="font-semibold text-zinc-300 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-indigo-900 text-indigo-300 flex items-center justify-center text-[10px]">1</span>
                Orchestrator
              </div>
              <p className="text-zinc-500 text-[10px] mt-1">
                Deconstructs intent, routes domain tasks & sets guardrails.
              </p>
            </div>

            <div className="bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-800/60">
              <div className="font-semibold text-cyan-300 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-cyan-900 text-cyan-300 flex items-center justify-center text-[10px]">2</span>
                Retriever Agent
              </div>
              <p className="text-zinc-500 text-[10px] mt-1">
                Scans 4 pre-loaded enterprise docs & ranks top relevant chunks.
              </p>
            </div>

            <div className="bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-800/60">
              <div className="font-semibold text-emerald-300 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-emerald-900 text-emerald-300 flex items-center justify-center text-[10px]">3</span>
                Grounding Agent
              </div>
              <p className="text-zinc-500 text-[10px] mt-1">
                Answers with inline clickable [DOC-XX] citations, zero hallucination.
              </p>
            </div>

            <div className="bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-800/60">
              <div className="font-semibold text-amber-300 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-amber-900 text-amber-300 flex items-center justify-center text-[10px]">4</span>
                Action Agent
              </div>
              <p className="text-zinc-500 text-[10px] mt-1">
                Auto-generates Kanban tickets & executes production deliverables.
              </p>
            </div>
          </div>
        </div>

        {/* 1-Click Showcase Shortcuts for Judges */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            ⚡ 1-Click Fast Track for Evaluation
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Shortcut 1: RAG Copilot */}
            <button
              onClick={() => {
                onClose();
                onQuickAction('test_rag');
              }}
              className="text-left p-3 rounded-xl border border-indigo-900/60 bg-indigo-950/20 hover:bg-indigo-950/40 hover:border-indigo-700 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  Test Multi-Agent RAG Reasoning
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Runs compliance query across DOC-01 & DOC-02, reveals live reasoning trace & inline citations.
              </p>
            </button>

            {/* Shortcut 2: Meeting Intelligence */}
            <button
              onClick={() => {
                onClose();
                onQuickAction('test_meeting');
              }}
              className="text-left p-3 rounded-xl border border-emerald-900/60 bg-emerald-950/20 hover:bg-emerald-950/40 hover:border-emerald-700 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs">
                  <Mic className="w-4 h-4 text-emerald-400" />
                  Test Meeting Intelligence Studio
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Processes Executive Sync transcript, extracts decisions, risk scores, and pushes tasks to Kanban.
              </p>
            </button>

            {/* Shortcut 3: Task Auto-Execution */}
            <button
              onClick={() => {
                onClose();
                onQuickAction('test_workflow');
              }}
              className="text-left p-3 rounded-xl border border-amber-900/60 bg-amber-950/20 hover:bg-amber-950/40 hover:border-amber-700 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Test AI Auto-Execute Deliverable
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Generates a production-ready Technical Architecture Specification for HashiCorp Vault.
              </p>
            </button>

            {/* Shortcut 4: Knowledge Base Chunks */}
            <button
              onClick={() => {
                onClose();
                onQuickAction('inspect_doc');
              }}
              className="text-left p-3 rounded-xl border border-blue-900/60 bg-blue-950/20 hover:bg-blue-950/40 hover:border-blue-700 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-300 font-semibold text-xs">
                  <Layers className="w-4 h-4 text-blue-400" />
                  Inspect Chunks & Embeddings
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Examine client-side chunk inspector, TF-IDF weights, token counts, and entity classifications.
              </p>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
          <span>Enterprise Copilot | Team Nova</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition-colors"
          >
            Explore Manually
          </button>
        </div>
      </div>
    </div>
  );
};
