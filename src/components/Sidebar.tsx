import React from 'react';
import {
  BookOpen,
  BotMessageSquare,
  Mic,
  KanbanSquare,
  Layers,
  CheckCircle2,
  Cpu,
  BarChart3,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export type ActiveModule = 'knowledge' | 'copilot' | 'meeting' | 'workflow';

interface SidebarProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  documentCount: number;
  taskCount: number;
  totalChunksCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  documentCount,
  taskCount,
  totalChunksCount,
}) => {
  const navItems = [
    {
      id: 'knowledge' as ActiveModule,
      name: 'Knowledge Base & RAG Hub',
      shortName: 'Knowledge Base',
      icon: BookOpen,
      count: documentCount,
      countLabel: 'docs',
      description: 'Document intelligence & chunk indexer',
      color: 'text-blue-400 group-hover:text-blue-300',
      activeBg: 'bg-blue-950/40 border-blue-600/50 text-blue-200',
    },
    {
      id: 'copilot' as ActiveModule,
      name: 'Agentic RAG Copilot',
      shortName: 'Agent Copilot',
      icon: BotMessageSquare,
      countLabel: 'multi-agent',
      isHot: true,
      description: 'Reasoning trace & grounded citations',
      color: 'text-indigo-400 group-hover:text-indigo-300',
      activeBg: 'bg-indigo-950/40 border-indigo-600/50 text-indigo-200',
    },
    {
      id: 'meeting' as ActiveModule,
      name: 'Meeting Intelligence',
      shortName: 'Meeting Intel',
      icon: Mic,
      countLabel: 'studio',
      description: 'Decision & action extractor',
      color: 'text-emerald-400 group-hover:text-emerald-300',
      activeBg: 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200',
    },
    {
      id: 'workflow' as ActiveModule,
      name: 'Autonomous Workflow Board',
      shortName: 'Workflow Board',
      icon: KanbanSquare,
      count: taskCount,
      countLabel: 'tasks',
      description: 'Kanban & AI auto-execution',
      color: 'text-amber-400 group-hover:text-amber-300',
      activeBg: 'bg-amber-950/40 border-amber-600/50 text-amber-200',
    },
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 border-r border-zinc-800/80 bg-zinc-950/70 flex flex-col justify-between shrink-0">
      {/* Top Module List */}
      <div className="p-3 space-y-4">
        <div>
          <div className="px-2 pb-2 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase flex items-center justify-between">
            <span>Core Modules</span>
            <span className="text-[10px] font-mono text-zinc-600">v2.5</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectModule(item.id)}
                  className={`w-full text-left group px-3 py-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isActive
                      ? `${item.activeBg} shadow-sm font-medium`
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg ${isActive ? 'bg-zinc-900/90' : 'bg-zinc-900/40 group-hover:bg-zinc-900'}`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs sm:text-sm font-medium truncate text-zinc-200">
                        {item.name}
                      </span>
                      {item.isHot && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          AI
                        </span>
                      )}
                      {item.count !== undefined && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {item.count}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live System & RAG Metrics Widget */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              RAG Workspace Metrics
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-lg p-2">
              <div className="text-[10px] text-zinc-500">Indexed Chunks</div>
              <div className="text-sm font-mono font-bold text-zinc-200 flex items-center gap-1 mt-0.5">
                <Layers className="w-3 h-3 text-cyan-400" />
                {totalChunksCount}
              </div>
            </div>

            <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-lg p-2">
              <div className="text-[10px] text-zinc-500">Citation Accuracy</div>
              <div className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                99.4%
              </div>
            </div>

            <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-lg p-2">
              <div className="text-[10px] text-zinc-500">Active Agents</div>
              <div className="text-sm font-mono font-bold text-indigo-300 mt-0.5">
                3 Running
              </div>
            </div>

            <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-lg p-2">
              <div className="text-[10px] text-zinc-500">SLA Budget</div>
              <div className="text-sm font-mono font-bold text-amber-300 mt-0.5">
                &lt; 80ms p99
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Hackathon Track signature */}
      <div className="p-3 border-t border-zinc-900 bg-zinc-950/90 text-xs text-zinc-500">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-zinc-400 font-medium">Track:</span>
          <span className="text-indigo-400 font-medium">Future of Work</span>
        </div>
        <div className="text-[10px] text-zinc-500">
          Built by Team Nova for the Future of Work & Enterprise Productivity Hackathon.
        </div>
      </div>
    </aside>
  );
};
