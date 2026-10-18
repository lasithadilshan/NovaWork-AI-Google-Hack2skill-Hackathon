import React from 'react';
import { Sparkles, Bot, ShieldCheck, Zap, Server, Award, ChevronRight } from 'lucide-react';

interface HeaderProps {
  onOpenDemoTour: () => void;
  activeAgentsCount?: number;
  onQuickJudgeAction: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDemoTour,
  activeAgentsCount = 3,
  onQuickJudgeAction,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 transition-all">
      {/* Brand Section */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 p-[1px] shadow-lg shadow-indigo-500/20">
          <div className="w-full h-full bg-zinc-950 rounded-[7px] flex items-center justify-center">
            <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>NovaWork AI</span>
              <span className="text-xs font-normal text-zinc-500">|</span>
              <span className="text-xs font-medium text-zinc-400 hidden sm:inline">Enterprise Agentic Workspace</span>
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-950/70 border border-indigo-700/40 text-indigo-300">
              <Award className="w-2.5 h-2.5 text-indigo-400" />
              Team Nova
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span className="inline-flex items-center gap-1 text-cyan-400 font-mono">
              <Server className="w-3 h-3 text-cyan-400" />
              Powered by Google Gemini 2.5 Flash & Cloud Run
            </span>
          </div>
        </div>
      </div>

      {/* Center/Right Status + Judge Demo Trigger */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Agent Cluster Status - Hidden on tiny mobile */}
        <div className="hidden lg:flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800/90 rounded-lg px-2.5 py-1 text-[11px] font-mono text-zinc-300">
          <div className="flex items-center gap-1 text-zinc-400 pr-1.5 border-r border-zinc-800">
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-zinc-300 font-semibold">Active Agents:</span>
          </div>
          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Orchestrator
          </span>
          <span className="inline-flex items-center gap-1 text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            RAG Retriever
          </span>
          <span className="inline-flex items-center gap-1 text-purple-400 bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-800/30">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            Workflow Executor
          </span>
        </div>

        {/* 1-Click Judge Showcase Button */}
        <button
          onClick={onOpenDemoTour}
          className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
          title="Open Judge Guided Tour with 1-click test triggers"
        >
          <Sparkles className="w-3.5 h-3.5 text-white animate-spin-slow" />
          <span className="tracking-wide">⚡ Judge's 1-Click Demo</span>
          <span className="hidden sm:inline-flex bg-white/20 text-[10px] px-1 rounded font-mono">0-Setup</span>
        </button>
      </div>
    </header>
  );
};
