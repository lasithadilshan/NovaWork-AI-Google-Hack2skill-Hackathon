import React, { useState } from 'react';
import { WorkflowAction, TaskStatus, PriorityLevel, TaskDeliverable } from '../types';
import {
  KanbanSquare,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  User,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  X,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface WorkflowBoardModuleProps {
  tasks: WorkflowAction[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (task: WorkflowAction) => void;
  onAutoExecuteTask: (task: WorkflowAction) => void;
  executingTaskId: string | null;
  onInspectDocumentCode: (code: string) => void;
  onViewDeliverable: (task: WorkflowAction) => void;
}

export const WorkflowBoardModule: React.FC<WorkflowBoardModuleProps> = ({
  tasks,
  onUpdateTaskStatus,
  onAddTask,
  onAutoExecuteTask,
  executingTaskId,
  onInspectDocumentCode,
  onViewDeliverable,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAssignee, setNewAssignee] = useState('Marcus Vance (DevOps Lead)');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('High');
  const [newSourceDoc, setNewSourceDoc] = useState('DOC-01');
  const [newDeliverableType, setNewDeliverableType] = useState<WorkflowAction['deliverableType']>('technical_spec');

  const columns: { id: TaskStatus; label: string; countColor: string }[] = [
    { id: 'todo', label: 'To Do', countColor: 'bg-zinc-800 text-zinc-300' },
    { id: 'in_progress', label: 'In Progress', countColor: 'bg-blue-950 text-blue-300 border border-blue-800' },
    { id: 'blocked', label: 'Blocked / Risk', countColor: 'bg-rose-950 text-rose-300 border border-rose-800' },
    { id: 'completed', label: 'Completed', countColor: 'bg-emerald-950 text-emerald-300 border border-emerald-800' },
  ];

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.sourceDocId && t.sourceDocId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = selectedPriority === 'All' || t.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'Urgent':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'High':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Medium':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const handleCreateTask = () => {
    if (!newTitle.trim()) return;

    const task: WorkflowAction = {
      id: `task_custom_${Date.now()}`,
      title: newTitle,
      description: newDescription || 'Standard operational task.',
      priority: newPriority,
      assignee: newAssignee,
      sourceDocId: newSourceDoc,
      deliverableType: newDeliverableType,
      status: 'todo',
      createdAt: new Date().toISOString(),
    };

    onAddTask(task);
    setIsNewTaskModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <KanbanSquare className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Autonomous Workflow & Task Execution Board
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Synced across RAG Copilot and Meeting Intelligence. Click "✨ AI Auto-Execute" on any task to let the Executor Agent generate the production deliverable.
          </p>
        </div>

        <button
          onClick={() => setIsNewTaskModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter tasks by assignee, title, or DOC reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mr-1 hidden sm:inline">
            Priority:
          </span>
          {['All', 'Urgent', 'High', 'Medium', 'Low'].map((pri) => (
            <button
              key={pri}
              onClick={() => setSelectedPriority(pri)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedPriority === pri
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              {pri}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-3.5 space-y-3 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {col.label}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${col.countColor}`}>
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Task Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.map((task) => {
                  const isExecuting = executingTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`group relative rounded-xl border bg-zinc-950 p-4 space-y-3 shadow-sm transition-all ${
                        isExecuting
                          ? 'border-amber-500 ring-1 ring-amber-500 animate-pulse'
                          : 'border-zinc-800/80 hover:border-zinc-700/80'
                      }`}
                    >
                      {/* Priority & Source Badge */}
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPriorityBadge(task.priority)}`}>
                            {task.priority}
                          </span>
                          {task.sourceDocId && (
                            <button
                              onClick={() => onInspectDocumentCode(task.sourceDocId!)}
                              className="px-1.5 py-0.2 rounded font-mono text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/50 hover:bg-indigo-900 transition-colors flex items-center gap-0.5"
                            >
                              <span>{task.sourceDocId}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </button>
                          )}
                        </div>

                        {/* Status switcher dropdown / select */}
                        <select
                          value={task.status}
                          onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                          className="text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-800 rounded px-1.5 py-0.5 focus:outline-none"
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="blocked">Blocked</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                          {task.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400 mt-1 line-clamp-3 leading-relaxed">
                          {task.description}
                        </p>
                      </div>

                      {/* Assignee & Due Date */}
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-900">
                        <div className="flex items-center gap-1.5 truncate">
                          <User className="w-3 h-3 text-zinc-500 shrink-0" />
                          <span className="truncate">{task.assignee}</span>
                        </div>
                        {task.dueDate && (
                          <div className="text-[10px] font-mono text-zinc-500 shrink-0 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {task.dueDate}
                          </div>
                        )}
                      </div>

                      {/* AI Auto-Execute Deliverable Action */}
                      <div className="pt-2 flex items-center justify-between gap-2">
                        {task.deliverable ? (
                          <button
                            onClick={() => onViewDeliverable(task)}
                            className="w-full text-xs font-semibold py-1.5 px-2 rounded-lg bg-emerald-950/70 border border-emerald-800 text-emerald-300 hover:bg-emerald-900/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            View AI Deliverable
                          </button>
                        ) : (
                          <button
                            onClick={() => onAutoExecuteTask(task)}
                            disabled={isExecuting}
                            className="w-full text-xs font-semibold py-1.5 px-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 shadow-md shadow-amber-500/10 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {isExecuting ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                                Executor Agent Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                                ✨ AI Auto-Execute Deliverable
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="border border-dashed border-zinc-800 rounded-xl p-6 text-center text-zinc-600 text-xs">
                    No tasks in {col.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Custom Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl text-zinc-100 overflow-hidden space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <KanbanSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Create Workflow Task</h2>
                  <p className="text-xs text-zinc-400">Add an enterprise task ready for autonomous execution.</p>
                </div>
              </div>
              <button onClick={() => setIsNewTaskModalOpen(false)} className="p-1 rounded text-zinc-500 hover:text-zinc-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Draft multi-region failover network runbook"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Description / Deliverable Target</label>
                <textarea
                  rows={3}
                  placeholder="Details for the autonomous agent to fulfill..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Assignee</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none"
                  >
                    <option value="Marcus Vance (DevOps Lead)">Marcus Vance (DevOps Lead)</option>
                    <option value="Sarah Lin (VP Engineering)">Sarah Lin (VP Engineering)</option>
                    <option value="Elena Rostova (Compliance Director)">Elena Rostova (Compliance Director)</option>
                    <option value="Alex Rivera (Head of Product)">Alex Rivera (Head of Product)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Source Doc Reference</label>
                  <select
                    value={newSourceDoc}
                    onChange={(e) => setNewSourceDoc(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none"
                  >
                    <option value="DOC-01">DOC-01 (Roadmap & Architecture)</option>
                    <option value="DOC-02">DOC-02 (InfoSec & Compliance)</option>
                    <option value="DOC-03">DOC-03 (Executive Sync)</option>
                    <option value="DOC-04">DOC-04 (SOP-044 Incident Escalation)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Deliverable Type</label>
                  <select
                    value={newDeliverableType}
                    onChange={(e) => setNewDeliverableType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none"
                  >
                    <option value="technical_spec">Technical Architecture Spec</option>
                    <option value="compliance_doc">Compliance Governance Pack</option>
                    <option value="client_communication">Client Readiness Brief</option>
                    <option value="devops_runbook">DevOps Network Runbook</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                disabled={!newTitle.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
