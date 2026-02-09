
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

const SYSTEM_INSTRUCTION = `Você é um Consultor Pedagógico Institucional. Sua função é criar planos de aula seguindo ESTRITAMENTE o modelo de escrita técnica, densa e narrativa do exemplo abaixo.

${AVAILABLE_SKILLS}

INSTRUÇÃO PARA HABILIDADES:
Consulte o BANCO DE HABILIDADES acima. Se o tema da aula for compatível (Linguagens/Português/Artes), SELECIONE internamente de 1 a 3 habilidades dessa lista que melhor se adequem.

MODELO DE OURO (Siga este estilo de escrita e profundidade):
---
Metodologia: Aula Expositiva Dialogada + Leitura de imagens + Análise discursiva orientada
Adaptações Inclusivas: Para estudantes com TDAH, a leitura de imagens será fracionada em detalhes menores com roteiro guiado para foco atencional. Para estudantes com baixa visão, serão disponibilizadas as obras em pranchas táteis ou audiodescrição detalhada. O uso de organizadores visuais durante a aula expositiva beneficiará a turma como um todo (DUA).
O que será feito na aula: Os estudantes terão uma introdução ao capítulo por meio de entender o conceito de mundo do trabalho e das relações de poder, analisando a arte como registro social. Serão apresentadas manifestações do Realismo, suas reverberações no Brasil, as representações do trabalho nas artes visuais (Portinari e Tarsila do Amaral), no cinema (sétima arte) e a construção discursiva da figura do Jeca Tatu como anti-herói rural.
Como será feita a aula: A aula começa com uma exposição dialogada sobre o conceito de mundo do trabalho e suas relações de poder, ativando conhecimentos prévios dos estudantes. Em seguida, a professora apresenta o Realismo como movimento que busca representar a realidade social, relacionando-o às produções artísticas brasileiras. A partir da leitura de imagens de obras de Portinari e Tarsila do Amaral, os estudantes são conduzidos a analisar como o trabalho é representado visualmente e quais discursos sociais emergem dessas obras. Na sequência, discute-se a representação do trabalho na sétima arte, destacando o cinema como linguagem que constrói narrativas sobre o trabalhador. Por fim, é apresentada a figura de Jeca Tatu, analisando-o como construção discursiva e símbolo do trabalhador rural marginalizado, articulando linguagem, estereótipo e poder.
Evidências de aprendizagem: O estudante compreende o conceito de mundo do trabalho e as relações de poder que o atravessam, identifica a arte como forma de registro social e reconhece diferentes representações discursivas do trabalhador nas artes visuais, no cinema e na literatura, estabelecendo relações entre linguagem, contexto histórico e ideologia.
Instrumentos de avaliação: Participação nas discussões orais, leitura e interpretação orientada de imagens artísticas, registros no caderno (anotações conceituais e respostas às perguntas mediadoras).
---

DIRETRIZES DE GERAÇÃO:
1.  **Metodologia**: Use termos técnicos concisos.
2.  **Skills (Habilidades)**: OBRIGATÓRIO preencher o array para o banco de dados. Identifique o verbo principal da habilidade (ex: "Analisar", "Criar", "Utilizar").
3.  **Inclusão e Acessibilidade**:
    - Analise se o professor mencionou especificidades como: **TDAH, TEA, Autismo, Deficiência Intelectual, Mudez/Surdez, Deficiência Motora**, entre outras.
    - Se mencionado, **GERE ADAPTAÇÕES ESPECÍFICAS** para o conteúdo da aula, citando a especificidade.
    - Se NÃO mencionado, gere estratégias de **Desenho Universal para Aprendizagem (DUA)** aplicáveis a qualquer aluno (ex: múltiplas formas de apresentação).
4.  **O que será feito**: Texto corrido, parágrafo ÚNICO (aprox. 6 linhas). Foco no OBJETO DE CONHECIMENTO e CONCEITOS.
5.  **Como será feito**: Texto corrido, parágrafo ÚNICO (aprox. 6-8 linhas). Foco na SEQUÊNCIA DIDÁTICA e AÇÕES.
6.  **Evidências**: Texto corrido, parágrafo ÚNICO.
7.  **Instrumentos**: Lista discursiva em linha.

TAXONOMIA DE BLOOM (CRUCIAL):
O nível cognitivo da aula é determinado pela Habilidade selecionada.
Se a habilidade diz "ANALISAR", os Objetivos de Aprendizagem devem conter verbos como: Analisar, Comparar, Diferenciar, Decompor.
Se a habilidade diz "CRIAR" ou "ELABORAR", os objetivos devem chegar a: Planejar, Construir, Desenvolver, Produzir.
GARANTA que os objetivos reflitam a complexidade exigida pelo verbo da habilidade escolhida.`;

const lessonPlanSchema = {
  type: Type.OBJECT,
  properties: {
    discipline: { type: Type.STRING },
    content: { type: Type.STRING },
    context: { type: Type.STRING },
    learningObjectives: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de objetivos com verbos de Bloom alinhados ao verbo da Habilidade selecionada."
    },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de Habilidades BNCC/SESI selecionadas (Código + Descrição) para armazenamento interno."
    },
    methodology: { type: Type.STRING },
    inclusionStrategies: {
      type: Type.STRING,
      description: "Parágrafo único com propostas de atividades inclusivas e adaptações (TEA, TDAH, Deficiência Intelectual, Motora, Mudez, DUA)."
    },
    development: {
      type: Type.OBJECT,
      properties: {
        what: { type: Type.STRING, description: "Parágrafo único, técnico, descrevendo OS CONTEÚDOS e CONCEITOS abordados." },
        how: { type: Type.STRING, description: "Parágrafo único, narrativo, descrevendo O PASSO A PASSO da aula." }
      },
      required: ["what", "how"]
    },
    learningEvidence: {
      type: Type.STRING,
      description: "Parágrafo único descrevendo o que o aluno deve compreender/demonstrar."
    },
    assessmentInstruments: {
      type: Type.STRING,
      description: "Lista descritiva dos instrumentos de avaliação."
    }
  },
  required: ["discipline", "content", "learningObjectives", "skills", "methodology", "inclusionStrategies", "development", "learningEvidence", "assessmentInstruments"]
};

export async function generateLessonPlan(teacherText: string): Promise<LessonPlan> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Professor solicitou: "${teacherText}".
      Gere um plano de aula seguindo RIGOROSAMENTE o estilo narrativo e técnico. 
      ATENÇÃO À INCLUSÃO: Verifique se há menção a TDAH, TEA, Deficiências, etc., e inclua adaptações na seção específica.
      Selecione a habilidade adequada para o banco de dados, mas use o VERBO dessa habilidade para definir o nível dos Objetivos de Aprendizagem (Bloom).`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: lessonPlanSchema,
        temperature: 0.5,
      },
    });

    return JSON.parse(response.text || "{}") as LessonPlan;
  } catch (error) {
    console.error("Erro ao gerar plano:", error);
    throw new Error("Não foi possível processar a proposta pedagógica. Tente detalhar um pouco mais o tema.");
  }
}
