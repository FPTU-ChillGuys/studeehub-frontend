import { openai } from '@ai-sdk/openai';


export const gpt5nano = openai('gpt-5-nano');

export const gptEmbedding = openai.textEmbeddingModel('text-embedding-3-small');