
import { GoogleGenAI, Type } from "@google/genai";
import { LessonPlan } from "../types";

const AVAILABLE_SKILLS = `
BANCO DE HABILIDADES ESTRUTURANTES (SESI/BNCC) - PRIORIDADE DE USO:
1. SESI.EM13LGG204.c.16 - Utilizar as diversas linguagens para negociar interesses comuns pautados em princípios e em valores de equidade, com base em alicerces linguísticos e artísticos.
2. SESI.EM13LP08.s.6 - Analisar elementos e aspectos da sintaxe do português, como a ordem dos constituintes da sentença (e os efeitos que causam sua inversão), a estrutura dos sintagmas, as categorias sintáticas, os processos de coordenação e subordinação (e os efeitos de seus usos) e a sintaxe de concordância e de regência, de modo a potencializar os processos de compreensão e produção de textos e a possibilitar escolhas adequadas à situação comunicativa.
3. SESI.EM13LP01.c.17 - Produzir textos, orais ou escritos, verbais, não verbais ou híbridos, adequados a diferentes situações, analisando criticamente suas condições de produção, contexto social e histórico, de modo a ampliar as possibilidades de construção de sentidos, fazendo uso de paráfrases, de marcas do discurso reportado e de citações, a partir de diferentes fontes, levando em conta os diferentes contextos de produção, para uso em textos de divulgação de estudos e pesquisas.
4. SESI.EM13LP42.a.19 - Divulgar informações e dados necessários em diferentes fontes (orais, impressas, digitais, entre outras), levando em conta uma perspectiva de imparcialidade e de parcialidade, discutindo conteúdos de maneira ética e responsável.
5. SESI.EM13LP02.a.3 - Estabelecer relações entre as partes do texto, tanto na produção como na leitura/escuta, considerando a construção constitutiva e o estilo do gênero, usando/reconhecendo, adequadamente, elementos e recursos coesivos diversos, que contribuam para a coerência, para a continuidade do texto e, consequentemente, sua progressão temática.
6. SESI.EM13LP12.a.5 - Selecionar e fazer curadoria de informações, de dados e de argumentos em fontes confiáveis, impressas, digitais e midiáticos ou não e utilizá-los de modo referenciado, para que o texto a ser produzido tenha um nível de aprofundamento adequado (para além do senso comum) e contemple a sustentação das posições defendidas, seja por meio de recursos gramaticais que operam com modalizadores discursivos estratégicos.
7. SESI.EM13LGG603.s.41 - Expressar-se e atuar em processos de criação autorais individuais e coletivos nas diferentes linguagens artísticas (artes visuais, audiovisual, dança, música e teatro) e nas intersecções entre elas, recorrendo a referências estéticas e culturais, conhecimentos de naturezas diversas.
8. SESI.EM13LGG305.d.21 - Mapear e criar, por meio de práticas de linguagem, tanto na língua materna quanto em Língua Estrangeiras Modernas (LEM), possibilidades de atuação social, política, artística e cultural para enfrentar desafios contemporâneos.
9. SESI.EM13LP17.c.23 - Elaborar roteiros, levando em conta uma linguagem híbrida, para a produção de apresentações e vídeos variados, para ampliar as possibilidades de produção de sentidos com base em diferentes meios de comunicação; além do engajamento em práticas autorais individuais e/ou coletivas.
10. SESI.EM13LP51.a.42 - Analisar obras significativas das artes visuais, da música, do teatro, da dança e das literaturas brasileiras e de outros países e povos, com olhar atento à diversidade de saberes, identidades e culturas, bem como os processos de disputa por legitimidade.
`;

const SYSTEM_INSTRUCTION = `Você é um Consultor Pedagógico Institucional de alto nível especializado no sistema educacional brasileiro (BNCC/SESI). Sua função é transformar a ideia bruta de um professor em um plano de aula técnico, estruturado e inspirador.

REGRAS DE OURO:
1. NOME DO PROFESSOR: Deve aparecer na assinatura final conforme informado.
2. ODS: Selecione de 1 a 3 Objetivos de Desenvolvimento Sustentável da ONU que possuam relação direta ou transversal com o conteúdo.
3. SOCIOEMOCIONAL: Identifique competências como Empatia, Pensamento Crítico, Autogestão ou Colaboração.
4. METODOLOGIA: Utilize termos da educação moderna (Sala de Aula Invertida, Gamificação, etc).
5. DESENVOLVIMENTO (O QUE): Descreva os conceitos e objetivos de conhecimento.
6. DESENVOLVIMENTO (COMO): Descreva o passo a passo da aula considerando a turma informada.
7. INCLUSÃO: Se mencionado TEA, TDAH ou outros, crie adaptações baseadas no DUA (Desenho Universal para Aprendizagem).

${AVAILABLE_SKILLS}`;

const lessonPlanSchema = {
  type: Type.OBJECT,
  properties: {
    discipline: { type: Type.STRING },
    content: { type: Type.STRING },
    teacherName: { type: Type.STRING },
    ods: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Lista de ODS (Ex: ODS 4 - Educação de Qualidade)"
    },
    socioemotionalSkills: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Competências socioemocionais (Ex: Empatia, Colaboração)"
    },
    learningObjectives: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Objetivos baseados na Taxonomia de Bloom e no verbo informado."
    },
    skills: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Habilidades do banco SESI/BNCC fornecido."
    },
    methodology: { type: Type.STRING },
    inclusionStrategies: { type: Type.STRING },
    development: {
      type: Type.OBJECT,
      properties: {
        what: { type: Type.STRING, description: "O que será feito na aula." },
        how: { type: Type.STRING, description: "Como será feito a aula." }
      },
      required: ["what", "how"]
    },
    learningEvidence: { type: Type.STRING },
    assessmentInstruments: { type: Type.STRING }
  },
  required: [
    "discipline", 
    "content", 
    "teacherName", 
    "ods", 
    "socioemotionalSkills", 
    "learningObjectives", 
    "skills", 
    "methodology", 
    "inclusionStrategies", 
    "development", 
    "learningEvidence", 
    "assessmentInstruments"
  ]
};

export async function generateLessonPlan(teacherText: string): Promise<LessonPlan> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
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
    if (!text) throw new Error("A resposta do modelo está vazia.");
    
    return JSON.parse(text) as LessonPlan;
  } catch (error) {
    console.error("Erro ao gerar plano:", error);
    throw new Error("Erro na sistematização pedagógica. Verifique se os dados obrigatórios foram preenchidos corretamente.");
  }
}
