
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

const SYSTEM_INSTRUCTION = `Você é um Consultor Pedagógico Institucional de alto nível. 
Sua tarefa é ORGANIZAR, SISTEMATIZAR e QUALIFICAR a ideia do professor, transformando-a em um plano de aula técnico e estruturado.

REGRAS OBRIGATÓRIAS:
1. ODS: Escolha e liste de 1 a 3 Objetivos de Desenvolvimento Sustentável relacionados.
2. SOCIOEMOCIONAL: Identifique competências socioemocionais claras que serão desenvolvidas.
3. INCLUSÃO: Utilize estratégias baseadas no Desenho Universal para a Aprendizagem (DUA).
4. BLOOM: Utilize verbos de ação adequados da Taxonomia de Bloom para os objetivos.
5. HABILIDADES: Utilize preferencialmente as habilidades do banco abaixo:

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
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    throw new Error("Configuração ausente: VITE_GEMINI_API_KEY não encontrada no ambiente de hospedagem.");
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  
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
    if (!text) {
      throw new Error("A Inteligência Artificial retornou uma resposta vazia. Tente detalhar mais sua ideia.");
    }
    
    return JSON.parse(text) as LessonPlan;
  } catch (error: any) {
    console.error("Erro detalhado na API Gemini:", error);
    if (error.message?.includes("API_KEY") || error.message?.includes("403") || error.message?.includes("401")) {
      throw new Error("Erro de autenticação: A chave da API é inválida, expirou ou não tem permissão para este modelo.");
    }
    throw new Error("Não foi possível gerar o plano agora. Verifique a variável VITE_GEMINI_API_KEY na Hostinger.");
  }
}
