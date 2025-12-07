import { GoogleGenAI } from "@google/genai";
import { MetricData, Language } from "../types";
import { translations } from "../translations";

const SYSTEM_INSTRUCTION = `
You are a senior financial analyst and historian. Your job is to analyze current stock market indicators provided to you and determine if the market is in a bubble.
You must remain objective, citing historical precedents (like 2000 Dotcom or 2008 GFC) where relevant.
Structure your response in Markdown.
Keep your analysis concise (max 200 words) but insightful.
Provide a clear "Verdict" at the end.
`;

export const analyzeMarket = async (metrics: MetricData[], overallScore: number, lang: Language): Promise<string> => {
  const t = translations[lang];
  try {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return `## ${t.apiMissing}\n\n${t.apiMissingText}`;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Construct a prompt based on the current data
    const dataSummary = metrics.map(m => 
      `- ${m.name}: ${m.currentValue}${m.unit} (Status: ${m.status})`
    ).join('\n');

    const prompt = `
    Here is the live dashboard data for the US Stock Market:
    
    Overall Bubble Risk Score: ${overallScore}/100
    
    Key Indicators:
    ${dataSummary}
    
    Based on these metrics, write a short analysis for a retail investor.
    1. Are we in a bubble? 
    2. Which indicator is most concerning?
    3. What is the historical context?
    
    IMPORTANT: Write your response in ${lang === 'zh' ? 'Chinese (Simplified)' : 'English'}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "Analysis could not be generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return `## ${t.serviceError}\n\n${t.serviceErrorText}`;
  }
};
