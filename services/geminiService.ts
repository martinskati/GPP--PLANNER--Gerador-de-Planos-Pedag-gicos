import { GoogleGenAI, Type } from "@google/genai";
import { LessonPlan } from "../types";

const SYSTEM_INSTRUCTION = `Você é um Consultor Pedagógico de elite especializado na Taxonomia de Bloom e no padrão SESI de educação.
Sua tarefa é gerar até 3 planos de aula independentes e completos a partir de um único comando.

DIRETRIZES RÍGIDAS:
1. TAXONOMIA DE BLOOM: Todo o plano deve seguir a progressão pedagógica de Bloom.
   - Objetivos: Use verbos de ação claros (ex: Identificar, Explicar, Aplicar, Analisar, Justificar, Criar).
   - Metodologia: Divida em etapas correspondentes aos níveis cognitivos (Lembrar, Compreender, Aplicar, Analisar, Avaliar, Criar).
   - Avaliação: Deve focar nos níveis superiores (Analisar, Avaliar ou Criar).
2. ESTRUTURA OBRIGATÓRIA: Cada plano DEVE conter:
   - Metodologia Sugerida: Identifique explicitamente qual metodologia ativa melhor se enquadra (ex: PBL, Sala Invertida, Gamificação, Rotação por Estações, Estudo de Caso, etc.).
   - ODS (Objetivos de Desenvolvimento Sustentável relacionados).
   - DUA (Desenho Universal para Aprendizagem): Estratégias de acessibilidade e inclusão.
   - Objeto do Conhecimento (Conteúdo central segundo a BNCC).
   - O que será feito em aula (Resumo das atividades).
   - Como será feito a aula (Passo a passo metodológico).
   - Evidências de Aprendizagem (O que o aluno deve demonstrar ter aprendido).
   - Instrumentos de Avaliação (Como será verificado o aprendizado).
   - Dicas de propostas de atividades (Sugestões práticas e aplicáveis para o professor).
3. GERAÇÃO MÚLTIPLA: Gere até 3 planos distintos (Plano 1, Plano 2, Plano 3).
4. VARIAÇÃO: Evite repetir estruturas entre os planos. Use metodologias ativas variadas.
5. QUALIDADE: Cada plano deve ser profundo, técnico e imediatamente aplicável.
`;

const lessonPlanSchema = {
  type: Type.OBJECT,
  properties: {
    plans: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          theme: { type: Type.STRING },
          discipline: { type: Type.STRING },
          suggestedMethodology: { type: Type.STRING, description: "Nome da metodologia ativa sugerida (ex: Aprendizagem Baseada em Problemas)." },
          objectives: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Verbos da Taxonomia de Bloom." },
          knowledgeObject: { type: Type.STRING, description: "Objeto do conhecimento segundo a BNCC." },
          contents: { type: Type.STRING },
          methodology: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.STRING, enum: ['Lembrar', 'Compreender', 'Aplicar', 'Analisar', 'Avaliar', 'Criar'] },
                activity: { type: Type.STRING },
                cognitiveObjective: { type: Type.STRING }
              },
              required: ["level", "activity", "cognitiveObjective"]
            }
          },
          whatWillBeDone: { type: Type.STRING, description: "O que será feito em aula." },
          howItWillBeDone: { type: Type.STRING, description: "Como será feito a aula." },
          inclusionProposal: { type: Type.STRING, description: "Proposta de inclusão para diversidade." },
          dua: { type: Type.STRING, description: "Desenho Universal para Aprendizagem (DUA)." },
          resources: { type: Type.ARRAY, items: { type: Type.STRING } },
          learningEvidence: { type: Type.STRING, description: "Evidências de aprendizagem esperadas." },
          assessment: { type: Type.STRING, description: "Resumo da avaliação." },
          assessmentInstruments: { type: Type.STRING, description: "Instrumentos de avaliação específicos." },
          activityTips: { type: Type.STRING, description: "Dicas de propostas de atividades práticas." },
          ods: { type: Type.ARRAY, items: { type: Type.STRING }, description: "ODS relacionadas." },
          socioemotionalSkills: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: [
          "theme", "discipline", "suggestedMethodology", "objectives", "knowledgeObject", "contents", 
          "methodology", "whatWillBeDone", "howItWillBeDone", "inclusionProposal", "dua",
          "resources", "learningEvidence", "assessmentInstruments", "activityTips"
        ]
      }
    }
  },
  required: ["plans"]
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateLessonPlan(teacherText: string, recentMethodologies: string[] = []): Promise<LessonPlan[]> {
  // Verificamos primeiro GEMINI_API_KEY (padrão) e depois API_KEY (fallback)
  // No Vite, process.env é injetado via vite.config.ts
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  
  if (!apiKey || apiKey === "") {
    console.error("ERRO DE CONFIGURAÇÃO: Chave da API não detectada.");
    throw new Error(
      "PROFESSOR, CONFIGURAÇÃO PENDENTE:\n" +
      "A chave de acesso à Inteligência Artificial (GEMINI_API_KEY) não foi encontrada.\n\n" +
      "COMO RESOLVER:\n" +
      "1. Clique no ícone de 'Settings' (engrenagem) nesta página.\n" +
      "2. Clique em 'Add variable' e no nome coloque: GEMINI_API_KEY\n" +
      "3. No valor, cole sua chave do site: https://aistudio.google.com/app/apikey\n" +
      "4. Após salvar, aguarde o reinício automático do aplicativo."
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const historyContext = recentMethodologies.length > 0 
    ? `METODOLOGIAS_RECENTES (NÃO REPETIR): ${recentMethodologies.join(', ')}`
    : "";

  const maxRetries = 3;
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { parts: [{ text: historyContext }] },
          { parts: [{ text: `Comando do Professor: ${teacherText}. Gere até 3 planos de aula completos e distintos seguindo a Taxonomia de Bloom.` }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: lessonPlanSchema,
          temperature: 0.7,
        }
      });

      const text = response.text;
      if (!text) throw new Error("Falha na geração.");
      
      const result = JSON.parse(text);
      return result.plans as LessonPlan[];
    } catch (error: any) {
      lastError = error;
      
      // Se for erro de cota (429), espera e tenta novamente
      if (error.message?.includes("429") || error.status === 429) {
        const delay = Math.pow(2, i) * 2000; // 2s, 4s, 8s
        console.warn(`Limite de cota atingido. Tentando novamente em ${delay}ms...`);
        await sleep(delay);
        continue;
      }
      
      throw error;
    }
  }

  throw new Error(`Após ${maxRetries} tentativas, o erro persistiu: ${lastError.message}`);
}
