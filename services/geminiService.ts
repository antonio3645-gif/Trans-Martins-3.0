import { GoogleGenAI } from "@google/genai";
import { Trip, Truck } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeLogisticsData = async (
  prompt: string,
  contextData: { trips: Trip[]; trucks: Truck[] }
): Promise<string> => {
  try {
    const contextString = `
    Contexto de Dados da Trans Martins:
    Caminhões: ${JSON.stringify(contextData.trucks)}
    Viagens Recentes/Atuais: ${JSON.stringify(contextData.trips)}
    
    Instrução do Sistema:
    Você é um assistente de logística sênior da empresa "Trans Martins". 
    Seu objetivo é analisar os dados da frota e das viagens para fornecer insights sobre eficiência, custos, manutenção e status.
    Responda de forma profissional, direta e em Português do Brasil.
    Use formatação Markdown para melhor leitura.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: contextString + "\n\nPergunta do usuário: " + prompt }] }
      ],
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Não foi possível gerar uma análise no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao conectar com o assistente inteligente. Verifique sua conexão ou tente novamente mais tarde.";
  }
};
