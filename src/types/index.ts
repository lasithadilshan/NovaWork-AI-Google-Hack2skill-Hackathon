export type PriorityLevel = 'Urgent' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'completed';

export interface DocumentChunk {
  chunkId: string;
  docId: string;
  docTitle: string;
  content: string;
  tokenCount: number;
  category: string;
  keywords: string[];
  relevanceScore?: number;
}

export interface EnterpriseDocument {
  id: string;
  code: string; // e.g. DOC-01
  title: string;
  category: 'Roadmap & Architecture' | 'InfoSec & Compliance' | 'Executive Transcripts' | 'Standard Operating Procedures' | 'Custom Upload';
  sensitivity: 'Confidential' | 'SOC2 Restricted' | 'Internal Use' | 'Executive Only';
  lastUpdated: string;
  author: string;
  summary: string;
  keyEntities: string[];
  fullText: string;
  chunks: DocumentChunk[];
}

export interface ReasoningTraceStep {
  step: string;
  agent: string;
  detail: string;
  latencyMs?: number;
  confidenceScore?: number;
}

export interface Citation {
  docId: string;
  title: string;
  snippet: string;
  relevanceScore?: number;
}

export interface WorkflowAction {
  id: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  assignee: string;
  sourceDocId?: string;
  deliverableType: 'technical_spec' | 'compliance_doc' | 'client_communication' | 'devops_runbook' | 'audit_checklist';
  status: TaskStatus;
  createdAt: string;
  dueDate?: string;
  deliverable?: TaskDeliverable;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  reasoningTrace?: ReasoningTraceStep[];
  citations?: Citation[];
  suggestedActions?: WorkflowAction[];
  isThinking?: boolean;
}

export interface KeyDecision {
  decision: string;
  stakeholders: string;
  impact: string;
}

export interface BlockerRisk {
  title: string;
  severity: 'Critical' | 'Major' | 'Minor';
  description: string;
  impactedDept?: string;
}

export interface ExtractedMeetingAction {
  id: string;
  title: string;
  assignee: string;
  priority: PriorityLevel;
  deadline: string;
  sourceQuote: string;
  suggestedDeliverable?: string;
}

export interface MeetingAnalysis {
  executiveSummary: string;
  keyDecisions: KeyDecision[];
  riskAnalysis: {
    overallRiskScore: number;
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
    blockers: BlockerRisk[];
  };
  actionItems: ExtractedMeetingAction[];
  followUpDraft: {
    subject: string;
    body: string;
  };
}

export interface TaskDeliverable {
  deliverableTitle: string;
  format: string;
  estimatedHoursSaved: number;
  summary: string;
  contentMarkdown: string;
  keyArtifactsProduced: string[];
  auditComplianceTag: string;
}
