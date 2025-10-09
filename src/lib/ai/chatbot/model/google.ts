import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { LanguageModel } from 'ai';

export const google = createGoogleGenerativeAI({
    baseURL: "https://generativelanguage.googleapis.com/v1beta",
    apiKey: process.env.GOOGLE_API_KEY,
})

export const geminiFlashLite : LanguageModel = google("gemini-2.5-flash-lite");