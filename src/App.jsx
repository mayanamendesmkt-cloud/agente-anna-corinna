import { useState } from "react";

const SYSTEM_PROMPT = `
Você é o agente exclusivo de conteúdo da Anna Corinna, Chef Pâtissière com mais de 20 anos de experiência, formada em Gastronomia com especialização em Confeitaria e Chocolateria. Professora, consultora, palestrante e apresentadora de programas gastronômicos.

━━━ IDENTIDADE DA MARCA ━━━
• Nome: Anna Corinna — "Douce et chocolat"
• Fundadora da Assúcar (1ª Associação da Confeitaria Pernambucana)
• +10.000 alunas certificadas | +223 mil seguidores no Instagram | +38 mil no YouTube
• Espaço Anna Corinna: coworking gastronômico em Recife
• Parceria Sebrae-PE no Espaço Confeitar (HFN)
• Projetos sociais de inclusão pelo ensino da culinária (Projeto Minhoto)

━━━ PÚBLICO ━━━
• 90,9% feminino, 25–54 anos
• Confeiteiras em formação, profissionais do setor, empreendedoras gastronômicas
• Anna fala DIRETAMENTE com a aluna/seguidora — segunda pessoa do singular, íntima mas com autoridade

━━━ TOM DE VOZ ━━━
• Sofisticado e acessível ao mesmo tempo
• Afetivo, inspirador, com autoridade técnica
• Usa o francês sutilmente: douce, chocolat, pâtisserie, mon amour, voilà...
• Trata as seguidoras como "pimentinhas" — bordão afetivo e exclusivo da marca
• Nunca genérico, nunca raso, nunca "guru de marketing digital"

━━━ PALAVRAS PROIBIDAS ━━━
JAMAIS use: incrível, incrível demais, arrasa, arrasou, conteúdo de valor, empoderar, empoderamento, sensacional (genérico), uau, top demais.

━━━ GATILHOS QUE FUNCIONAM ━━━
• Autoridade: "20 anos de cozinha me ensinaram que...", "já formei mais de 10 mil alunas..."
• Pertencimento: "você faz parte de uma comunidade que...", "as pimentinhas sabem que..."

━━━ HOOKS QUE CONVERTEM ━━━
• Pergunta provocativa | Dado ou curiosidade técnica | Afirmação polêmica | Cena visual impactante

━━━ CTA PRINCIPAL ━━━
• Sempre direcionar para: link na bio / curso / espaço Anna Corinna — nunca CTA vago

━━━ PILARES ━━━
1. Educação técnica  2. Autoridade e trajetória  3. Empreendedorismo feminino  4. Bastidores  5. Vendas

━━━ FORMATOS PRINCIPAIS ━━━
Reels curtos (até 30s) · Reels longos (60s+) · Stories sequenciais

━━━ CALENDÁRIO ━━━
4 semanas fixas · datas comemorativas · 40% educação / 30% autoridade+bastidor / 30% vendas
`;

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
const HOOKS_BANK = {
  "Educação Técnica": [
    "Você sabia que {X}% das confeiteiras erram nesse passo — e nem percebem?",
    "A temperatura que ninguém te conta na faculdade de gastronomia.",
    "Esse erro custa caro. E eu cometi por anos antes de entender.",
    "Chocolate fracionado não é chocolate. Vou te provar agora.",
    "Se você faz isso na sua ganache, para agora e me acompanha.",
    "3 segundos. É tudo que você tem para salvar essa calda.",
  ],
  "Autoridade": [
    "20 anos de confeitaria me ensinaram que técnica sem propósito é só receita.",
    "Quando fundei a Assúcar, me disseram que não ia funcionar.",
    "Já formei mais de 10 mil alunas. Essa é a pergunta que todas fizeram no começo.",
    "A primeira vez que entrei em uma cozinha profissional, não sabia que estava mudando minha vida.",
    "Esse movimento começou em Recife. Hoje ele está em todo o Brasil.",
  ],
  "Empreendedorismo": [
    "Você está precificando errado. E não é culpa sua — ninguém ensina isso.",
    "Sua confeitaria não precisa de mais seguidores. Precisa disso.",
    "A diferença entre a confeiteira que fatura e a que se esgota está aqui.",
    "Ninguém te contou que o maior obstáculo do seu negócio é esse.",
    "Clientela fiel não se conquista com promoção. Se conquista com isso.",
  ],
  "Bastidor": [
    "Por trás de cada aula, tem uma cozinha que ninguém vê.",
    "Hoje o chocolate não queria cooperar. E tudo bem.",
    "O que acontece antes das câmeras ligarem.",
    "Essa foi a aula mais difícil que já dei. Por isso preciso te contar.",
  ],
  "Vendas": [
    "As vagas para a próxima turma estão abertas. Mas não por muito tempo.",
    "Se você ainda não entrou, essa é a última vez que vou te convidar.",
    "O que as minhas alunas têm que você ainda não tem.",
    "Essa turma é diferente. E eu vou te explicar por que.",
  ],
};

const CHECKLIST_ITEMS = [
  { cat: "📝 Texto", items: ["A legenda tem hook nas primeiras 2 linhas?", "Tem quebras de linha para facilitar leitura?", "O CTA está claro e direciona para link na bio?", "Nenhuma palavra proibida foi usada?", "O tom está de acordo com o pilar do post?", "As hashtags são relevantes e variadas (não repetidas de todo post)?"] },
  { cat: "🎨 Visual", items: ["A imagem/vídeo tem qualidade técnica (foco, iluminação)?", "A identidade visual da Anna está presente?", "O texto na tela (se Reels) está legível e bem posicionado?", "A thumbnail do Reels é chamativa nos primeiros frames?"] },
  { cat: "⚙️ Técnico", items: ["O formato está correto para o tipo de post (proporção 9:16, 1:1)?", "A música/áudio está nos trending sounds ou é original?", "A legenda foi revisada para erros de digitação?", "Menções e tags foram conferidas?"] },
  { cat: "🎯 Estratégia", items: ["O post está alinhado com o pilar da semana?", "Há coerência com o post anterior e o próximo?", "O horário de publicação é o ideal para o perfil?", "Esse post contribui para o objetivo do mês?"] },
];

// ─── TOOLS CONFIG ─────────────────────────────────────────────────────────────
const tools = [
  {
    id: "briefing",
    icon: "📋",
    label: "Briefing",
    sublabel: "Mês + Lançamento",
    accent: "#6B3FA0",
    description: "Briefing mensal completo → pauta das 4 semanas com pilares, formatos e hooks prontos.",
    tabs: [
      {
        id: "mensal",
        label: "📅 Briefing Mensal",
        fields: [
          { name: "mes_ref", label: "Mês e ano", placeholder: "Ex: Agosto 2025" },
          { name: "foco_mes", label: "Foco estratégico do mês", placeholder: "Ex: Lançamento do curso, alta temporada, Dia das Mães, consolidar autoridade..." },
          { name: "produto_mes", label: "Produto ou serviço principal do mês", placeholder: "Ex: Curso de chocolateria, Espaço Anna Corinna, Consultoria..." },
          { name: "datas_mes", label: "Datas especiais ou eventos do mês", placeholder: "Ex: 12/08 Dia dos Pais, feira HFN, live programada... (deixe vazio se não houver)" },
          { name: "qtd_posts_mes", label: "Quantidade de posts no mês", type: "select", options: ["12 posts (3/semana)", "16 posts (4/semana)", "20 posts (5/semana)"] },
          { name: "tom_mes", label: "Clima estratégico do mês", type: "select", options: ["Lançamento e vendas", "Nutrição e educação", "Autoridade e posicionamento", "Relacionamento e bastidor", "Misto equilibrado"] },
        ],
        prompt: (f) => `Crie o briefing mensal completo para o Instagram da Anna Corinna.
Mês: ${f.mes_ref}
Foco estratégico: ${f.foco_mes}
Produto principal: ${f.produto_mes}
Datas especiais: ${f.datas_mes || "nenhuma além das comemorativas padrão"}
Quantidade de posts: ${f.qtd_posts_mes}
Clima do mês: ${f.tom_mes}

Entregue:
1. POSICIONAMENTO DO MÊS (4-5 linhas) — a narrativa central, o fio condutor emocional e estratégico que conecta todos os posts do mês

2. PAUTA POR SEMANA — organize em 4 semanas. Para cada post:
   • Semana e dia sugerido
   • Pilar (Educação / Autoridade / Empreendedorismo / Bastidor / Venda)
   • Formato (Reels curto / Reels longo / Stories / Feed / Carrossel)
   • Tema específico (não genérico — sempre com ângulo único da Anna)
   • Hook de abertura pronto para usar
   • CTA sugerido
   • Objetivo do post (alcance / engajamento / conversão / relacionamento)

3. DISTRIBUIÇÃO DO MÊS — confirmar que respeitou 40% educação · 30% autoridade+bastidor · 30% vendas

4. FRASE DO MÊS — uma frase assinatura no tom da Anna para usar em destaques, bio ou abertura de campanha

Incluir ao menos 1 post por semana com "pimentinhas". Nunca palavras proibidas.`
      },
      {
        id: "lancamento",
        label: "🚀 Briefing de Lançamento",
        fields: [
          { name: "nome_lancamento", label: "Nome do lançamento ou campanha", placeholder: "Ex: Turma de Julho — Curso de Chocolateria Profissional" },
          { name: "data_abertura", label: "Data de abertura das inscrições", placeholder: "Ex: 15 de julho" },
          { name: "data_encerramento", label: "Data de encerramento", placeholder: "Ex: 22 de julho" },
          { name: "preco_vagas", label: "Preço e número de vagas", placeholder: "Ex: R$497 — 30 vagas" },
          { name: "maior_transformacao_l", label: "Principal transformação prometida", placeholder: "Ex: Dominar temperagem e triplicar o ticket médio" },
        ],
        prompt: (f) => `Crie o briefing completo de lançamento para o Instagram da Anna Corinna.
Campanha: ${f.nome_lancamento}
Abertura: ${f.data_abertura} | Encerramento: ${f.data_encerramento}
Preço/vagas: ${f.preco_vagas}
Transformação principal: ${f.maior_transformacao_l}

Entregue:
1. NARRATIVA DO LANÇAMENTO — o fio condutor emocional da campanha (3-4 linhas)
2. JORNADA DE POSTS — organizada em 3 fases:
   FASE 1 — PRÉ-LANÇAMENTO (antecipação/aquecimento): posts de educação e autoridade
   FASE 2 — LANÇAMENTO (abertura das inscrições): posts de oferta e prova social
   FASE 3 — URGÊNCIA (últimos dias): posts de escassez e pertencimento
   Para cada post: dia, formato, tema, hook, CTA
3. FRASE DE ABERTURA DO LANÇAMENTO — para o primeiro post da campanha
4. FRASE DE ENCERRAMENTO — para o último post antes de fechar as vagas`
      },
    ]
  },
  {
    id: "stories",
    icon: "📱",
    label: "Stories",
    sublabel: "Sequência Completa",
    accent: "#B5420A",
    description: "Adapta qualquer conteúdo para stories sequenciais — com cada tela estruturada e CTA final.",
    tabs: [
      {
        id: "adaptacao",
        label: "🔄 Adaptar Conteúdo",
        fields: [
          { name: "conteudo_origem", label: "Cole aqui o conteúdo que quer adaptar (legenda, roteiro, pauta...)", placeholder: "Cole a legenda do post, o tema do Reels, ou descreva o conteúdo original..." },
          { name: "objetivo_stories", label: "Objetivo dos stories", type: "select", options: ["Engajar e gerar respostas", "Educar e entregar valor", "Vender ou gerar leads", "Mostrar bastidor e humanizar", "Anunciar novidade"] },
          { name: "qtd_telas", label: "Quantas telas de stories?", type: "select", options: ["3 telas (rápido)", "5 telas (padrão)", "7 telas (completo)", "10 telas (jornada longa)"] },
        ],
        prompt: (f) => `Adapte o seguinte conteúdo para uma sequência de stories do Instagram da Anna Corinna.
Conteúdo original: ${f.conteudo_origem}
Objetivo: ${f.objetivo_stories}
Quantidade de telas: ${f.qtd_telas}

Para CADA tela entregue:
• TELA X/[total]
• Texto principal (máximo 3 linhas — stories são rápidos)
• Elemento interativo sugerido: enquete, caixa de pergunta, contagem regressiva, slider, quiz, ou nenhum
• Visual sugerido: o que mostrar (foto produto, Anna falando, texto animado, bastidor...)
• Transição para próxima tela (gancho que faz a pessoa passar)

ÚLTIMA TELA: sempre com CTA claro — link na bio, responder nos stories, ou DM.
Tom: conversa íntima, como se Anna estivesse falando direto no ouvido da pimentinha.`
      },
      {
        id: "stories_original",
        label: "✨ Stories Original",
        fields: [
          { name: "tema_stories", label: "Tema dos stories", placeholder: "Ex: Bastidor de uma aula, dica rápida de chocolate, responder dúvidas..." },
          { name: "tipo_stories", label: "Tipo de stories", type: "select", options: ["Bastidor do dia", "Dica técnica rápida", "Enquete com a audiência", "Anúncio de novidade", "Reflexão / motivação", "FAQ — respondendo dúvidas"] },
          { name: "tom_stories", label: "Tom desta sequência", type: "select", options: ["Leve e divertido", "Íntimo e reflexivo", "Urgente e direto", "Educativo e técnico", "Afetivo e acolhedor"] },
          { name: "qtd_telas_orig", label: "Quantas telas?", type: "select", options: ["3 telas", "5 telas", "7 telas"] },
        ],
        prompt: (f) => `Crie uma sequência original de stories para o Instagram da Anna Corinna.
Tema: ${f.tema_stories}
Tipo: ${f.tipo_stories}
Tom: ${f.tom_stories}
Telas: ${f.qtd_telas_orig}

Para cada tela:
• TELA X — [título da tela]
• Texto exato para publicar (direto, máximo 3 linhas)
• Elemento interativo (enquete, pergunta, slider, quiz, ou nenhum) com as opções sugeridas se aplicável
• Visual/fundo sugerido
• Gancho para a próxima tela

Última tela: CTA específico para link na bio ou DM.
Incluir ao menos 1 tela com "pimentinhas" quando encaixar naturalmente.`
      },
    ]
  },
  {
    id: "tendencia",
    icon: "🔥",
    label: "Tendências",
    sublabel: "Pautas do Momento",
    accent: "#A0522D",
    description: "Gera sugestões de pauta conectando tendências do mercado com os pilares da Anna.",
    tabs: [
      {
        id: "radar",
        label: "📡 Radar de Tendências",
        fields: [
          { name: "periodo", label: "Período de referência", type: "select", options: ["Esta semana", "Este mês", "Próxima data comemorativa", "Alta temporada (Natal/Páscoa)"] },
          { name: "categoria_tend", label: "Categoria de tendência", type: "select", options: ["Tendências de confeitaria e chocolate", "Comportamento do consumidor de doces", "Tendências de empreendedorismo feminino", "Novidades em técnicas e ingredientes", "Tendências de conteúdo no Instagram"] },
          { name: "pilar_tend", label: "Pilar de conteúdo para conectar", type: "select", options: ["Educação técnica", "Autoridade", "Empreendedorismo", "Bastidor", "Vendas"] },
        ],
        prompt: (f) => `Gere sugestões de pauta para o Instagram da Anna Corinna conectando tendências com seus pilares de conteúdo.
Período: ${f.periodo}
Categoria de tendência: ${f.categoria_tend}
Pilar: ${f.pilar_tend}

Entregue 5 sugestões de pauta. Para cada uma:
• PAUTA X — [título chamativo]
• Tendência identificada (o que está em alta e por quê agora)
• Ângulo da Anna (como ela aborda com sua autoridade de 20 anos)
• Formato ideal (Reels curto/longo, carrossel, stories)
• Hook de abertura pronto
• Por que esse conteúdo vai performar agora

As pautas devem posicionar a Anna como referência que está na vanguarda do setor — nunca como quem "seguiu" uma tendência, mas como quem já sabia antes.`
      },
      {
        id: "viral",
        label: "⚡ Formato Viral",
        fields: [
          { name: "formato_viral", label: "Formato em alta que quer explorar", type: "select", options: ["'O que ninguém te conta sobre...'", "'Erro que cometi por anos...'", "'Segredo de confeiteira profissional'", "'Antes e depois de aprender...'", "'Se eu começasse hoje...'", "'Teste: você sabe fazer isso?'"] },
          { name: "tema_viral", label: "Tema da Anna para aplicar neste formato", placeholder: "Ex: Temperagem de chocolate, precificação, abrir confeitaria..." },
          { name: "resultado_esperado", label: "O que quer gerar com esse post", type: "select", options: ["Salvar e compartilhar", "Comentários e engajamento", "Alcance orgânico", "Cliques no link da bio"] },
        ],
        prompt: (f) => `Crie um post no formato viral "${f.formato_viral}" para o Instagram da Anna Corinna.
Tema: ${f.tema_viral}
Resultado esperado: ${f.resultado_esperado}

Entregue:
1. ROTEIRO DO REELS (formato preferencial para viralizar):
   • Hook visual + fala dos primeiros 3 segundos
   • Blocos de desenvolvimento com texto na tela
   • CTA final
2. LEGENDA COMPLETA para o post com hashtags
3. THUMBNAIL — descrição do frame de abertura ideal
4. POR QUE ESSE FORMATO FUNCIONA PARA A ANNA — análise estratégica rápida (3 linhas)

Lembrar: Anna não "segue trends" — ela lidera. O formato serve à mensagem dela, não o contrário.`
      },
    ]
  },
  {
    id: "hooks",
    icon: "🎣",
    label: "Banco de Hooks",
    sublabel: "Aberturas Prontas",
    accent: "#8B6914",
    description: "Banco de hooks por pilar + gerador de hooks personalizados para qualquer tema.",
    static: true,
    tabs: [
      {
        id: "banco",
        label: "📚 Banco por Pilar",
        static: true,
      },
      {
        id: "gerador_hook",
        label: "✍️ Gerar Hook Personalizado",
        fields: [
          { name: "tema_hook", label: "Tema do conteúdo", placeholder: "Ex: Como não deixar o brigadeiro açucarar, Primeiro passo para empreender na confeitaria..." },
          { name: "tipo_hook", label: "Estilo do hook", type: "select", options: ["Pergunta provocativa", "Dado ou estatística técnica", "Afirmação polêmica", "Confissão pessoal da Anna", "Erro comum revelado"] },
          { name: "formato_hook", label: "Para qual formato", type: "select", options: ["Reels (fala nos primeiros 3s)", "Legenda de feed (primeiras 2 linhas)", "Stories (primeira tela)", "Carrossel (capa do slide)"] },
          { name: "qtd_opcoes", label: "Quantas opções quer?", type: "select", options: ["3 opções", "5 opções", "7 opções"] },
        ],
        prompt: (f) => `Crie ${f.qtd_opcoes} hooks para o Instagram da Anna Corinna.
Tema: ${f.tema_hook}
Estilo: ${f.tipo_hook}
Formato: ${f.formato_hook}

Para cada hook entregue:
• HOOK X: [o hook em si — pronto para usar, sem edição]
• Por que funciona: 1 linha explicando o gatilho psicológico

Regras:
• Hooks para Reels: máximo 1 frase impactante que para o scroll em 3 segundos
• Hooks para legenda: máximo 2 linhas que forçam o "ver mais"
• Hooks para stories: frase que faz a pessoa passar para a próxima tela
• Nunca usar palavras proibidas
• Tom: sofisticado, direto, com autoridade da Anna — não "guru digital"`
      },
    ]
  },
  {
    id: "hottopics",
    icon: "🔥",
    label: "Hot Topics",
    sublabel: "Tendências do Mês",
    accent: "#B22222",
    description: "A IA analisa o mês atual e aponta os temas mais quentes para o conteúdo da Anna.",
    static: true,
    tabs: [{ id: "hot", label: "🔥 Radar do Mês", static: true }]
  },
    {
    id: "checklist",
    icon: "✅",
    label: "Checklist",
    sublabel: "Antes de Publicar",
    accent: "#2D6B3A",
    description: "Checklist interativo de publicação — marque cada item antes de postar.",
    static: true,
    tabs: [{ id: "check", label: "✅ Checklist Completo", static: true }]
  },
  {
    id: "legenda",
    icon: "✍️",
    label: "Legenda",
    sublabel: "Feed & Reels",
    accent: "#C4713A",
    description: "Legendas completas com abertura, desenvolvimento, CTA e hashtags.",
    tabs: [
      {
        id: "educativo",
        label: "📚 Educativo",
        fields: [
          { name: "tecnica", label: "Técnica ou dica do post", placeholder: "Ex: Como temperar chocolate ruby, 3 erros no ganache..." },
          { name: "nivel", label: "Nível da aluna", type: "select", options: ["Iniciante", "Intermediária", "Avançada", "Todos os níveis"] },
          { name: "produto_destaque", label: "Produto em destaque (opcional)", placeholder: "Ex: Trufa belga, Bolo nude, Macaron..." },
        ],
        prompt: (f) => `Crie uma legenda educativa para Instagram da Anna Corinna sobre: "${f.tecnica}". Nível: ${f.nivel}. ${f.produto_destaque ? `Produto: ${f.produto_destaque}.` : ""}
Estrutura: 1) Hook com dado técnico ou pergunta provocativa 2) Entrega real em blocos curtos 3) Conexão com as pimentinhas 4) CTA para link na bio 5) 8-10 hashtags. Nunca palavras proibidas.`
      },
      {
        id: "autoridade_leg",
        label: "💎 Autoridade",
        fields: [
          { name: "conquista", label: "Conquista ou marco", placeholder: "Ex: 10 mil alunas, 20 anos de confeitaria..." },
          { name: "mensagem", label: "Mensagem central", placeholder: "Ex: A confeitaria transforma vidas..." },
          { name: "emocao", label: "Emoção predominante", type: "select", options: ["Gratidão e pertencimento", "Orgulho e determinação", "Inspiração e propósito", "Leveza e humor fino"] },
        ],
        prompt: (f) => `Crie uma legenda de autoridade para o Instagram da Anna Corinna. Marco: ${f.conquista}. Mensagem: ${f.mensagem}. Emoção: ${f.emocao}. Estrutura: abertura épica → história humana → virada → conexão com pimentinhas → CTA → 8 hashtags. Gatilhos: autoridade + pertencimento. Nunca palavras proibidas.`
      },
      {
        id: "venda_leg",
        label: "🛍️ Venda",
        fields: [
          { name: "oferta", label: "O que está sendo vendido", placeholder: "Ex: Curso de chocolateria, Locação do Espaço..." },
          { name: "transformacao", label: "Transformação prometida", placeholder: "Ex: Dominar temperagem, abrir o próprio negócio..." },
          { name: "urgencia", label: "Tipo de urgência", type: "select", options: ["Vagas limitadas", "Prazo de inscrição", "Turma especial", "Evergreen"] },
        ],
        prompt: (f) => `Crie uma legenda de venda para o Instagram da Anna Corinna. Oferta: ${f.oferta}. Transformação: ${f.transformacao}. Urgência: ${f.urgencia}. Estrutura: hook na dor/desejo → problema → solução com autoridade → prova social (10 mil alunas) → CTA específico → urgência → 8 hashtags. Nunca palavras proibidas.`
      },
    ]
  },
  {
    id: "roteiro",
    icon: "🎬",
    label: "Roteiro",
    sublabel: "Reels & YouTube",
    accent: "#7A3B1E",
    description: "Roteiros prontos para gravar com timecodes, falas e sugestões de edição.",
    tabs: [
      {
        id: "reels_curto",
        label: "⚡ Reels 30s",
        fields: [
          { name: "tema_r", label: "Tema do Reels", placeholder: "Ex: O erro que arruína sua ganache..." },
          { name: "hook_tipo", label: "Tipo de hook", type: "select", options: ["Pergunta provocativa", "Dado técnico", "Afirmação polêmica", "Cena visual impactante"] },
          { name: "entrega_r", label: "O que a aluna aprende em 30s", placeholder: "Ex: O erro certo, a técnica, a virada..." },
        ],
        prompt: (f) => `Roteiro Reels 30s para Anna Corinna. Tema: ${f.tema_r}. Hook: ${f.hook_tipo}. Entrega: ${f.entrega_r}.
[00:00-00:03] HOOK — fala ou cena exata
[00:03-00:20] DESENVOLVIMENTO — blocos de 2-3s: ação + fala + texto na tela
[00:20-00:28] VIRADA — momento ah-ha
[00:28-00:30] CTA — 1 frase + texto na tela
Incluir: sugestão de trilha, ritmo de corte, se Anna aparece ou é só produto.`
      },
      {
        id: "reels_longo",
        label: "🎞️ Reels 60s+",
        fields: [
          { name: "tema_rl", label: "Tema", placeholder: "Ex: 3 técnicas de chocolate que toda confeiteira precisa..." },
          { name: "pilar_rl", label: "Pilar", type: "select", options: ["Educação técnica", "Autoridade", "Empreendedorismo", "Bastidor", "Venda"] },
          { name: "duracao_rl", label: "Duração", type: "select", options: ["60 segundos", "90 segundos", "2 minutos"] },
          { name: "estrutura_rl", label: "Estrutura", type: "select", options: ["Lista (3 dicas, 5 erros...)", "Antes e depois", "Storytelling pessoal", "Tutorial passo a passo"] },
        ],
        prompt: (f) => `Roteiro Reels ${f.duracao_rl} para Anna Corinna. Tema: ${f.tema_rl}. Pilar: ${f.pilar_rl}. Estrutura: ${f.estrutura_rl}.
Blocos com timecode, ação na cena, fala completa, texto na tela e transição.
Finalizar com: trilha sugerida, ritmo de edição, elementos de autoridade visual, uso natural de "pimentinhas" se couber.`
      },
    ]
  },
  {
    id: "anuncio",
    icon: "📣",
    label: "Anúncio",
    sublabel: "Tráfego Pago",
    accent: "#5C2D0E",
    description: "3 variações de copy para Meta Ads — headline, texto, CTA e criativo sugerido.",
    tabs: [
      {
        id: "curso_ad",
        label: "🎓 Curso",
        fields: [
          { name: "nome_curso_ad", label: "Nome do curso", placeholder: "Ex: Curso de Chocolateria Profissional..." },
          { name: "publico_ad", label: "Público do anúncio", placeholder: "Ex: Confeiteiras iniciantes de Recife, 25-45 anos..." },
          { name: "transformacao_ad", label: "Principal transformação", placeholder: "Ex: Dominar temperagem, triplicar o ticket..." },
          { name: "oferta_ad", label: "Preço ou condição especial", placeholder: "Ex: R$297, vagas limitadas, até sexta..." },
        ],
        prompt: (f) => `3 variações de copy Meta Ads para curso da Anna Corinna.
Curso: ${f.nome_curso_ad} | Público: ${f.publico_ad} | Transformação: ${f.transformacao_ad} | Oferta: ${f.oferta_ad}
Variação 1 — DOR | Variação 2 — AUTORIDADE | Variação 3 — PERTENCIMENTO (pimentinhas)
Para cada: Headline (≤40 car.) + Texto principal (≤125 car.) + Descrição (≤30 car.) + CTA + Criativo sugerido. Nunca palavras proibidas.`
      },
      {
        id: "retargeting_ad",
        label: "🎯 Retargeting",
        fields: [
          { name: "oferta_ret", label: "Oferta do retargeting", placeholder: "Ex: Última chamada — Curso com bônus exclusivo..." },
          { name: "objecao_ret", label: "Objeção principal", type: "select", options: ["Preço — acha caro", "Tempo — acha que não consegue", "Dúvida — se vai funcionar", "Procrastinação"] },
          { name: "prazo_ret", label: "Prazo final", placeholder: "Ex: Até domingo, últimas 5 vagas..." },
        ],
        prompt: (f) => `3 variações de copy de RETARGETING Meta Ads para Anna Corinna.
Oferta: ${f.oferta_ret} | Objeção: ${f.objecao_ret} | Prazo: ${f.prazo_ret}
Essas pessoas já viram a oferta. O copy deve: reconhecer isso sutilmente, quebrar a objeção, criar urgência real.
Para cada variação: Headline + Texto + Descrição + CTA + Criativo. Abordagens: emocional / racional / prova social.`
      },
    ]
  },
];

// ─── CHECKLIST COMPONENT ──────────────────────────────────────────────────────
function ChecklistView() {
  const [checked, setChecked] = useState({});
  const total = CHECKLIST_ITEMS.reduce((a, c) => a + c.items.length, 0);
  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  return (
    <div>
      <div style={{ background: "rgba(45,107,58,0.15)", border: "1px solid rgba(45,107,58,0.3)", borderRadius: 14, padding: "1rem 1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "#6fcf8a", marginBottom: 6, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Progresso de Publicação</div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 8, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #2D6B3A, #6fcf8a)", borderRadius: 99, transition: "width 0.3s" }} />
          </div>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: pct === 100 ? "#6fcf8a" : "#c9a882", minWidth: 52, textAlign: "right" }}>
          {pct}%
        </div>
      </div>
      {pct === 100 && (
        <div style={{ textAlign: "center", padding: "0.75rem", background: "rgba(45,107,58,0.2)", borderRadius: 10, marginBottom: "1rem", color: "#6fcf8a", fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
          ✦ Tudo pronto, pimentinha. Pode publicar! 🌶️
        </div>
      )}
      {CHECKLIST_ITEMS.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#c9a882", marginBottom: 8, letterSpacing: 0.5 }}>{cat.cat}</div>
          {cat.items.map((item, ii) => {
            const key = `${ci}-${ii}`;
            return (
              <div key={key} onClick={() => setChecked(p => ({ ...p, [key]: !p[key] }))}
                style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "0.6rem 0.75rem", borderRadius: 8, marginBottom: 4, cursor: "pointer", background: checked[key] ? "rgba(45,107,58,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${checked[key] ? "rgba(45,107,58,0.3)" : "rgba(255,255,255,0.06)"}`, transition: "all 0.15s" }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${checked[key] ? "#6fcf8a" : "rgba(255,255,255,0.2)"}`, background: checked[key] ? "#2D6B3A" : "transparent", flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                  {checked[key] && <span style={{ color: "#6fcf8a", fontSize: 11, fontWeight: 900 }}>✓</span>}
                </div>
                <span style={{ fontSize: 13, color: checked[key] ? "#6b8f73" : "#c9a882", textDecoration: checked[key] ? "line-through" : "none", lineHeight: 1.5, transition: "all 0.15s" }}>{item}</span>
              </div>
            );
          })}
        </div>
      ))}
      <button onClick={() => setChecked({})} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.4rem 1rem", color: "#6b4c35", cursor: "pointer", fontSize: 12, marginTop: 4 }}>
        Resetar checklist
      </button>
    </div>
  );
}

// ─── HOOKS BANK COMPONENT ─────────────────────────────────────────────────────
function HooksBankView() {
  const [activeCategory, setActiveCategory] = useState(Object.keys(HOOKS_BANK)[0]);
  const [copied, setCopied] = useState(null);
  const copy = (text, idx) => { navigator.clipboard.writeText(text); setCopied(idx); setTimeout(() => setCopied(null), 1500); };

  return (
    <div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1rem" }}>
        {Object.keys(HOOKS_BANK).map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            background: activeCategory === cat ? "rgba(139,105,20,0.4)" : "transparent",
            border: `1px solid ${activeCategory === cat ? "#8B6914" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 8, padding: "0.4rem 0.9rem",
            color: activeCategory === cat ? "#e8c99a" : "#9B6B3A",
            cursor: "pointer", fontSize: 12, fontWeight: activeCategory === cat ? 700 : 400, transition: "all 0.15s"
          }}>{cat}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {HOOKS_BANK[activeCategory].map((hook, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,105,20,0.2)", borderRadius: 10, padding: "0.75rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 13, color: "#e8d5be", lineHeight: 1.6, flex: 1 }}>{hook}</span>
            <button onClick={() => copy(hook, i)} style={{ background: copied === i ? "rgba(45,107,58,0.4)" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 6, padding: "0.3rem 0.7rem", color: copied === i ? "#6fcf8a" : "#9B6B3A", cursor: "pointer", fontSize: 11, flexShrink: 0, transition: "all 0.15s" }}>
              {copied === i ? "✓" : "Copiar"}
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "rgba(139,105,20,0.08)", borderRadius: 10, fontSize: 12, color: "#7A5C3A", fontStyle: "italic" }}>
        💡 Use os {"{X}"} como placeholders — substitua pelo número ou dado real antes de publicar.
      </div>
    </div>
  );
}

// ─── SPINNER ──────────────────────────────────────────────────────────────────
// ─── HOT TOPICS COMPONENT ────────────────────────────────────────────────────
function HotTopicsView() {
  const [topics, setTopics] = useState(null);
  const [loading, setLoading] = useState(false);

  const SYSTEM_PROMPT_HOT = `Você é especialista em tendências de conteúdo digital para confeitaria e gastronomia no Brasil.`;

  const getMes = () => {
    const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    return meses[new Date().getMonth()] + " de " + new Date().getFullYear();
  };

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text:
                SYSTEM_PROMPT_HOT +
                "\n\nPara o mês de " +
                getMes() +
                ", liste exatamente 6 temas/tendências de conteúdo para uma Chef Pâtissière no Instagram brasileiro. Responda em JSON com tema, temperatura e motivo."
            }
          ]
        }
      ]
    })
  }
);

const data = await res.json();

const text =
  data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

const parsed = JSON.parse(text);

setTopics(parsed.topics || []);
          messages: [{ role: "user", content: `Para o mês de ${getMes()}, liste exatamente 6 temas/tendências de conteúdo para uma Chef Pâtissière no Instagram brasileiro. Responda APENAS com JSON válido neste formato exato, sem texto adicional:
{"topics":[{"tema":"nome do tema","temperatura":"quente","motivo":"por que está em alta em 1 linha"},{"tema":"nome","temperatura":"morno","motivo":"explicação"},{"tema":"nome","temperatura":"frio","motivo":"explicação"}]}
Use temperatura: "quente", "morno" ou "frio". Retorne exatamente 6 tópicos variando as temperaturas.` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(i => i.text || "").join("") || "{}";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setTopics(parsed.topics || []);
    } catch(e) { setTopics([]); }
    setLoading(false);
  };

  const tempConfig = {
    quente: { emoji: "🔥", label: "Quente", color: "#B22222", bg: "rgba(178,34,34,0.12)", bar: "#ff4444", barW: "90%" },
    morno:  { emoji: "🌡️", label: "Morno",  color: "#C4713A", bg: "rgba(196,113,58,0.12)", bar: "#f0a050", barW: "55%" },
    frio:   { emoji: "❄️", label: "Frio",   color: "#4A90D9", bg: "rgba(74,144,217,0.12)", bar: "#4A90D9", barW: "20%" },
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", color: "#e8c99a", fontWeight: 700, fontSize: "1rem" }}>
            Radar de Tendências
          </div>
          <div style={{ fontSize: 11, color: "#7A5C3A", marginTop: 2 }}>{getMes()}</div>
        </div>
        <button onClick={fetchTopics} disabled={loading} style={{
          background: loading ? "rgba(178,34,34,0.2)" : "linear-gradient(135deg,#B22222,#e05555)",
          border: "none", borderRadius: 10, padding: "0.5rem 1.1rem",
          color: "#fff", fontSize: 12, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : "0 4px 14px rgba(178,34,34,0.4)",
        }}>
          {loading ? "Analisando..." : topics ? "🔄 Atualizar" : "🔥 Analisar Mês"}
        </button>
      </div>

      {!topics && !loading && (
        <div style={{ textAlign: "center", padding: "2.5rem 1rem", background: "rgba(178,34,34,0.05)", border: "1px solid rgba(178,34,34,0.15)", borderRadius: 16 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔥</div>
          <p style={{ fontFamily: "'Playfair Display', serif", color: "#c9a882", fontStyle: "italic", fontSize: "0.9rem" }}>
            Clique em "Analisar Mês" para ver o que está em alta agora para a Anna Corinna.
          </p>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#B22222", fontStyle: "italic", fontSize: 13 }}>
          <div style={{ width: 32, height: 32, border: "3px solid rgba(178,34,34,0.2)", borderTop: "3px solid #B22222", borderRadius: "50%", animation: "spin 0.9s linear infinite", margin: "0 auto 10px" }} />
          Consultando tendências do mês...
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {topics && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {topics.map((t, i) => {
            const cfg = tempConfig[t.temperatura] || tempConfig.frio;
            return (
              <div key={i} style={{ background: cfg.bg, border: `1px solid ${cfg.color}33`, borderRadius: 12, padding: "0.85rem 1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 13, color: "#e8c99a", flex: 1, paddingRight: 8 }}>
                    {t.tema}
                  </div>
                  <div style={{ background: cfg.color, borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
                    {cfg.emoji} {cfg.label}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#9B6B3A", marginBottom: 8, lineHeight: 1.4 }}>{t.motivo}</div>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 5, overflow: "hidden" }}>
                  <div style={{ width: cfg.barW, height: "100%", background: cfg.bar, borderRadius: 99, transition: "width 1s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Spinner({ accent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem", gap: 10 }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${accent}33`, borderTop: `3px solid ${accent}`, borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
      <span style={{ color: accent, fontSize: 12, fontStyle: "italic", opacity: 0.8 }}>Preparando seu conteúdo...</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function AnnaCorinnaAgentV3() {
  const [activeTool, setActiveTool] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [fields, setFields] = useState({});
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const tool = tools.find(t => t.id === activeTool);
  const tab = tool?.tabs.find(t => t.id === activeTab);

  const handleSelectTool = (id) => {
    setActiveTool(id);
    const t = tools.find(x => x.id === id);
    setActiveTab(t?.tabs[0]?.id || null);
    setFields({});
    setResult("");
  };

  const handleSelectTab = (id) => {
    setActiveTab(id);
    setFields({});
    setResult("");
  };

  const handleGenerate = async () => {
    if (!tab || tab.static) return;
    const missing = tab.fields?.find(f => !fields[f.name]);
    if (missing) { alert(`Preencha: ${missing.label}`); return; }
    setLoading(true);
    setResult("");
    try {
     const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: SYSTEM_PROMPT + "\n\n" + tab.prompt(fields)
            }
          ]
        }
      ]
    })
  }
);

const data = await res.json();

const text =
  data.candidates?.[0]?.content?.parts?.[0]?.text ||
  "Erro ao gerar.";

setResult(text);
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: tab.prompt(fields) }],
        }),
      });
      const data = await res.json();
      const text = data.error ? `Erro: ${data.error.message}` : (data.content?.map(i => i.text || "").join("\n") || "Erro ao gerar."); setResult(text);
    } catch(e) { setResult("Erro de conexão. Tente novamente."); }
    setLoading(false);
  };

  const isStaticTab = tab?.static;
  const showStaticContent = isStaticTab && activeTool === "checklist";
  const showHooksBank = isStaticTab && activeTool === "hooks" && activeTab === "banco";
  const showHotTopics = isStaticTab && activeTool === "hottopics";

  // Split tools into rows: 5 + 4
  const row1 = tools.slice(0, 5);
  const row2 = tools.slice(5);

  return (
    <div style={{ minHeight: "100vh", background: "#0d0703", fontFamily: "'Lato', sans-serif", color: "#f0e0cc" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "linear-gradient(180deg,#1a0c05 0%,#0d0703 100%)", borderBottom: "1px solid rgba(196,113,58,0.15)", padding: "1.25rem 1rem 1rem", textAlign: "center" }}>
        <div style={{ fontSize: 10, letterSpacing: 5, color: "#7A5C3A", textTransform: "uppercase", marginBottom: 5 }}>Agente Exclusivo de Conteúdo</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 700, margin: "0 0 3px", background: "linear-gradient(90deg,#c9a882,#f0d5a0,#C4713A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Anna Corinna</h1>
        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#5C3A1E", fontSize: 12, letterSpacing: 3 }}>Douce et chocolat 🍫</div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "1.25rem 0.75rem" }}>

        {/* Tool Nav Row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "0.5rem", marginBottom: "0.5rem" }}>
          {row1.map(t => (
            <button key={t.id} onClick={() => handleSelectTool(t.id)} style={{
              background: activeTool === t.id ? `${t.accent}cc` : "rgba(255,255,255,0.03)",
              border: `1.5px solid ${activeTool === t.id ? t.accent : "rgba(255,255,255,0.07)"}`,
              borderRadius: 12, padding: "0.75rem 0.4rem", cursor: "pointer", textAlign: "center",
              color: activeTool === t.id ? "#fff" : "#9B6B3A", transition: "all 0.2s",
              boxShadow: activeTool === t.id ? `0 4px 16px ${t.accent}44` : "none",
              transform: activeTool === t.id ? "translateY(-2px)" : "none",
            }}>
              <div style={{ fontSize: 20, marginBottom: 3 }}>{t.icon}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 11, lineHeight: 1.2 }}>{t.label}</div>
              <div style={{ fontSize: 9, opacity: 0.65, marginTop: 2 }}>{t.sublabel}</div>
            </button>
          ))}
        </div>

        {/* Tool Nav Row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.5rem", marginBottom: "1.25rem" }}>
          {row2.map(t => (
            <button key={t.id} onClick={() => handleSelectTool(t.id)} style={{
              background: activeTool === t.id ? `${t.accent}cc` : "rgba(255,255,255,0.03)",
              border: `1.5px solid ${activeTool === t.id ? t.accent : "rgba(255,255,255,0.07)"}`,
              borderRadius: 12, padding: "0.75rem 0.4rem", cursor: "pointer", textAlign: "center",
              color: activeTool === t.id ? "#fff" : "#9B6B3A", transition: "all 0.2s",
              boxShadow: activeTool === t.id ? `0 4px 16px ${t.accent}44` : "none",
              transform: activeTool === t.id ? "translateY(-2px)" : "none",
            }}>
              <div style={{ fontSize: 20, marginBottom: 3 }}>{t.icon}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 11, lineHeight: 1.2 }}>{t.label}</div>
              <div style={{ fontSize: 9, opacity: 0.65, marginTop: 2 }}>{t.sublabel}</div>
            </button>
          ))}
        </div>

        {/* Welcome */}
        {!activeTool && (
          <div style={{ textAlign: "center", padding: "2.5rem 1rem", background: "rgba(196,113,58,0.04)", border: "1px solid rgba(196,113,58,0.1)", borderRadius: 20 }}>
            <div style={{ fontSize: 44, marginBottom: "0.75rem" }}>🍫</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "#c9a882", fontStyle: "italic", margin: "0 0 8px" }}>Bem-vinda, pimentinha. Selecione uma ferramenta.</p>
            <p style={{ fontSize: 12, color: "#4d3420" }}>8 módulos · modelados para a identidade da Anna Corinna</p>
          </div>
        )}

        {/* Sub-tabs */}
        {tool && (
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: 11, color: "#5C3A1E", marginBottom: 8 }}>{tool.description}</div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {tool.tabs.map(t => (
                <button key={t.id} onClick={() => handleSelectTab(t.id)} style={{
                  background: activeTab === t.id ? `${tool.accent}2a` : "transparent",
                  border: `1px solid ${activeTab === t.id ? tool.accent : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 8, padding: "0.4rem 0.9rem",
                  color: activeTab === t.id ? "#e8c99a" : "#7A5C3A",
                  cursor: "pointer", fontSize: 12, fontWeight: activeTab === t.id ? 700 : 400, transition: "all 0.15s"
                }}>{t.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Static: Checklist */}
        {showStaticContent && <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(45,107,58,0.2)", borderRadius: 18, padding: "1.5rem" }}><ChecklistView /></div>}

        {/* Static: Hooks Bank */}
        {showHooksBank && <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(139,105,20,0.2)", borderRadius: 18, padding: "1.5rem" }}><HooksBankView /></div>}

        {/* Static: Hot Topics */}
        {showHotTopics && <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(178,34,34,0.2)", borderRadius: 18, padding: "1.5rem" }}><HotTopicsView /></div>}

        {/* Dynamic Form */}
        {tab && !isStaticTab && (
          <div style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${tool.accent}2a`, borderRadius: 18, padding: "1.25rem", marginBottom: "1rem" }}>
            {tab.fields?.map(f => (
              <div key={f.name} style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: 11, color: "#c9a882", marginBottom: 5, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>{f.label}</label>
                {f.type === "select" ? (
                  <select value={fields[f.name] || ""} onChange={e => setFields({ ...fields, [f.name]: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.9rem", background: "rgba(255,255,255,0.05)", border: `1px solid ${tool.accent}33`, borderRadius: 10, color: fields[f.name] ? "#f0e0cc" : "#5C3A1E", fontSize: 13, outline: "none", cursor: "pointer" }}>
                    <option value="" disabled>Selecione...</option>
                    {f.options.map(o => <option key={o} value={o} style={{ background: "#1a0c05" }}>{o}</option>)}
                  </select>
                ) : (
                  <input type="text" placeholder={f.placeholder} value={fields[f.name] || ""}
                    onChange={e => setFields({ ...fields, [f.name]: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.9rem", background: "rgba(255,255,255,0.05)", border: `1px solid ${tool.accent}33`, borderRadius: 10, color: "#f0e0cc", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                )}
              </div>
            ))}
            <button onClick={handleGenerate} disabled={loading} style={{
              width: "100%", padding: "0.8rem",
              background: loading ? "rgba(100,50,20,0.3)" : `linear-gradient(135deg,${tool.accent},#e8a060)`,
              border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer", letterSpacing: 0.5,
              boxShadow: loading ? "none" : `0 4px 18px ${tool.accent}44`, transition: "all 0.2s", marginTop: 4,
            }}>
              {loading ? "Gerando..." : `✨ Gerar ${tab.label.replace(/^[^\s]+\s/, "")}`}
            </button>
          </div>
        )}

        {loading && <Spinner accent={tool?.accent || "#C4713A"} />}

        {result && !loading && (
          <div style={{ background: `${tool.accent}0a`, border: `1px solid ${tool.accent}33`, borderRadius: 18, padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", color: "#e8c99a", fontWeight: 700, fontSize: "0.95rem" }}>✦ Conteúdo gerado</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  style={{ background: copied ? "#2d5a2d" : "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 7, padding: "0.3rem 0.8rem", color: "#f0e0cc", cursor: "pointer", fontSize: 12, transition: "all 0.2s" }}>
                  {copied ? "✓ Copiado!" : "Copiar"}
                </button>
                <button onClick={() => { setResult(""); setFields({}); }}
                  style={{ background: "transparent", border: `1px solid ${tool.accent}33`, borderRadius: 7, padding: "0.3rem 0.8rem", color: "#7A5C3A", cursor: "pointer", fontSize: 12 }}>
                  ↩ Novo
                </button>
              </div>
            </div>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: 13, color: "#e8d5be" }}>{result}</div>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "1.25rem", color: "#2d1508", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>
        Anna Corinna · Douce et chocolat · Agente v3
      </div>
    </div>
  );
}
