import { EmbeddingModel, LanguageModel } from "ai";
import { createOllama } from "ollama-ai-provider-v2";

export const ollama = createOllama({
  baseURL: "http://localhost:11434/api",
});
export const qwen3: LanguageModel = ollama("qwen3:0.6b");

export const gemma3: LanguageModel = ollama("gemma3:1b");

export const embeddingModel: EmbeddingModel = ollama.textEmbeddingModel("bge-m3");
