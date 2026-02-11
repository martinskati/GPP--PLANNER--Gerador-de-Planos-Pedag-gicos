
import { GoogleGenAI, Type } from "@google/genai";
import { LessonPlan } from "../types";

const AVAILABLE_SKILLS = `
BANCO DE HABILIDADES ESTRUTURANTES (SESI/BNCC):
1. SESI.EM13LGG204.c.16 - Negociar interesses comuns.
2. SESI.EM13LP08.s.6 - Sintaxe do português.
3. SESI.EM13LP01.c.17 - Produção de textos multimodais.
4. SESI.EM13LP42.a.19 - Curadoria ética de informação.
5. SESI.EM13LP02.a.3 - Coesão e coerência textual.
6. SESI.EM13LP12.a.5 - Argumentação e fontes confiáveis.
7. SESI.EM13LGG603.s.41 - Processos de criação artística.
8. SESI.EM13LGG305.d.21 - Atuação social e política via linguagens.
9. SESI.EM13LP17.c.23 - Roteirização de vídeos e mídias.
10. SESI.EM13LP51.a.42 - Análise de obras artísticas e culturais.
`;

const SYSTEM_INSTRUCTION = `Você é um Consultor Pedagógico Institucional. Transforme a ideia do professor em um plano técnico.
REGRAS:
1. ODS: Escolha de 1 a 3.
2. SOCIOEMOCIONAL: Identifique competências claras.
3. INCLUSÃO: Use estratégias de DUA.
4. BLOOM: Use verbos de ação adequados.

${AVAILABLE_SKILLS}`;

const lessonPlanSchema = {
  type: Type.OBJECT,
  properties: {
    discipline: { type: Type.STRING },
    content: { type: Type.STRING },
    context: { type: Type.STRING },
    teacherName: { type: Type.STRING },
    ods: { type: Type.ARRAY, items: { type: Type.STRING } },
    socioemotionalSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    learningObjectives: { type: Type.ARRAY, items: { type: Type.STRING } },
    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
    methodology: { type: Type.STRING },
    inclusionStrategies: { type: Type.STRING },
    development: {
      type: Type.OBJECT,
      properties: {
        what: { type: Type.STRING },
        how: { type: Type.STRING }
      },
      required: ["what", "how"]
    },
    learningEvidence: { type: Type.STRING },
    assessmentInstruments: { type: Type.STRING }
  },
  required: [
    "discipline", "content", "context", "teacherName", "ods", 
    "socioemotionalSkills", "learningObjectives", "skills", 
    "methodology", "inclusionStrategies", "development", 
    "learningEvidence", "assessmentInstruments"
  ]
};

export async function generateLessonPlan(teacherText: string): Promise<LessonPlan> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: teacherText,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: lessonPlanSchema,
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (!text) throw new Error("A IA não retornou um plano válido.");
    
    return JSON.parse(text) as LessonPlan;
  } catch (error) {
    console.error("Erro Gemini:", error);
    throw new Error("Erro ao conectar com o assistente. Verifique se a API_KEY foi configurada na Hostinger.");
  }
}
