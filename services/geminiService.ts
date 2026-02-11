
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

const SYSTEM_INSTRUCTION = `Você é um Consultor Pedagógico Institucional de alto nível com MEMÓRIA ATIVA de produções anteriores.
Sua tarefa é ORGANIZAR, SISTEMATIZAR e QUALIFICAR a ideia do professor em um plano técnico BNCC.

DIRETRIZ DE ORIGINALIDADE:
- Analise a seção 'METODOLOGIAS_RECENTES' fornecida no prompt.
- VOCÊ NÃO DEVE REPETIR as mesmas abordagens ou estratégias didáticas listadas lá.
- Se o histórico mostrar muitas aulas teóricas, proponha algo prático (mão na massa).
- Busque diversificar entre: Aprendizagem Baseada em Problemas (PBL), Sala de Aula Invertida, Gamificação, Design Thinking, Cultura Maker, etc.

REGRAS OBRIGATÓRIAS:
1. ODS: Escolha de 1 a 3 Objetivos relacionados.
2. SOCIOEMOCIONAL: Identifique competências claras.
3. INCLUSÃO: Utilize estratégias baseadas em DUA.
4. BLOOM: Utilize verbos de ação adequados nos objetivos.
5. HABILIDADES: Utilize preferencialmente as do banco fornecido.
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

export async function generateLessonPlan(teacherText: string, recentMethodologies: string[] = []): Promise<LessonPlan> {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("Configuração ausente: API_KEY não detectada.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Constrói o histórico para o modelo evitar repetições
  const historyContext = recentMethodologies.length > 0 
    ? `METODOLOGIAS_RECENTES (EVITE REPETIR ESTAS ESTRATÉGIAS):\n${recentMethodologies.join('\n- ')}`
    : "METODOLOGIAS_RECENTES: Nenhuma produção anterior registrada. Sinta-se livre para inovar.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { text: historyContext },
        { text: `Banco de Habilidades Disponíveis: ${AVAILABLE_SKILLS}` },
        { text: `Ideia do Professor para Sistematização: ${teacherText}` }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: lessonPlanSchema,
        temperature: 0.7, // Aumentado levemente para maior criatividade
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("A Inteligência Artificial não retornou dados.");
    }
    
    return JSON.parse(text) as LessonPlan;
  } catch (error: any) {
    if (error.message?.includes("429")) {
      throw new Error("Limite de uso atingido. Aguarde 60 segundos.");
    }
    throw new Error("Erro na geração do plano. Tente novamente.");
  }
}
