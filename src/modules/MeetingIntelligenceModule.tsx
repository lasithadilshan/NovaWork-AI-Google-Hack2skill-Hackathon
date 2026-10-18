import React, { useState } from 'react';
import { MeetingAnalysis, WorkflowAction } from '../types';
import { INITIAL_DOCUMENTS } from '../data/initialData';
import {
  Mic,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  Copy,
  Check,
  RotateCcw,
  PlusCircle,
  FileText,
  User,
  Clock,
  Zap,
  TrendingDown,
  Mail,
  Quote,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MeetingIntelligenceModuleProps {
  onAddBatchTasks: (tasks: WorkflowAction[]) => void;
  onNavigateToWorkflow: () => void;
}

export const MeetingIntelligenceModule: React.FC<MeetingIntelligenceModuleProps> = ({
  onAddBatchTasks,
  onNavigateToWorkflow,
}) => {
  const sampleTranscript = INITIAL_DOCUMENTS.find((d) => d.code === 'DOC-03')?.fullText || '';

  const [transcript, setTranscript] = useState(sampleTranscript);
  const [meetingTitle, setMeetingTitle] = useState('Executive Sync: Q4 Architecture, Egress & Tier-1 Bank');
  const [participants, setParticipants] = useState('Sarah Lin (VP Eng), Alex Rivera (Product), Elena Rostova (Compliance), Marcus Vance (DevOps)');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [pushedToBoard, setPushedToBoard] = useState(false);

  const handleRunMeetingIntelligence = async () => {
    if (!transcript.trim()) return;

    setIsLoading(true);
    setPushedToBoard(false);

    try {
      const response = await fetch('/api/gemini/meeting-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          meetingTitle,
          participants,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to analyze transcript: ${response.statusText}`);
      }

      const data: MeetingAnalysis = await response.json();
      setAnalysis(data);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    } catch (err: any) {
      console.error('Error running meeting intelligence:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushAllToWorkflow = () => {
    if (!analysis || !analysis.actionItems.length) return;

    const newTasks: WorkflowAction[] = analysis.actionItems.map((item, idx) => ({
      id: `task_meet_${Date.now()}_${idx}`,
      title: item.title,
      description: `Extracted from ${meetingTitle}. Source Quote: "${item.sourceQuote}"`,
      priority: item.priority,
      assignee: item.assignee,
      sourceDocId: 'DOC-03',
      deliverableType: (item.suggestedDeliverable as any) || 'technical_spec',
      status: 'todo',
      createdAt: new Date().toISOString(),
      dueDate: item.deadline,
    }));

    onAddBatchTasks(newTasks);
    setPushedToBoard(true);

    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  };

  const handleCopyDraft = () => {
    if (!analysis) return;
    const text = `Subject: ${analysis.followUpDraft.subject}\n\n${analysis.followUpDraft.body}`;
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Mic className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Meeting Intelligence & Decision Extractor
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Extract executive decisions, blockers, sentiment risk scores, and auto-generate follow-up communications using Gemini structured output schemas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTranscript(sampleTranscript);
              setAnalysis(null);
              setPushedToBoard(false);
            }}
            className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Sample Transcript
          </button>
        </div>
      </div>

      {/* Input Workspace */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Meeting Title</label>
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Participants</label>
            <input
              type="text"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1 text-xs">
            <label className="text-zinc-400 font-semibold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Meeting Transcript / Raw Voice Notes
            </label>
            <span className="text-[11px] font-mono text-zinc-500">
              {transcript.length} characters (DOC-03 loaded)
            </span>
          </div>
          <textarea
            rows={5}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste raw conversation transcript, audio diarization notes, or zoom minutes..."
            className="w-full px-3.5 py-2.5 bg-zinc-950/90 border border-zinc-800 rounded-xl text-zinc-300 font-mono text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Structured Output JSON Schema: Executive Decisions + Risk Score + Action Items
          </div>

          <button
            onClick={handleRunMeetingIntelligence}
            disabled={isLoading || !transcript.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Analyzing Transcript with Gemini...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Run Meeting Intelligence Agent
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Output Section */}
      {analysis && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Top Push to Kanban Banner */}
          <div className="p-4 rounded-xl border border-emerald-900/60 bg-emerald-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Analysis Complete: {analysis.actionItems.length} Action Items Extracted
                </h3>
                <p className="text-xs text-zinc-400">
                  Ready to deploy tasks directly into the Autonomous Workflow Board with assignees and due dates.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePushAllToWorkflow}
                disabled={pushedToBoard}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  pushedToBoard
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-800'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/20 active:scale-95'
                }`}
              >
                {pushedToBoard ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Tasks Added to Kanban!
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3.5 h-3.5" />
                    Push All to Workflow Board
                  </>
                )}
              </button>

              {pushedToBoard && (
                <button
                  onClick={onNavigateToWorkflow}
                  className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  View on Board →
                </button>
              )}
            </div>
          </div>

          {/* 1. Executive Summary & Risk Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                <Sparkles className="w-4 h-4" />
                Executive Summary
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed font-sans">
                {analysis.executiveSummary}
              </p>
            </div>

            {/* Risk Gauge */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  Sentiment & Risk Score
                </span>
                <span className="font-mono text-zinc-500">Auto-Audited</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-400 font-mono">
                  {analysis.riskAnalysis.overallRiskScore}
                </span>
                <span className="text-zinc-500 text-sm font-mono">/ 100</span>
                <span className="ml-auto px-2 py-0.5 rounded text-xs font-bold uppercase bg-amber-950/80 border border-amber-800 text-amber-300">
                  {analysis.riskAnalysis.riskLevel} Risk
                </span>
              </div>

              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${analysis.riskAnalysis.overallRiskScore}%` }}
                ></div>
              </div>

              <p className="text-[11px] text-zinc-400">
                Identified {analysis.riskAnalysis.blockers.length} active blockers impacting engineering velocity and financial SLAs.
              </p>
            </div>
          </div>

          {/* 2. Key Decisions & Blockers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Key Decisions */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
                Key Decisions Made & Agreed
              </div>

              <div className="space-y-2.5">
                {analysis.keyDecisions.map((dec, i) => (
                  <div key={i} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-1.5">
                    <div className="text-xs font-bold text-zinc-200">
                      {dec.decision}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      <span className="text-zinc-500">Impact:</span> {dec.impact}
                    </div>
                    <div className="text-[10px] text-indigo-400 font-mono">
                      Stakeholders: {dec.stakeholders}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockers & Red Flags */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                Detected Blockers & Red Flags
              </div>

              <div className="space-y-2.5">
                {analysis.riskAnalysis.blockers.map((blk, i) => (
                  <div key={i} className="p-3 rounded-xl border border-rose-950/60 bg-rose-950/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-rose-300">{blk.title}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-rose-900/50 text-rose-200 border border-rose-800">
                        {blk.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {blk.description}
                    </p>
                    {blk.impactedDept && (
                      <div className="text-[10px] text-zinc-500 font-mono">
                        Dept: {blk.impactedDept}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Extracted Action Items */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <Zap className="w-4 h-4" />
                Extracted Action Items ({analysis.actionItems.length})
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                Click "Push All to Workflow Board" above to dispatch
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {analysis.actionItems.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {act.priority}
                      </span>
                      <span className="text-zinc-500 font-mono text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {act.deadline}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-zinc-100">
                      {act.title}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <User className="w-3 h-3 text-zinc-500" />
                      <span>{act.assignee}</span>
                    </div>

                    <div className="text-[10px] text-zinc-500 italic bg-zinc-900/60 p-2 rounded border border-zinc-850">
                      <Quote className="w-2.5 h-2.5 inline mr-1 opacity-50" />
                      {act.sourceQuote}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Automated Follow-Up Email / Slack Draft */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                <Mail className="w-4 h-4" />
                Executive Follow-Up Email / Slack Broadcast
              </div>

              <button
                onClick={handleCopyDraft}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedDraft ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied Draft!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    Copy Broadcast Draft
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-300 space-y-2">
              <div className="text-zinc-400 pb-2 border-b border-zinc-850 font-semibold">
                Subject: {analysis.followUpDraft.subject}
              </div>
              <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-zinc-300 pt-1">
                {analysis.followUpDraft.body}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
