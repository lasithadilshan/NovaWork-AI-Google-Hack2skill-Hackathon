import { DocumentChunk, EnterpriseDocument } from '../types';

// Stopwords for cleaner keyword extraction and TF-IDF
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most',
  'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than',
  'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this',
  'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when',
  'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'you', 'your', 'yours', 'yourself',
]);

// Tokenize text into normalized tokens
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

// Extract top keywords from text
export function extractKeywords(text: string, topN: number = 6): string[] {
  const tokens = tokenize(text);
  const freq: Record<string, number> = {};

  for (const token of tokens) {
    freq[token] = (freq[token] || 0) + 1;
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}

// Client-side chunker that partitions documents with overlap
export function chunkDocument(
  docId: string,
  docTitle: string,
  category: string,
  text: string,
  chunkSizeWords: number = 100,
  overlapWords: number = 20
): DocumentChunk[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const chunks: DocumentChunk[] = [];
  let index = 0;
  let chunkNumber = 1;

  while (index < words.length) {
    const chunkWords = words.slice(index, index + chunkSizeWords);
    const content = chunkWords.join(' ');
    const chunkId = `${docId}-C${chunkNumber}`;
    const keywords = extractKeywords(content, 5);

    chunks.push({
      chunkId,
      docId,
      docTitle,
      category,
      content,
      tokenCount: Math.round(chunkWords.length * 1.3),
      keywords,
    });

    index += Math.max(chunkSizeWords - overlapWords, 1);
    chunkNumber++;

    if (index >= words.length - overlapWords && index < words.length) {
      break;
    }
  }

  return chunks;
}

// Hybrid semantic + keyword retrieval engine
export function retrieveRelevantChunks(
  query: string,
  documents: EnterpriseDocument[],
  topK: number = 4
): DocumentChunk[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    // Return first chunks of first docs if query is empty
    return documents.flatMap((d) => d.chunks).slice(0, topK);
  }

  const allChunks = documents.flatMap((doc) =>
    doc.chunks.map((c) => ({
      ...c,
      docTitle: doc.title,
      docId: doc.code,
    }))
  );

  const scoredChunks = allChunks.map((chunk) => {
    const chunkTokens = tokenize(`${chunk.docTitle} ${chunk.content} ${chunk.keywords.join(' ')}`);
    const chunkSet = new Set(chunkTokens);

    let matchCount = 0;
    let exactPhraseBonus = 0;

    for (const qToken of queryTokens) {
      if (chunkSet.has(qToken)) {
        matchCount += 1;
      }
    }

    // Exact phrase match bonus
    if (chunk.content.toLowerCase().includes(query.toLowerCase())) {
      exactPhraseBonus += 3;
    }

    // Keyword match bonus
    const keywordMatches = chunk.keywords.filter((k) =>
      query.toLowerCase().includes(k.toLowerCase())
    ).length;

    const rawScore = (matchCount * 1.5) + (keywordMatches * 2) + exactPhraseBonus;
    const maxPossible = Math.max(queryTokens.length * 1.5, 1);
    const normalizedScore = Math.min(Math.round((rawScore / maxPossible) * 75) + 25, 99);

    return {
      ...chunk,
      relevanceScore: normalizedScore,
    };
  });

  return scoredChunks
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
    .slice(0, topK);
}
