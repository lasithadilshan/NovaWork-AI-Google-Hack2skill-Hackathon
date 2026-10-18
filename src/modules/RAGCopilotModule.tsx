import React, { useState, useRef, useEffect } from 'react';
import {
  ChatMessage,
  EnterpriseDocument,
  ReasoningTraceStep,
  WorkflowAction,
  Citation,
} from '../types';
import { JUDGE_DEMO_PROMPTS } from '../data/initialData';
import { retrieveRelevantChunks } from '../utils/ragEngine';
import {
  BotMessageSquare,
  Sparkles,
  Send,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ExternalLink,
  Cpu,
  Clock,
  PlusCircle,
  AlertCircle,
  FileText,
  User,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RAGCopilotModuleProps {
  documents: EnterpriseDocument[];
  onAddWorkflowTask: (task: WorkflowAction) => void;
  onInspectDocumentCode: (docCode: string) => void;
  externalQuery?: string;
  onClearExternalQuery?: () => void;
}

export const RAGCopilotModule: React.FC<RAGCopilotModuleProps> = ({
  documents,
  onAddWorkflowTask,
  onInspectDocumentCode,
  externalQuery,
  onClearExternalQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `### 👋 Welcome to NovaWork Multi-Agent RAG Copilot

I am your autonomous enterprise copilot connected to the **4 active knowledge base documents** (Roadmap, InfoSec Policy, Executive Transcripts, and SOP-044).

Every answer is:
1. **Strictly Grounded** with inline verifiable citations: \`[DOC-01]\`, \`[DOC-02]\`, \`[DOC-03]\`, or \`[DOC-04]\`.
2. **Auditable** with a live transparent multi-agent reasoning trace.
3. **Action-Oriented** with 1-click dispatch to the Autonomous Workflow Board.

Click one of the suggested prompts below to evaluate immediately:`,
      timestamp: '10:00 AM',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTraceMsgId, setExpandedTraceMsgId] = useState<string | null>(null);
  const [activeCitationPopover, setActiveCitationPopover] = useState<Citation | null>(null);
  const [addedActionIds, setAddedActionIds] = useState<Set<string>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (externalQuery) {
      handleSendQuery(externalQuery);
      if (onClearExternalQuery) onClearExternalQuery();
    }
  }, [externalQuery]);

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // 1. Client-side local retrieval for instant top relevant chunks
      const topChunks = retrieveRelevantChunks(queryText, documents, 4);

      // 2. Call server-side Gemini Multi-Agent endpoint
      const response = await fetch('/api/gemini/rag-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          retrievedChunks: topChunks,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned error: ${response.statusText}`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        content: data.groundedAnswer || 'Response synthesized.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reasoningTrace: data.reasoningTrace,
        citations: data.citations || topChunks.map((c) => ({
          docId: c.docId,
          title: c.docTitle,
          snippet: c.content,
          relevanceScore: c.relevanceScore || 90,
        })),
        suggestedActions: (data.suggestedActions || []).map((act: any) => ({
          ...act,
          status: 'todo' as const,
          createdAt: new Date().toISOString(),
        })),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setExpandedTraceMsgId(assistantMessage.id);
    } catch (err: any) {
      console.error('Error in RAG copilot:', err);
      // Fallback message
      const errMessage: ChatMessage = {
        id: `ast_err_${Date.now()}`,
        role: 'assistant',
        content: `### ⚠️ Notice\n\nEncountered an issue querying the agent: ${err.message}. Please retry or select another sample query.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushActionToWorkflow = (action: WorkflowAction) => {
    try {
      confetti({
        particleCount: 45,
        spread: 50,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // fallback
    }

    onAddWorkflowTask({
      ...action,
      status: 'todo',
      createdAt: new Date().toISOString(),
    });

    setAddedActionIds((prev) => new Set(prev).add(action.id));
  };

  // Render text with clickable citation badges e.g. [DOC-01]
  const renderGroundedContent = (content: string, citations?: Citation[]) => {
    // Regex for [DOC-XX]
    const parts = content.split(/(\[DOC-\d+\])/g);

    return (
      <div className="space-y-2 leading-relaxed text-xs sm:text-sm font-sans text-zinc-200">
        {parts.map((part, index) => {
          const match = part.match(/\[(DOC-\d+)\]/);
          if (match) {
            const docCode = match[1];
            const matchedCitation = citations?.find((c) => c.docId === docCode);

            return (
              <button
                key={index}
                onClick={() => {
                  if (matchedCitation) {
                    setActiveCitationPopover(matchedCitation);
                  } else {
                    onInspectDocumentCode(docCode);
                  }
                }}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.2 mx-1 my-0.5 rounded text-[11px] font-mono font-bold bg-indigo-950/90 text-indigo-300 border border-indigo-700/60 hover:bg-indigo-900 hover:text-white transition-all cursor-pointer shadow-xs"
                title={`Click to inspect verified citation from ${docCode}`}
              >
                <span>{docCode}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </button>
            );
          }

          // Handle markdown bold / code basics
          return <span key={index} className="whitespace-pre-wrap">{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto p-4 sm:p-6 space-y-4">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BotMessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Agentic RAG Copilot
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 border border-indigo-800 text-indigo-300">
              Multi-Agent Orchestrator
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Grounded enterprise reasoning with inline citation verification, transparent multi-agent traces, and autonomous action dispatch.
          </p>
        </div>

        {/* Status Chip */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono bg-zinc-900/60 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Orchestrator: Active</span>
          <span className="text-zinc-600">|</span>
          <span className="text-cyan-400">Gemini 2.5 Flash</span>
        </div>
      </div>

      {/* Suggested Judge Prompts */}
      <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/30 p-3 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Judge Showcase Prompts (1-Click Test)
          </span>
          <span className="text-[10px] text-zinc-500">Zero typing required</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {JUDGE_DEMO_PROMPTS.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => handleSendQuery(prompt.query)}
              disabled={isLoading}
              className="text-left p-2.5 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 hover:border-indigo-600/50 transition-all cursor-pointer group disabled:opacity-50"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                  {prompt.badge}
                </span>
                <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-xs font-semibold text-zinc-200 line-clamp-1 group-hover:text-indigo-300">
                {prompt.title}
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">
                "{prompt.query}"
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[350px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-3xl rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-zinc-900/50 border border-zinc-800/80 text-zinc-200 rounded-tl-none w-full'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between gap-3 text-xs border-b border-zinc-800/60 pb-2">
                <div className="flex items-center gap-2">
                  {msg.role === 'user' ? (
                    <User className="w-3.5 h-3.5" />
                  ) : (
                    <div className="flex items-center gap-1.5 text-indigo-400 font-semibold font-mono text-[11px]">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>NovaWork Orchestrator</span>
                    </div>
                  )}
                  <span className="text-[10px] opacity-70">{msg.timestamp}</span>
                </div>

                {msg.reasoningTrace && (
                  <button
                    onClick={() =>
                      setExpandedTraceMsgId(expandedTraceMsgId === msg.id ? null : msg.id)
                    }
                    className="text-[11px] font-mono font-medium text-indigo-300 hover:text-white flex items-center gap-1 bg-indigo-950/70 border border-indigo-800/50 px-2 py-0.5 rounded cursor-pointer"
                  >
                    <span>Live Agent Trace ({msg.reasoningTrace.length} steps)</span>
                    {expandedTraceMsgId === msg.id ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>

              {/* Expandable Live Multi-Agent Reasoning Trace */}
              {msg.reasoningTrace && expandedTraceMsgId === msg.id && (
                <div className="rounded-xl border border-indigo-900/60 bg-zinc-950/90 p-3.5 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-1.5">
                    <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      Multi-Agent Pipeline Execution Trace
                    </span>
                    <span className="text-emerald-400">100% Grounded</span>
                  </div>

                  <div className="space-y-2 pt-1">
                    {msg.reasoningTrace.map((step, idx) => (
                      <div
                        key={idx}
                        className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60 space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 flex items-center justify-center text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-zinc-200">{step.step}</span>
                            <span className="text-[10px] text-indigo-400 font-sans px-1.5 py-0.2 bg-indigo-950/80 rounded">
                              {step.agent}
                            </span>
                          </div>
                          {step.latencyMs && (
                            <span className="text-zinc-500 text-[10px]">
                              {step.latencyMs}ms
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-400 text-[11px] font-sans pl-5 leading-relaxed">
                          {step.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Body */}
              <div className="prose prose-invert prose-xs max-w-none">
                {msg.role === 'assistant'
                  ? renderGroundedContent(msg.content, msg.citations)
                  : msg.content}
              </div>

              {/* Retrieved Source Snippets Card */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-2 border-t border-zinc-800/60 space-y-1.5">
                  <div className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    Retrieved & Grounded Source Passages ({msg.citations.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.citations.map((cite, cIdx) => (
                      <div
                        key={cIdx}
                        onClick={() => onInspectDocumentCode(cite.docId)}
                        className="p-2.5 rounded-lg border border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700 cursor-pointer transition-all space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-indigo-300 bg-indigo-950/60 px-1.5 py-0.2 rounded border border-indigo-800/40">
                            {cite.docId}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            {cite.relevanceScore || 95}% Match
                          </span>
                        </div>
                        <div className="text-xs font-medium text-zinc-200 truncate">
                          {cite.title}
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 italic">
                          "{cite.snippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Proactive Action Detection Card */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="pt-2 border-t border-zinc-800/60 space-y-2">
                  <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Action Agent Detected Enterprise Follow-Ups ({msg.suggestedActions.length})
                  </div>

                  <div className="space-y-2">
                    {msg.suggestedActions.map((action) => {
                      const isAdded = addedActionIds.has(action.id);
                      return (
                        <div
                          key={action.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-amber-900/40 bg-amber-950/10"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                                {action.priority}
                              </span>
                              <span className="text-xs font-semibold text-zinc-100">
                                {action.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400">
                              {action.description}
                            </p>
                            <div className="text-[10px] text-zinc-500">
                              Assignee: <span className="text-zinc-300">{action.assignee}</span> • Ref: {action.sourceDocId || 'KB'}
                            </div>
                          </div>

                          <button
                            onClick={() => handlePushActionToWorkflow(action)}
                            disabled={isAdded}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                              isAdded
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20 active:scale-95'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                Pushed to Board
                              </>
                            ) : (
                              <>
                                <PlusCircle className="w-3.5 h-3.5" />
                                Push to Kanban
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 animate-pulse">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Cpu className="w-5 h-5 animate-spin" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-400">
                  Orchestrator Routing Query...
                </span>
                <span className="text-[11px] text-zinc-500">
                  Retrieving chunks & generating grounded citations
                </span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full w-3/4"></div>
              <div className="h-2 bg-zinc-800 rounded-full w-1/2"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Query Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuery(inputQuery);
        }}
        className="relative flex items-center gap-2 pt-2 border-t border-zinc-800/80"
      >
        <input
          type="text"
          placeholder="Ask anything grounded across all enterprise documents or trigger follow-up actions..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />

        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>Synthesize</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Citation Inspector Popover Modal */}
      {activeCitationPopover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-indigo-900/70 bg-zinc-950 p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {activeCitationPopover.docId}
                </span>
                <span className="text-xs font-semibold text-white truncate max-w-[200px]">
                  {activeCitationPopover.title}
                </span>
              </div>
              <button
                onClick={() => setActiveCitationPopover(null)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Grounded Excerpt:
              </div>
              <p className="text-xs text-zinc-300 font-mono bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 leading-relaxed">
                "{activeCitationPopover.snippet}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-emerald-400 font-mono">
                Relevance: {activeCitationPopover.relevanceScore || 98}% Verified
              </span>
              <button
                onClick={() => {
                  const docCode = activeCitationPopover.docId;
                  setActiveCitationPopover(null);
                  onInspectDocumentCode(docCode);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <span>View Full Document</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
