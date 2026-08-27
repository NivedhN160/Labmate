import { pipeline, env } from "@xenova/transformers";

// Ensure local execution behavior depending on environment (avoiding external fetches if not needed, though it will fetch the model the first time)
env.allowLocalModels = true;
env.useBrowserCache = false; 

class PipelineSingleton {
    static task: any = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance: any = null;

    static async getInstance(progress_callback?: Function) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

export async function embed(texts: string[]): Promise<number[][]> {
    if (!texts || texts.length === 0) return [];
    
    const extractor = await PipelineSingleton.getInstance();
    
    const output = await extractor(texts, { pooling: 'mean', normalize: true });
    
    return output.tolist();
}

export async function embedQuery(query: string): Promise<number[]> {
    const embeddings = await embed([query]);
    return embeddings[0];
}
