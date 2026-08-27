export interface Document {
  text: string;
  embedding: number[];
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// In-memory store (for simplicity in serverless context)
export class MemoryVectorStore {
  documents: Document[] = [];

  addDocuments(chunks: string[], embeddings: number[][]) {
    for (let i = 0; i < chunks.length; i++) {
      this.documents.push({
        text: chunks[i],
        embedding: embeddings[i],
      });
    }
  }

  similaritySearch(queryEmbedding: number[], k = 4): { text: string; score: number }[] {
    const scoredDocs = this.documents.map((doc) => ({
      text: doc.text,
      score: cosineSimilarity(queryEmbedding, doc.embedding),
    }));

    scoredDocs.sort((a, b) => b.score - a.score);
    return scoredDocs.slice(0, k);
  }
}
