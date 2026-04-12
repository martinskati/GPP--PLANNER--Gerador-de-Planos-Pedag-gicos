import { GoogleGenAI, Type } from "@google/genai";
import { LessonPlan } from "../types";

const SYSTEM_INSTRUCTION = `Você é um Consultor Pedagógico de elite especializado na Taxonomia de Bloom e no padrão SESI de educação.
Sua tarefa é gerar até 3 planos de aula independentes e completos a partir de um único comando.

DIRETRIZES RÍGIDAS:
1. TAXONOMIA DE BLOOM: Todo o plano deve seguir a progressão pedagógica de Bloom.
   - Objetivos: Use verbos de ação claros (ex: Identificar, Explicar, Aplicar, Analisar, Justificar, Criar).
   - Metodologia: Divida em etapas correspondentes aos níveis cognitivos (Lembrar, Compreender, Aplicar, Analisar, Avaliar, Criar).
   - Avaliação: Deve focar nos níveis superiores (Analisar, Avaliar ou Criar).
2. GERAÇÃO MÚLTIPLA: Gere até 3 planos distintos (Plano 1, Plano 2, Plano 3). Se o usuário pedir algo genérico, crie 3 abordagens diferentes para o mesmo tema.
3. VARIAÇÃO: Evite repetir estruturas entre os planos. Use metodologias ativas variadas (PBL, Sala Invertida, Rotação por Estações, Gamificação, Estudo de Caso, etc.).
4. QUALIDADE: Cada plano deve ser profundo, técnico e imediatamente aplicável. Evite descrições superficiais como "discussão em grupo" sem objetivo cognitivo.
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
          objectives: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Verbos da Taxonomia de Bloom." },
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
          resources: { type: Type.ARRAY, items: { type: Type.STRING } },
          assessment: { type: Type.STRING },
          ods: { type: Type.ARRAY, items: { type: Type.STRING } },
          socioemotionalSkills: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["theme", "discipline", "objectives", "contents", "methodology", "resources", "assessment"]
      }
    }
  },
  required: ["plans"]
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateLessonPlan(teacherText: string, recentMethodologies: string[] = []): Promise<LessonPlan[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY não detectada.");

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
