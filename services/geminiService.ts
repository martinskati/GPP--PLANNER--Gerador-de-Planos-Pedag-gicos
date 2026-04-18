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
  // A plataforma AI Studio Build injeta automaticamente a GEMINI_API_KEY no ambiente.
  // Se você estiver rodando localmente ou em outro servidor, certifique-se de configurar
  // esta variável no arquivo .env ou nas configurações de deploy.
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "") {
    console.error("ERRO DE CONFIGURAÇÃO: GEMINI_API_KEY não detectada.");
    throw new Error(
      "ATENÇÃO PROFESSOR: A Chave da API (GEMINI_API_KEY) não foi detectada.\n\n" +
      "Para corrigir:\n" +
      "1. No AI Studio Build, vá em 'Settings' (ícone de engrenagem).\n" +
      "2. Adicione uma nova variável chamada GEMINI_API_KEY.\n" +
      "3. Cole sua chave obtida em https://aistudio.google.com/app/apikey\n" +
      "4. Reinicie a aplicação."
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
