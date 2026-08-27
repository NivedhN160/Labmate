import { chunkText } from "./chunker";
import { embed, embedQuery } from "./embeddings";
import { MemoryVectorStore } from "./vectorStore";

export async function retrieveRelevantChunks(rawText: string, question: string, k = 4): Promise<string[]> {
  if (!rawText) return [];

  // 1. Chunk the text
  const chunks = chunkText(rawText);
  
  // 2. Embed the chunks
  const chunkEmbeddings = await embed(chunks);
  
  // 3. Create a vector store
  const vectorStore = new MemoryVectorStore();
  vectorStore.addDocuments(chunks, chunkEmbeddings);
  
  // 4. Embed the query
  const queryEmbedding = await embedQuery(question);
  
  // 5. Search
  const results = vectorStore.similaritySearch(queryEmbedding, k);
  
  return results.map(r => r.text);
}
