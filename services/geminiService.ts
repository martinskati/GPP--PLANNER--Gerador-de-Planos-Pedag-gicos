
import { GoogleGenAI, Type } from "@google/genai";
import { LessonPlan } from "../types";

const AVAILABLE_SKILLS = `
BANCO DE HABILIDADES ESTRUTURANTES (BNCC):
1. EM13LGG204.c.16 - Negociar interesses comuns.
2. EM13LP08.s.6 - Sintaxe do português.
3. EM13LP01.c.17 - Produção de textos multimodais.
4. EM13LP42.a.19 - Curadoria ética de informação.
5. EM13LP02.a.3 - Coesão e coerência textual.
6. EM13LP12.a.5 - Argumentação e fontes confiáveis.
7. EM13LGG603.s.41 - Processos de criação artística.
8. EM13LGG305.d.21 - Atuação social e política via linguagens.
9. EM13LP17.c.23 - Roteirização de vídeos e mídias.
10. EM13LP51.a.42 - Análise de obras artísticas e culturais.
`;

const SYSTEM_INSTRUCTION = `Você é um Consultor Pedagógico Institucional de alto nível. 
Sua tarefa é ORGANIZAR, SISTEMATIZAR e QUALIFICAR a ideia do professor, transformando-a em um plano de aula técnico e estruturado seguindo o padrão BNCC.

REGRAS OBRIGATÓRIAS:
1. ODS: Escolha e liste de 1 a 3 Objetivos de Desenvolvimento Sustentável relacionados.
2. SOCIOEMOCIONAL: Identifique competências socioemocionais claras que serão desenvolvidas.
3. INCLUSÃO: Utilize estratégias baseadas no Desenho Universal para a Aprendizagem (DUA).
4. BLOOM: Utilize verbos de ação adequados da Taxonomia de Bloom para os objetivos.
5. HABILIDADES: Utilize preferencialmente as habilidades do banco fornecido.
`;

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
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("Configuração ausente: API_KEY não detectada nas variáveis de ambiente do site.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      // Mudança para o modelo Flash que tem limites de cota muito maiores
      model: "gemini-3-flash-preview",
      contents: [
        { text: `Banco de Habilidades Disponíveis: ${AVAILABLE_SKILLS}` },
        { text: `Ideia do Professor para Sistematização: ${teacherText}` }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: lessonPlanSchema,
        temperature: 0.5,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("A Inteligência Artificial não conseguiu processar os dados.");
    }
    
    return JSON.parse(text) as LessonPlan;
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);
    
    // Tratamento específico para erro de cota (429)
    if (error.message?.includes("429") || error.message?.includes("QUOTA_EXHAUSTED")) {
      throw new Error("Limite de uso atingido. O Google permite um número limitado de planos gratuitos por minuto/dia. Por favor, aguarde cerca de 60 segundos e tente novamente.");
    }
    
    if (error.message?.includes("API_KEY") || error.status === 403) {
      throw new Error("Chave de API inválida ou sem permissão para este modelo.");
    }
    
    throw new Error("Ocorreu uma instabilidade na conexão com o assistente. Por favor, tente novamente em instantes.");
  }
}
