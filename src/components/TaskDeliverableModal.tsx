import React, { useState } from 'react';
import { TaskDeliverable, WorkflowAction } from '../types';
import {
  X,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Clock,
  ShieldCheck,
  Layers,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TaskDeliverableModalProps {
  task: WorkflowAction | null;
  deliverable: TaskDeliverable | null;
  isOpen: boolean;
  onClose: () => void;
  onApproveAndComplete: (taskId: string) => void;
}

export const TaskDeliverableModal: React.FC<TaskDeliverableModalProps> = ({
  task,
  deliverable,
  isOpen,
  onClose,
  onApproveAndComplete,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !task || !deliverable) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(deliverable.contentMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([deliverable.contentMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${task.title.replace(/\s+/g, '_')}_deliverable.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleApprove = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // fallback
    }
    onApproveAndComplete(task.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl text-zinc-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900/60 to-zinc-950 flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                AI Autonomous Deliverable
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/60 border border-emerald-800 text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                {deliverable.auditComplianceTag || 'SOC2 VERIFIED'}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-950/60 border border-indigo-800 text-indigo-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400" />
                {deliverable.estimatedHoursSaved}h saved
              </span>
            </div>

            <h2 className="text-lg font-bold text-white tracking-tight truncate">
              {deliverable.deliverableTitle}
            </h2>

            <p className="text-xs text-zinc-400 truncate">
              Original Task: <span className="text-zinc-200 font-medium">{task.title}</span> ({task.assignee})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deliverable Meta & Summary */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="md:col-span-2 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Execution Summary
            </div>
            <p className="text-zinc-300 text-xs leading-relaxed">
              {deliverable.summary}
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Artifacts Generated
            </div>
            <div className="space-y-1">
              {deliverable.keyArtifactsProduced.map((art, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-zinc-300 text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{art}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deliverable Markdown Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-zinc-950 font-mono text-xs leading-relaxed text-zinc-200">
          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30">
            <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-zinc-200 leading-relaxed">
              {deliverable.contentMarkdown}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  Copy Output
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              Download .md
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-colors"
            >
              Close
            </button>

            {task.status !== 'completed' && (
              <button
                onClick={handleApprove}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                Approve & Mark Completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
