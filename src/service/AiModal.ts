import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { GoogleAICacheManager } from "@google/generative-ai/server";
import { tables } from "../utils/tableData";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

const schemaContent = JSON.stringify(tables, null, 2);

let cachedModel: GenerativeModel | null = null;

async function initializeCache(): Promise<void> {
  const cacheManager = new GoogleAICacheManager(apiKey);

  const model = "models/gemini-1.5-flash-001";
  const displayName = "schema-content";
  const systemInstruction =
    "You are an expert SQL query generator. Your task is to generate SQL queries based on the provided schema and user questions. Only respond with the SQL query, nothing else.";
  let ttlSeconds = 3600; // Cache for 1 hour

  const cache = await cacheManager.create({
    model,
    displayName,
    systemInstruction,
    contents: [
      {
        role: "user",
        parts: [{ text: schemaContent }],
      },
    ],
    ttlSeconds,
  });

  cachedModel = genAI.getGenerativeModelFromCachedContent(cache);
}

async function generateQuery(question: string): Promise<string> {
  if (!cachedModel) {
    await initializeCache();
  }

  if (!cachedModel) {
    throw new Error("Failed to initialize cached model");
  }

  const result = await cachedModel.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: question }],
      },
    ],
    generationConfig,
  });

  return result.response.text();
}

export { generateQuery };
