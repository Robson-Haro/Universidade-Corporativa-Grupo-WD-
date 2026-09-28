export const TRAINING_BASE_URL =
  process.env.NEXT_PUBLIC_TRAINING_BASE_URL || "https://treinamento-wd-1.vercel.app";

export type UniversityModule = {
  id: "modulo-1" | "modulo-2";
  number: 1 | 2;
  title: string;
  subtitle: string;
  description: string;
  trainingPath: string;
  topics: string[];
};

export type AssessmentQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
};

export const leadershipModules: UniversityModule[] = [
  {
    id: "modulo-1",
    number: 1,
    title: "Se conhecendo para liderar",
    subtitle: "Autoconhecimento, decisões e comportamento",
    description:
      "Uma jornada sobre atenção, exemplo, autoconhecimento, estilos de liderança, DISC, decisões difíceis e leitura de cenário.",
    trainingPath: "/modulo-1/video",
    topics: [
      "Atenção e foco",
      "Liderança pelo exemplo",
      "Estilos de liderança",
      "DISC e autoconhecimento",
      "Decisões éticas e difíceis",
      "Estratégia e organização",
    ],
  },
  {
    id: "modulo-2",
    number: 2,
    title: "Comunicação e Excelência",
    subtitle: "Clareza, influência e padrão operacional",
    description:
      "Comunicação eficaz, leitura de sentimentos, liderança situacional, segurança psicológica e excelência operacional.",
    trainingPath: "/modulo-2",
    topics: [
      "Etapas da comunicação",
      "Escuta e influência",
      "Liderança Situacional",
      "Segurança Psicológica",
      "Leitura de sentimentos",
      "Excelência operacional",
    ],
  },
];

export const assessments: Record<"1" | "2", AssessmentQuestion[]> = {
  "1": [
    {
      id: "m1q1",
      prompt: "Qual comportamento melhor representa liderança pelo exemplo?",
      options: [
        "Cobrar padrões que o líder não precisa seguir",
        "Demonstrar na prática o comportamento e o padrão que espera da equipe",
        "Evitar decisões difíceis para preservar o clima",
        "Delegar toda responsabilidade sobre resultados",
      ],
      correct: 1,
      explanation:
        "O exemplo do líder transforma o padrão esperado em comportamento observável.",
    },
    {
      id: "m1q2",
      prompt: "No DISC, a letra D representa principalmente:",
      options: ["Dominância", "Disciplina", "Desenvolvimento", "Delegação"],
      correct: 0,
      explanation:
        "D corresponde a Dominância; I a Influência; S a Estabilidade; C a Conformidade.",
    },
    {
      id: "m1q3",
      prompt: "Diante de uma decisão difícil, o líder deve:",
      options: [
        "Buscar agradar a todos antes de decidir",
        "Evitar o desconforto e adiar a escolha",
        "Ouvir, explicar critérios e assumir a responsabilidade pela decisão",
        "Transferir a decisão para a equipe em qualquer situação",
      ],
      correct: 2,
      explanation:
        "Liderar inclui decidir com responsabilidade, transparência e respeito, mesmo quando a escolha não agrada a todos.",
    },
    {
      id: "m1q4",
      prompt: "Qual prática ajuda a melhorar atenção e foco?",
      options: [
        "Tratar todas as demandas como igualmente urgentes",
        "Definir prioridade, reduzir distrações e observar sinais relevantes",
        "Executar várias tarefas simultaneamente sem critério",
        "Evitar pausas de reflexão",
      ],
      correct: 1,
      explanation:
        "Foco exige seleção consciente do que merece atenção e redução de ruído.",
    },
    {
      id: "m1q5",
      prompt: "Autoconhecimento é útil para a liderança porque ajuda a:",
      options: [
        "Eliminar completamente pontos fracos",
        "Reconhecer padrões próprios e ajustar o comportamento ao contexto",
        "Usar um único estilo de liderança em qualquer cenário",
        "Evitar feedback da equipe",
      ],
      correct: 1,
      explanation:
        "Autoconhecimento amplia escolha comportamental e reduz respostas automáticas.",
    },
    {
      id: "m1q6",
      prompt: "Em uma leitura de cenário, o líder precisa observar:",
      options: [
        "Somente o resultado final",
        "Pessoas, riscos, contexto, prioridades e consequências",
        "Apenas a opinião da pessoa mais experiente",
        "Somente o que já aconteceu no passado",
      ],
      correct: 1,
      explanation:
        "Boa decisão exige uma visão ampla do sistema e das consequências.",
    },
    {
      id: "m1q7",
      prompt: "Qual frase está mais alinhada à responsabilidade do líder?",
      options: [
        "Meu papel é evitar qualquer conflito",
        "Meu papel é tomar decisões com critérios claros e acompanhar seus efeitos",
        "Meu papel é agradar a equipe para manter engajamento",
        "Meu papel é decidir sozinho sempre",
      ],
      correct: 1,
      explanation:
        "Responsabilidade envolve critérios, decisão, comunicação e acompanhamento.",
    },
    {
      id: "m1q8",
      prompt: "Uma força comportamental pode virar excesso quando:",
      options: [
        "É usada com consciência e adaptada ao contexto",
        "É repetida automaticamente mesmo quando a situação pede outra resposta",
        "Recebe feedback",
        "É combinada com outras competências",
      ],
      correct: 1,
      explanation:
        "Toda força precisa de calibragem; em excesso, pode produzir efeitos opostos ao desejado.",
    },
  ],
  "2": [
    {
      id: "m2q1",
      prompt: "Comunicar bem significa:",
      options: [
        "Apenas transmitir a informação",
        "Falar mais alto para garantir atenção",
        "Garantir que a mensagem foi compreendida e que responsabilidades ficaram claras",
        "Usar sempre o mesmo canal",
      ],
      correct: 2,
      explanation:
        "A comunicação só se completa quando existe entendimento compartilhado.",
    },
    {
      id: "m2q2",
      prompt: "Qual pergunta verifica entendimento de forma mais eficaz?",
      options: [
        "Entendeu?",
        "Você concorda comigo?",
        "Me conta como você entendeu o que combinamos",
        "Posso considerar resolvido?",
      ],
      correct: 2,
      explanation:
        "Pedir que a pessoa explique com as próprias palavras reduz falsa concordância.",
    },
    {
      id: "m2q3",
      prompt:
        "Na Liderança Situacional, um profissional com pouca experiência tende a precisar de:",
      options: [
        "Mais orientação e clareza",
        "Delegação total e pouca comunicação",
        "Somente reconhecimento público",
        "Nenhuma definição de expectativa",
      ],
      correct: 0,
      explanation:
        "Quanto menor o domínio da tarefa, maior a necessidade de direção clara.",
    },
    {
      id: "m2q4",
      prompt: "Segurança psicológica significa que a equipe:",
      options: [
        "Nunca é cobrada",
        "Pode falar, perguntar, admitir dúvidas e erros sem medo de humilhação",
        "Evita discordar da liderança",
        "Recebe apenas feedback positivo",
      ],
      correct: 1,
      explanation:
        "Segurança psicológica permite participação franca sem retirar responsabilidade por desempenho.",
    },
    {
      id: "m2q5",
      prompt: "Uma expectativa bem comunicada deve deixar claro:",
      options: [
        "Somente o prazo",
        "Somente o responsável",
        "O que, por que, resultado esperado, prazo e responsáveis",
        "Apenas o que deu errado antes",
      ],
      correct: 2,
      explanation:
        "Clareza reduz interpretação e aumenta a chance de execução correta.",
    },
    {
      id: "m2q6",
      prompt:
        "Em excelência operacional, resultados sustentáveis são consequência de:",
      options: [
        "Comportamentos consistentes que fortalecem processos",
        "Esforços isolados de última hora",
        "Perfeccionismo em todos os detalhes",
        "Aumento permanente de cobrança",
      ],
      correct: 0,
      explanation:
        "Comportamentos moldam processos, e processos consistentes sustentam resultados.",
    },
    {
      id: "m2q7",
      prompt: "Normalização do desvio ocorre quando:",
      options: [
        "Um padrão é melhorado formalmente",
        "Pequenas exceções passam a ser aceitas como normais",
        "A equipe reporta um risco imediatamente",
        "Um processo é documentado",
      ],
      correct: 1,
      explanation:
        "Quando desvios deixam de gerar alerta, o risco cresce silenciosamente.",
    },
    {
      id: "m2q8",
      prompt: "Qualidade na origem significa:",
      options: [
        "Inspecionar tudo apenas no final",
        "Detectar, entender e corrigir o problema o mais cedo possível",
        "Aceitar retrabalho como parte normal da operação",
        "Transferir a falha para outra área",
      ],
      correct: 1,
      explanation:
        "Quanto mais cedo a anomalia é tratada, menor o custo e a propagação do erro.",
    },
    {
      id: "m2q9",
      prompt: "Uma reunião eficaz começa com:",
      options: [
        "Uma pauta aberta sem objetivo",
        "Um objetivo claro e o resultado esperado da conversa",
        "Uma apresentação longa",
        "Uma lista de problemas sem responsáveis",
      ],
      correct: 1,
      explanation:
        "Objetivo e resultado esperado orientam tempo, participação e decisão.",
    },
    {
      id: "m2q10",
      prompt: "Reconhecer publicamente e corrigir em particular ajuda a:",
      options: [
        "Evitar qualquer cobrança",
        "Preservar dignidade, reforçar bons comportamentos e manter responsabilidade",
        "Substituir feedback específico",
        "Reduzir a autonomia da equipe",
      ],
      correct: 1,
      explanation:
        "A forma do feedback influencia confiança, aprendizagem e qualidade da relação.",
    },
  ],
};

export const futureTracks = [
  {
    id: "integracao",
    number: "02",
    title: "Integração Grupo WD",
    description: "Cultura, propósito, valores, padrões e nossa forma de trabalhar.",
  },
  {
    id: "atendimento",
    number: "03",
    title: "Atendimento & Portaria",
    description: "Experiência do cliente, postura profissional, acesso e comunicação.",
  },
  {
    id: "facilities",
    number: "04",
    title: "Facilities & Qualidade",
    description: "Rotina, padrão, produtividade, segurança e qualidade na execução.",
  },
  {
    id: "seguranca",
    number: "05",
    title: "Segurança & Ronda",
    description: "Prevenção, atenção, disciplina operacional e registro de ocorrências.",
  },
  {
    id: "desenvolvimento",
    number: "06",
    title: "Desenvolvimento Contínuo",
    description: "Trilhas para evolução profissional e construção de novas competências.",
  },
];
