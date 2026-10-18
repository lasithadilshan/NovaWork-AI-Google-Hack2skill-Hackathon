import React, { useState } from 'react';
import { EnterpriseDocument } from '../types';
import { chunkDocument } from '../utils/ragEngine';
import {
  BookOpen,
  Search,
  Plus,
  Filter,
  Layers,
  Shield,
  FileText,
  Calendar,
  User,
  ArrowUpRight,
  BotMessageSquare,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  X,
  FileUp,
} from 'lucide-react';

interface KnowledgeBaseModuleProps {
  documents: EnterpriseDocument[];
  onAddDocument: (doc: EnterpriseDocument) => void;
  onInspectDocument: (doc: EnterpriseDocument) => void;
  onAskCopilot: (queryOrDoc: string) => void;
}

export const KnowledgeBaseModule: React.FC<KnowledgeBaseModuleProps> = ({
  documents,
  onAddDocument,
  onInspectDocument,
  onAskCopilot,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // New Doc Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<EnterpriseDocument['category']>('Roadmap & Architecture');
  const [newSensitivity, setNewSensitivity] = useState<EnterpriseDocument['sensitivity']>('Internal Use');
  const [newContent, setNewContent] = useState('');
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);

  const categories = ['All', 'Roadmap & Architecture', 'InfoSec & Compliance', 'Executive Transcripts', 'Standard Operating Procedures'];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.keyEntities.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!newTitle) {
      setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setNewContent(text);
    };
    reader.readAsText(file);
  };

  const handleSaveDocument = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsProcessingDoc(true);

    try {
      const nextDocNum = documents.length + 1;
      const code = `DOC-${nextDocNum.toString().padStart(2, '0')}`;
      const id = `doc-${Date.now()}`;

      // 1. Chunk document
      const chunks = chunkDocument(code, newTitle, newCategory, newContent, 100, 20);

      // 2. Fetch AI summary or generate fallback
      let summary = newContent.slice(0, 200) + '...';
      let keyEntities = ['Enterprise', 'Architecture', 'Policy'];

      try {
        const res = await fetch('/api/gemini/document-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle, content: newContent }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.executiveSummary) summary = data.executiveSummary;
          if (data.keyEntities) keyEntities = data.keyEntities;
        }
      } catch (err) {
        console.warn('Doc summary fallback used');
      }

      const newDoc: EnterpriseDocument = {
        id,
        code,
        title: newTitle,
        category: newCategory,
        sensitivity: newSensitivity,
        lastUpdated: 'Just now',
        author: 'Current User (Ingested)',
        summary,
        keyEntities,
        fullText: newContent,
        chunks,
      };

      onAddDocument(newDoc);
      setIsUploadOpen(false);
      setNewTitle('');
      setNewContent('');
    } finally {
      setIsProcessingDoc(false);
    }
  };

  const getSensitivityBadge = (level: string) => {
    switch (level) {
      case 'SOC2 Restricted':
        return 'bg-rose-950/70 border-rose-800 text-rose-300';
      case 'Executive Only':
        return 'bg-purple-950/70 border-purple-800 text-purple-300';
      case 'Confidential':
        return 'bg-amber-950/70 border-amber-800 text-amber-300';
      default:
        return 'bg-zinc-800/80 border-zinc-700 text-zinc-300';
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Enterprise Knowledge Base & RAG Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Pre-loaded with 4 core enterprise documents for zero-setup evaluation. Automatic client-side chunking, semantic indexing, and grounded citation verification.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Ingest New Document
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents, entities, or SOC2 policies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mr-1 hidden sm:inline">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                  : 'bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700/80 transition-all p-5 flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {doc.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${getSensitivityBadge(doc.sensitivity)}`}>
                    <Shield className="w-2.5 h-2.5 inline mr-1" />
                    {doc.sensitivity}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                  <Layers className="w-3 h-3" />
                  {doc.chunks.length} chunks
                </span>
              </div>

              {/* Title & Category */}
              <div>
                <h3 className="text-base font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                  {doc.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                  <span>{doc.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-zinc-600" />
                    {doc.author}
                  </span>
                  <span>•</span>
                  <span>{doc.lastUpdated}</span>
                </div>
              </div>

              {/* Executive Summary */}
              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                {doc.summary}
              </p>

              {/* Entity Chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {doc.keyEntities.slice(0, 4).map((ent, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950/70 border border-zinc-800 text-zinc-400"
                  >
                    {ent}
                  </span>
                ))}
                {doc.keyEntities.length > 4 && (
                  <span className="text-[10px] font-mono text-zinc-500">
                    +{doc.keyEntities.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-2">
              <button
                onClick={() => onInspectDocument(doc)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Inspect Chunks & Vectors
              </button>

              <button
                onClick={() => onAskCopilot(`What are the key requirements and SLAs in ${doc.code} (${doc.title})?`)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/70 text-indigo-300 border border-indigo-800/40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <BotMessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                Ask Copilot
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Slide-over for Document Ingestion */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl text-zinc-100 overflow-hidden space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Ingest Enterprise Document</h2>
                  <p className="text-xs text-zinc-400">Upload or paste text. Automatic chunking and Gemini semantic indexing will occur.</p>
                </div>
              </div>
              <button onClick={() => setIsUploadOpen(false)} className="p-1 rounded text-zinc-500 hover:text-zinc-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Cloud Security Standard"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Roadmap & Architecture">Roadmap & Architecture</option>
                    <option value="InfoSec & Compliance">InfoSec & Compliance</option>
                    <option value="Executive Transcripts">Executive Transcripts</option>
                    <option value="Standard Operating Procedures">Standard Operating Procedures</option>
                    <option value="Custom Upload">Custom Upload</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Sensitivity Classification</label>
                  <select
                    value={newSensitivity}
                    onChange={(e) => setNewSensitivity(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Internal Use">Internal Use</option>
                    <option value="Confidential">Confidential</option>
                    <option value="SOC2 Restricted">SOC2 Restricted</option>
                    <option value="Executive Only">Executive Only</option>
                  </select>
                </div>
              </div>

              {/* Upload File shortcut */}
              <div className="border border-dashed border-zinc-800 rounded-xl p-3 text-center bg-zinc-900/20 hover:border-zinc-700 transition-colors">
                <input
                  type="file"
                  id="doc-file-input"
                  accept=".txt,.md,.csv,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="doc-file-input"
                  className="cursor-pointer flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-200 font-medium"
                >
                  <FileUp className="w-4 h-4 text-indigo-400" />
                  <span>Choose a file (.txt, .md, .csv) or paste content below</span>
                </label>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Document Content</label>
                <textarea
                  rows={6}
                  placeholder="Paste raw markdown, policy text, or transcript notes here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsUploadOpen(false)}
                className="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDocument}
                disabled={!newTitle.trim() || !newContent.trim() || isProcessingDoc}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {isProcessingDoc ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    Chunking & Indexing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Index & Save Document
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
