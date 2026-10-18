import { EnterpriseDocument, WorkflowAction } from '../types';

export const INITIAL_DOCUMENTS: EnterpriseDocument[] = [
  {
    id: 'doc-01',
    code: 'DOC-01',
    title: 'Q4 Global Product Launch & Architecture Roadmap',
    category: 'Roadmap & Architecture',
    sensitivity: 'Internal Use',
    lastUpdated: 'Oct 14, 2026',
    author: 'Sarah Lin (VP Engineering)',
    summary: 'Master engineering roadmap for Q4 2026 detailing hybrid Kubernetes cluster migration, multi-region failover between US-East and Frankfurt EU-Central, API latency SLA target <80ms, and the hard production release milestone for the Tier-1 Financial Institution on November 14, 2026.',
    keyEntities: ['Kubernetes Migration', 'Envoy Gateway', 'Multi-Region Failover', 'Tier-1 Bank SLA', 'Frankfurt EU-Central', 'Latency <80ms'],
    fullText: `Q4 GLOBAL PRODUCT LAUNCH & ARCHITECTURE ROADMAP
Author: Sarah Lin, VP Engineering
Target Period: Q4 2026 (Oct 1 - Dec 31, 2026)
Classification: Internal Confidential - Engineering Leadership

1. STRATEGIC OBJECTIVES
The primary deliverable for Q4 is completing the hybrid cloud container migration to support our flagship Tier-1 Financial Services partner. The platform must transition from single-region legacy VMs to an active-active Kubernetes infrastructure spanned across AWS us-east-1 and GCP europe-west3 (Frankfurt).

2. KEY MILESTONES & TIMELINE
- Milestone 1 (Oct 20, 2026): Network mesh validation and ArgoCD automated deployment pipeline hardening across primary clusters.
- Milestone 2 (Oct 31, 2026): Completion of client API sandbox environment with simulated load testing at 15,000 requests/second.
- Milestone 3 (Nov 14, 2026): HARD PRODUCTION LAUNCH & API FREEZE for Tier-1 Financial Client. Zero downtime cutover with real-time replication.
- Milestone 4 (Nov 28, 2026): Integration of HashiCorp Vault enterprise automated key rotation and secret distribution pipeline.

3. ARCHITECTURAL & SLA SPECIFICATIONS
- Uptime SLA: 99.99% availability backed by contractual financial penalties.
- Latency Budget: Global round-trip API p99 latency must not exceed 80ms under standard peak load.
- Failover Objective: Cross-region automated DNS failover (Route 53 + Cloud DNS) with Recovery Time Objective (RTO) < 60 seconds and Recovery Point Objective (RPO) = 0 for transactional ledgers.
- Data Sharding: Tenant data isolation partitions enforced at the database layer via PostgreSQL Row Level Security (RLS) and cryptographic tenant salt keys.

4. DEPENDENCIES & CROSS-FUNCTIONAL RISKS
- Vault Secret Sync: Current manual key rotation script must be retired before production cutover to satisfy SOC2 compliance.
- Cloud Egress Cost: Cross-region telemetry mirroring must be throttled to prevent unbudgeted cost inflation.`,
    chunks: [
      {
        chunkId: 'DOC-01-C1',
        docId: 'DOC-01',
        docTitle: 'Q4 Global Product Launch & Architecture Roadmap',
        category: 'Roadmap & Architecture',
        tokenCount: 165,
        keywords: ['Kubernetes', 'Tier-1 Bank', 'Frankfurt', 'Migration', 'Milestones'],
        content: `Q4 Architecture Roadmap - Section 1 & 2: Primary deliverable is completing hybrid cloud container migration across AWS us-east-1 and GCP europe-west3 (Frankfurt) for the Tier-1 Financial Services partner. Milestones: M1 (Oct 20) network mesh validation; M2 (Oct 31) client sandbox load testing at 15,000 req/s; M3 (Nov 14) HARD PRODUCTION LAUNCH & API FREEZE; M4 (Nov 28) HashiCorp Vault automated secret rotation.`,
      },
      {
        chunkId: 'DOC-01-C2',
        docId: 'DOC-01',
        docTitle: 'Q4 Global Product Launch & Architecture Roadmap',
        category: 'Roadmap & Architecture',
        tokenCount: 180,
        keywords: ['SLA', 'Latency <80ms', 'Uptime 99.99%', 'Failover', 'RTO'],
        content: `Q4 Architecture Roadmap - Section 3 & 4: Contractual SLA guarantees 99.99% uptime. Latency budget strictly enforces global round-trip API p99 latency < 80ms. Cross-region automated DNS failover RTO < 60s, RPO = 0. Tenant isolation enforced via PostgreSQL Row Level Security (RLS). Dependency risk: Vault manual key rotation must be retired before Nov 14 cutover to satisfy SOC2 rules.`,
      },
    ],
  },
  {
    id: 'doc-02',
    code: 'DOC-02',
    title: 'Enterprise InfoSec & Compliance Policy 2026',
    category: 'InfoSec & Compliance',
    sensitivity: 'SOC2 Restricted',
    lastUpdated: 'Sep 29, 2026',
    author: 'Elena Rostova (Director of InfoSec & Compliance)',
    summary: 'Corporate compliance standard enforcing zero-trust access, mandatory cryptographic key rotation every 90 days via HashiCorp Vault, strict GDPR tenant isolation between EU and US nodes, and vendor egress financial sign-off thresholds exceeding $10k/quarter.',
    keyEntities: ['SOC2 Type II', 'Key Rotation 90-Day', 'HashiCorp Vault', 'GDPR Sovereignty', 'Zero-Trust RBAC', 'Egress Approval Policy'],
    fullText: `ENTERPRISE INFOSEC & DATA GOVERNANCE COMPLIANCE POLICY 2026
Standard Reference: POL-SEC-2026-V3
Author: Elena Rostova, Director of Compliance
Status: Enforced Organization-Wide | Mandatory SOC2 Type II Audit Artifact

1. ACCESS CONTROL & ZERO-TRUST AUTHENTICATION
All production systems, container orchestrators, and relational data clusters require hardware-backed WebAuthn/FIDO2 multi-factor authentication. Role-Based Access Control (RBAC) privileges are reviewed quarterly and revoked immediately upon role reassignment.

2. CRYPTOGRAPHIC KEY LIFECYCLE & ROTATION (MANDATORY 90-DAY SLA)
In compliance with SOC2 Trust Service Criteria CC6.6:
- All database encryption master keys, TLS mutual-auth certificates, and tenant tokenization keys MUST undergo automated cryptographic rotation at least once every 90 days.
- Any manual key management script is strictly prohibited in production. Rotation must be executed through an accredited HSM or HashiCorp Vault Transit Engine with tamper-evident audit logs.
- Failure to comply invalidates client SOC2 attestation guarantees.

3. DATA SOVEREIGNTY & GEOGRAPHIC RESIDENCE (GDPR SECTION 4)
- Customer records classified under European Data Protection Regulations (GDPR) must reside strictly within European Union boundaries (Frankfurt eu-central / europe-west3).
- Data mirroring to US-East is permitted ONLY if personal identifiable information (PII) is cryptographically tokenized and the salt key remains in European HSM vaults.

4. INFRASTRUCTURE EGRESS & THIRD-PARTY INTEGRATION THRESHOLDS
Any outbound cloud network egress configuration or third-party API webhook ingestion projecting to exceed $10,000 per quarter requires explicit written authorization from both the Infrastructure Lead and the Director of Compliance prior to activation.`,
    chunks: [
      {
        chunkId: 'DOC-02-C1',
        docId: 'DOC-02',
        docTitle: 'Enterprise InfoSec & Compliance Policy 2026',
        category: 'InfoSec & Compliance',
        tokenCount: 175,
        keywords: ['SOC2', 'Key Rotation', '90 Days', 'HashiCorp Vault', 'HSM'],
        content: `Enterprise InfoSec Policy - Section 2: In compliance with SOC2 Criteria CC6.6, all database encryption master keys, TLS mutual-auth certificates, and tenant tokenization keys MUST undergo automated cryptographic rotation every 90 days. Manual key scripts are strictly prohibited. Rotation must execute via HashiCorp Vault Transit Engine with tamper-evident audit logs.`,
      },
      {
        chunkId: 'DOC-02-C2',
        docId: 'DOC-02',
        docTitle: 'Enterprise InfoSec & Compliance Policy 2026',
        category: 'InfoSec & Compliance',
        tokenCount: 160,
        keywords: ['GDPR', 'Data Sovereignty', 'Frankfurt', 'Egress Policy', '$10k Threshold'],
        content: `Enterprise InfoSec Policy - Section 3 & 4: Customer records under GDPR must reside strictly within EU boundaries (Frankfurt). Mirroring to US-East allowed only if PII is cryptographically tokenized with European HSM salt. Furthermore, any outbound cloud network egress projecting >$10,000/quarter requires written sign-off from Infrastructure Lead and Director of Compliance.`,
      },
    ],
  },
  {
    id: 'doc-03',
    code: 'DOC-03',
    title: 'Executive Sync Meeting Transcript - Oct 2026',
    category: 'Executive Transcripts',
    sensitivity: 'Executive Only',
    lastUpdated: 'Oct 16, 2026',
    author: 'Executive Operations Recorder',
    summary: 'High-stakes executive coordination between Sarah (VP Eng), Alex (Product), Elena (Compliance), and Marcus (DevOps). Solves budget bottlenecks regarding $48k/mo cloud egress, confirms Nov 14 hard date for Tier-1 bank, and approves contractor hiring to bypass EMEA freeze.',
    keyEntities: ['Tier-1 Bank Deadline', 'Cloud Egress $48k', 'Hiring Freeze Bypass', 'Vault Audit Packet', 'Sarah Lin', 'Marcus Vance', 'Elena Rostova'],
    fullText: `EXECUTIVE SYNC MEETING TRANSCRIPT
Date: October 16, 2026 | Duration: 42 mins
Participants:
- Sarah Lin (VP Engineering)
- Alex Rivera (Head of Product)
- Elena Rostova (Director of Compliance)
- Marcus Vance (DevOps & Infrastructure Lead)

[00:02:15] Sarah: Good morning team. Let's cut straight to the chase. We have 28 days until the Tier-1 Bank production cutover on November 14th. Alex, where do we stand on customer sandbox acceptance?
[00:03:40] Alex: The bank's lead architect completed initial validation yesterday. They are pleased with the sub-60ms response times. However, they are demanding the formal SOC2 interim attestation report signed by Elena before their security review board on November 5th.
[00:05:10] Elena: I cannot sign off on the attestation report right now. Look at our roadmap: the automated HashiCorp Vault key rotation isn't scheduled until Milestone 4 on November 28th. That leaves a 14-day compliance audit gap where keys are still rotated via Marcus's legacy bash script. If the bank's auditors flag that, we breach SOC2 CC6.6.
[00:07:22] Marcus: Elena is right. But the bottleneck is engineering bandwidth. Due to the EMEA hiring freeze, my team has been down two senior site reliability engineers. We are buried in the Kubernetes cluster failover testing between Frankfurt and us-east-1.
[00:09:45] Sarah: Then we make an executive adjustment today. I'm approving an immediate external DevOps contractor from our Tier-1 partner roster to take over the cluster load testing. Marcus, you personally pull the Vault auto-rotation pipeline forward from Milestone 4 to Milestone 2. We need it deployed by October 31st.
[00:11:15] Marcus: Understood. If I get the contractor on Monday, I can finish the Vault Terraform configs by Oct 28th.
[00:13:00] Elena: That solves the compliance gap. Next issue: Marcus, why did Finance flag an unexpected $48,000 monthly cloud egress spike on the staging clusters? That violates Section 4 of our InfoSec policy without prior approval.
[00:14:40] Marcus: That was due to uncompressed cross-region telemetry syncing between the staging VPCs. I can apply a Kubernetes NetworkPolicy and traffic rate-limiter today to throttle non-prod egress. That will drop the monthly burn by $35,000 within 24 hours.
[00:16:30] Alex: Excellent. I will send a note to the bank's procurement VP confirming our November 14 cutover is locked and that Elena's compliance packet will arrive on November 2nd.`,
    chunks: [
      {
        chunkId: 'DOC-03-C1',
        docId: 'DOC-03',
        docTitle: 'Executive Sync Meeting Transcript - Oct 2026',
        category: 'Executive Transcripts',
        tokenCount: 190,
        keywords: ['Bank Deadline', 'Vault Key Rotation', 'Hiring Freeze', 'Sarah', 'Elena'],
        content: `Executive Sync - Sarah, Alex, Elena, Marcus: 28 days until Tier-1 Bank launch on Nov 14. Elena flags that Vault automated key rotation must be moved from Nov 28 (M4) to Oct 31 (M2) to satisfy bank auditors by Nov 5. Sarah approves external DevOps contractor to bypass EMEA hiring freeze so Marcus can expedite Vault rotation.`,
      },
      {
        chunkId: 'DOC-03-C2',
        docId: 'DOC-03',
        docTitle: 'Executive Sync Meeting Transcript - Oct 2026',
        category: 'Executive Transcripts',
        tokenCount: 170,
        keywords: ['Egress $48k', 'NetworkPolicy', 'Cost Savings', 'November 14 Cutover'],
        content: `Executive Sync - Egress & Final Outcomes: Elena addresses $48k/mo cloud egress spike violating policy. Marcus commits to implementing Kubernetes NetworkPolicy and telemetry compression immediately, saving $35k/mo. Alex locks Nov 14 for cutover and confirms compliance packet delivery for Nov 2.`,
      },
    ],
  },
  {
    id: 'doc-04',
    code: 'DOC-04',
    title: 'Standard Operating Procedure (SOP) - Incident Escalation',
    category: 'Standard Operating Procedures',
    sensitivity: 'Internal Use',
    lastUpdated: 'Aug 18, 2026',
    author: 'Marcus Vance (DevOps Lead)',
    summary: 'Standard DevOps incident protocol defining SEV-1 to SEV-3 classification, mandatory 15-minute response SLA for production outages, PagerDuty on-call dispatch rules, and required blameless root-cause analysis (RCA) within 48 hours.',
    keyEntities: ['SEV-1 Critical Outage', '15-min SLA', 'PagerDuty On-Call', 'War Room Escalation', 'Blameless RCA (48h)', 'Client Communications'],
    fullText: `STANDARD OPERATING PROCEDURE: INCIDENT CLASSIFICATION & ESCALATION PROTOCOL
SOP Code: SOP-OPS-044
Author: Marcus Vance, DevOps Lead
Approved By: Sarah Lin, VP Engineering

1. SEVERITY LEVEL CLASSIFICATIONS
- SEV-1 (Critical System Outage): Complete loss of service, API gateway 5xx error rate >1%, cross-region database failover failure, or potential data integrity breach affecting customer transactions.
- SEV-2 (Major Degradation): High latency exceeding SLA (>150ms p99 for >5 minutes), failure of non-critical asynchronous worker queues, or single availability zone degradation with successful failover.
- SEV-3 (Minor Incident): Isolated UI bug, internal tooling glitch, or non-impacting telemetry failure.

2. SEV-1 RESPONSE SLAs & COMMAND PROTOCOL
- Acknowledgment SLA: On-call SRE must acknowledge PagerDuty page within 5 minutes.
- Incident Commander Assembly: Virtual War Room (Google Meet / Slack #incident-sev1) convened within 15 minutes.
- VP Engineering Notification: Immediate SMS and call to Sarah Lin if outage duration exceeds 20 minutes.
- Client Broadcast: Public status page updated within 30 minutes; dedicated customer success managers alert Tier-1 accounts.

3. POST-INCIDENT REMEDIATION & ROOT CAUSE ANALYSIS (RCA)
- Within 48 hours of resolution, Incident Commander must publish a comprehensive blameless RCA.
- All action items generated in the RCA must be imported into the Autonomous Workflow Board with a target completion of no more than 10 business days.`,
    chunks: [
      {
        chunkId: 'DOC-04-C1',
        docId: 'DOC-04',
        docTitle: 'Standard Operating Procedure (SOP) - Incident Escalation',
        category: 'Standard Operating Procedures',
        tokenCount: 160,
        keywords: ['SEV-1', '15-min SLA', 'Incident Commander', 'PagerDuty', 'Escalation'],
        content: `SOP-OPS-044 Incident Escalation: SEV-1 defined as complete service loss, API 5xx >1%, or cross-region database failover failure. On-call SRE must acknowledge within 5 minutes; Incident Commander must assemble Virtual War Room within 15 minutes. VP Engineering notified at 20 minutes; client status page updated at 30 minutes.`,
      },
      {
        chunkId: 'DOC-04-C2',
        docId: 'DOC-04',
        docTitle: 'Standard Operating Procedure (SOP) - Incident Escalation',
        category: 'Standard Operating Procedures',
        tokenCount: 140,
        keywords: ['Blameless RCA', '48 Hours', 'Workflow Board', 'Action Items'],
        content: `SOP-OPS-044 Post-Mortem Protocol: Incident Commander must deliver a blameless Root Cause Analysis (RCA) within 48 hours of resolution. All corrective action items must be automatically registered in the Autonomous Workflow Board with a maximum 10-day resolution SLA.`,
      },
    ],
  },
];

export const INITIAL_WORKFLOW_TASKS: WorkflowAction[] = [
  {
    id: 'task-01',
    title: 'Deploy Automated HashiCorp Vault Key Rotation Pipeline',
    description: 'Pull forward Vault Transit Engine rotation configuration from M4 to M2 to eliminate the 14-day SOC2 audit vulnerability prior to the Tier-1 bank deadline.',
    priority: 'Urgent',
    assignee: 'Marcus Vance (DevOps Lead)',
    sourceDocId: 'DOC-02',
    deliverableType: 'technical_spec',
    status: 'in_progress',
    createdAt: '2026-10-17T14:30:00Z',
    dueDate: 'Oct 31, 2026',
  },
  {
    id: 'task-02',
    title: 'Enforce Egress Rate Limiting on Staging Kubernetes Clusters',
    description: 'Implement NetworkPolicy to throttle cross-region staging telemetry and reduce unbudgeted $48,000/mo cloud egress burn.',
    priority: 'High',
    assignee: 'Marcus Vance (DevOps Lead)',
    sourceDocId: 'DOC-03',
    deliverableType: 'devops_runbook',
    status: 'todo',
    createdAt: '2026-10-17T15:00:00Z',
    dueDate: 'Oct 23, 2026',
  },
  {
    id: 'task-03',
    title: 'Prepare SOC2 Type II Interim Attestation Packet for Tier-1 Bank',
    description: 'Compile cryptographic key rotation audit logs and GDPR Frankfurt tenant residency proof for bank procurement security review.',
    priority: 'High',
    assignee: 'Elena Rostova (Compliance Director)',
    sourceDocId: 'DOC-02',
    deliverableType: 'compliance_doc',
    status: 'todo',
    createdAt: '2026-10-17T15:15:00Z',
    dueDate: 'Nov 02, 2026',
  },
  {
    id: 'task-04',
    title: 'Conduct Multi-Region Disaster Recovery & 60-Second Failover Drill',
    description: 'Execute synthetic traffic cutover test between AWS us-east-1 and GCP europe-west3 to certify <80ms p99 latency SLA and RTO <60s.',
    priority: 'Medium',
    assignee: 'Sarah Lin (VP Engineering)',
    sourceDocId: 'DOC-01',
    deliverableType: 'technical_spec',
    status: 'completed',
    createdAt: '2026-10-15T10:00:00Z',
    dueDate: 'Oct 20, 2026',
  },
];

export const JUDGE_DEMO_PROMPTS = [
  {
    id: 'prompt-1',
    title: 'Compliance Risks & Roadmap Alignment',
    query: 'What are the compliance risks in our Q4 roadmap and create tasks to fix them?',
    badge: 'Popular for Judges',
    description: 'Tests multi-agent cross-document reasoning across DOC-01 and DOC-02.',
  },
  {
    id: 'prompt-2',
    title: 'Tier-1 Bank Deliverable Timeline',
    query: 'Summarize the Tier-1 bank deliverable timeline, SLA requirements, and who is accountable.',
    badge: 'Executive Brief',
    description: 'Synthesizes launch milestones, latency SLAs, and executive owners.',
  },
  {
    id: 'prompt-3',
    title: 'SEV-1 Cloud Outage Escalation SOP',
    query: 'What is our incident escalation protocol for SEV-1 cloud outages according to SOP?',
    badge: 'Ops Protocol',
    description: 'Evaluates SOP-044 rules, 15-minute response SLA, and RCA mandate.',
  },
  {
    id: 'prompt-4',
    title: 'Vendor & Egress Policy Compliance',
    query: 'Compare our vendor approval policy with the Q4 architecture migration requirements.',
    badge: 'Governance',
    description: 'Exposes the $10k egress threshold rule and cost reduction actions.',
  },
];
