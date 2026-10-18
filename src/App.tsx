/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar, ActiveModule } from './components/Sidebar';
import { KnowledgeBaseModule } from './modules/KnowledgeBaseModule';
import { RAGCopilotModule } from './modules/RAGCopilotModule';
import { MeetingIntelligenceModule } from './modules/MeetingIntelligenceModule';
import { WorkflowBoardModule } from './modules/WorkflowBoardModule';
import { DocumentInspectorModal } from './components/DocumentInspectorModal';
import { TaskDeliverableModal } from './components/TaskDeliverableModal';
import { DemoTourModal } from './components/DemoTourModal';
import { INITIAL_DOCUMENTS, INITIAL_WORKFLOW_TASKS } from './data/initialData';
import { EnterpriseDocument, WorkflowAction, TaskStatus, TaskDeliverable } from './types';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('copilot');
  const [documents, setDocuments] = useState<EnterpriseDocument[]>(INITIAL_DOCUMENTS);
  const [tasks, setTasks] = useState<WorkflowAction[]>(INITIAL_WORKFLOW_TASKS);

  // Modals state
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [inspectedDoc, setInspectedDoc] = useState<EnterpriseDocument | null>(null);
  const [deliverableModalTask, setDeliverableModalTask] = useState<WorkflowAction | null>(null);
  const [activeDeliverable, setActiveDeliverable] = useState<TaskDeliverable | null>(null);

  // Async Execution State
  const [executingTaskId, setExecutingTaskId] = useState<string | null>(null);
  const [copilotExternalQuery, setCopilotExternalQuery] = useState<string | undefined>(undefined);

  // Total chunks computed
  const totalChunksCount = useMemo(() => {
    return documents.reduce((acc, doc) => acc + doc.chunks.length, 0);
  }, [documents]);

  // Handler for adding ingested document
  const handleAddDocument = (newDoc: EnterpriseDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch (e) {
      // ignore
    }
  };

  // Handler for adding single task (from RAG Copilot or Manual)
  const handleAddTask = (newTask: WorkflowAction) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  // Handler for adding batch tasks (from Meeting Intelligence)
  const handleAddBatchTasks = (newTasks: WorkflowAction[]) => {
    setTasks((prev) => [...newTasks, ...prev]);
  };

  // Handler for updating task status
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  // Inspect doc by Code (e.g. DOC-01)
  const handleInspectDocumentCode = (code: string) => {
    const found = documents.find(
      (d) => d.code.toLowerCase() === code.toLowerCase() || d.id === code
    );
    if (found) {
      setInspectedDoc(found);
    }
  };

  // Ask Copilot query jump
  const handleAskCopilot = (query: string) => {
    setCopilotExternalQuery(query);
    setActiveModule('copilot');
  };

  // AI Auto-Execute Task Deliverable
  const handleAutoExecuteTask = async (task: WorkflowAction) => {
    setExecutingTaskId(task.id);

    try {
      const response = await fetch('/api/gemini/execute-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task,
          relevantDocs: documents.map((d) => ({
            code: d.code,
            title: d.title,
            summary: d.summary,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Task execution failed on server');
      }

      const deliverable: TaskDeliverable = await response.json();

      // Update task with deliverable
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, deliverable } : t))
      );

      // Open modal
      setDeliverableModalTask(task);
      setActiveDeliverable(deliverable);
    } catch (err: any) {
      console.error('Task execution error:', err);
    } finally {
      setExecutingTaskId(null);
    }
  };

  // View existing deliverable
  const handleViewDeliverable = (task: WorkflowAction) => {
    if (task.deliverable) {
      setDeliverableModalTask(task);
      setActiveDeliverable(task.deliverable);
    }
  };

  // Approve deliverable and mark completed
  const handleApproveAndComplete = (taskId: string) => {
    handleUpdateTaskStatus(taskId, 'completed');
  };

  // Judge Demo Quick Action shortcuts
  const handleJudgeQuickAction = (actionType: 'test_rag' | 'test_meeting' | 'test_workflow' | 'inspect_doc') => {
    switch (actionType) {
      case 'test_rag':
        setActiveModule('copilot');
        setCopilotExternalQuery('What are the compliance risks in our Q4 roadmap and create tasks to fix them?');
        break;
      case 'test_meeting':
        setActiveModule('meeting');
        break;
      case 'test_workflow':
        setActiveModule('workflow');
        // Auto execute task-01 (HashiCorp Vault)
        const targetTask = tasks.find((t) => t.id === 'task-01') || tasks[0];
        if (targetTask) {
          handleAutoExecuteTask(targetTask);
        }
        break;
      case 'inspect_doc':
        setActiveModule('knowledge');
        const doc01 = documents.find((d) => d.code === 'DOC-01') || documents[0];
        if (doc01) setInspectedDoc(doc01);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Application Header */}
      <Header
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
        activeAgentsCount={3}
        onQuickJudgeAction={() => handleJudgeQuickAction('test_rag')}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          documentCount={documents.length}
          taskCount={tasks.length}
          totalChunksCount={totalChunksCount}
        />

        {/* Active Content Module */}
        <main className="flex-1 overflow-y-auto bg-zinc-950/60 relative">
          {activeModule === 'knowledge' && (
            <KnowledgeBaseModule
              documents={documents}
              onAddDocument={handleAddDocument}
              onInspectDocument={setInspectedDoc}
              onAskCopilot={handleAskCopilot}
            />
          )}

          {activeModule === 'copilot' && (
            <RAGCopilotModule
              documents={documents}
              onAddWorkflowTask={handleAddTask}
              onInspectDocumentCode={handleInspectDocumentCode}
              externalQuery={copilotExternalQuery}
              onClearExternalQuery={() => setCopilotExternalQuery(undefined)}
            />
          )}

          {activeModule === 'meeting' && (
            <MeetingIntelligenceModule
              onAddBatchTasks={handleAddBatchTasks}
              onNavigateToWorkflow={() => setActiveModule('workflow')}
            />
          )}

          {activeModule === 'workflow' && (
            <WorkflowBoardModule
              tasks={tasks}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onAddTask={handleAddTask}
              onAutoExecuteTask={handleAutoExecuteTask}
              executingTaskId={executingTaskId}
              onInspectDocumentCode={handleInspectDocumentCode}
              onViewDeliverable={handleViewDeliverable}
            />
          )}
        </main>
      </div>

      {/* Interactive Modals */}
      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onQuickAction={handleJudgeQuickAction}
      />

      <DocumentInspectorModal
        document={inspectedDoc}
        isOpen={Boolean(inspectedDoc)}
        onClose={() => setInspectedDoc(null)}
        onAskCopilot={handleAskCopilot}
      />

      <TaskDeliverableModal
        task={deliverableModalTask}
        deliverable={activeDeliverable}
        isOpen={Boolean(deliverableModalTask && activeDeliverable)}
        onClose={() => {
          setDeliverableModalTask(null);
          setActiveDeliverable(null);
        }}
        onApproveAndComplete={handleApproveAndComplete}
      />
    </div>
  );
}
