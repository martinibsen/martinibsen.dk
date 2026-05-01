// Levende dokument over værktøjer til AI-først produktledelse.
// "Sidst opdateret" vises på /playbook/vaerktojer fra LAST_UPDATED.

export type ToolCategory =
  | 'Kode'
  | 'No-code'
  | 'Kontekst'
  | 'Eval'
  | 'Governance'
  | 'Discovery'
  | 'Møder'
  | 'Kommunikation'
  | 'Browser'
  | 'Skrivning';

export interface Tool {
  name: string;
  desc: string;
  category: ToolCategory;
  url: string;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  'Kode',
  'No-code',
  'Kontekst',
  'Eval',
  'Governance',
  'Discovery',
  'Møder',
  'Kommunikation',
  'Browser',
  'Skrivning',
];

// Format: ÅÅÅÅ-MM-DD
export const LAST_UPDATED = '2026-05-01';

export const tools: Tool[] = [
  // 1. Kode-assistent
  {
    name: 'Claude Code',
    desc: 'Terminalbaseret agent fra Anthropic. Stærkest til længere, agentiske opgaver. Min primære stack.',
    category: 'Kode',
    url: 'https://claude.com/product/claude-code',
  },
  {
    name: 'Cursor',
    desc: 'IDE-baseret. God til folk der vil have et visuelt miljø. Skiftet til Claude-modeller har hævet barren.',
    category: 'Kode',
    url: 'https://cursor.com',
  },
  {
    name: 'Windsurf',
    desc: 'Cursor-konkurrent. Lidt mere agentisk. Værd at prøve.',
    category: 'Kode',
    url: 'https://windsurf.com',
  },
  {
    name: 'GitHub Copilot',
    desc: 'Stadig den mest udbredte i enterprise. Mindre aggressiv end de andre.',
    category: 'Kode',
    url: 'https://github.com/features/copilot',
  },
  {
    name: 'Replit Agent',
    desc: 'Web-baseret. Godt til hurtige prototyper uden lokalt setup.',
    category: 'Kode',
    url: 'https://replit.com',
  },

  // 2. No-code / vibe-kode prototyping
  {
    name: 'Lovable',
    desc: 'Prompt-til-app. God til hurtige MVP’er. Limitationer på kompleksitet.',
    category: 'No-code',
    url: 'https://lovable.dev',
  },
  {
    name: 'v0 (Vercel)',
    desc: 'Komponenter og UI-flows. Stærkere på React-økosystemet.',
    category: 'No-code',
    url: 'https://v0.dev',
  },
  {
    name: 'Bolt.new',
    desc: 'Stackblitz-baseret. Kører direkte i browseren.',
    category: 'No-code',
    url: 'https://bolt.new',
  },
  {
    name: 'Replit',
    desc: 'Bredere end de tre ovenfor. Også backend.',
    category: 'No-code',
    url: 'https://replit.com',
  },

  // 3. Kontekst-lag
  {
    name: 'MCP (Model Context Protocol)',
    desc: 'Anthropics åbne standard. Det er der her stack’en bør konvergere de næste år.',
    category: 'Kontekst',
    url: 'https://modelcontextprotocol.io',
  },
  {
    name: 'Notion MCP',
    desc: 'Direkte adgang til arbejdsplads. Bruger det selv intensivt.',
    category: 'Kontekst',
    url: 'https://www.notion.com/help/notion-mcp',
  },
  {
    name: 'LangChain / LlamaIndex',
    desc: 'Mere dev-tunge frameworks. Relevant hvis du bygger custom RAG.',
    category: 'Kontekst',
    url: 'https://www.langchain.com',
  },
  {
    name: 'Custom MCP servers',
    desc: 'Lav dine egne for interne systemer. Det er nemmere end det lyder.',
    category: 'Kontekst',
    url: 'https://modelcontextprotocol.io/quickstart/server',
  },

  // 4. Eval & observability
  {
    name: 'LangSmith',
    desc: 'Tracing, eval, debugging. LangChain-økosystemet.',
    category: 'Eval',
    url: 'https://www.langchain.com/langsmith',
  },
  {
    name: 'Braintrust',
    desc: 'Eval-fokuseret. God hvis I vil teste prompts systematisk.',
    category: 'Eval',
    url: 'https://www.braintrust.dev',
  },
  {
    name: 'Helicone',
    desc: 'LLM observability. Logging, latency, cost tracking.',
    category: 'Eval',
    url: 'https://www.helicone.ai',
  },
  {
    name: 'PostHog',
    desc: 'Bredere produktanalytics, men har AI-features. Bruger det selv.',
    category: 'Eval',
    url: 'https://posthog.com',
  },

  // 5. Governance & compliance
  {
    name: 'Cloudflare AI Gateway',
    desc: 'Rate limiting, logging, sikkerhedslag mellem app og model.',
    category: 'Governance',
    url: 'https://www.cloudflare.com/application-services/products/ai-gateway/',
  },
  {
    name: 'Lakera',
    desc: 'Prompt injection og data leak detection.',
    category: 'Governance',
    url: 'https://www.lakera.ai',
  },
  {
    name: 'Credo AI',
    desc: 'Governance-platform til AI-policies på tværs af organisationen.',
    category: 'Governance',
    url: 'https://www.credo.ai',
  },
  {
    name: 'Snyk',
    desc: 'Secrets og vulnerability scanning. Har udvidet til AI-genereret kode.',
    category: 'Governance',
    url: 'https://snyk.io',
  },

  // 6. Discovery & user research
  {
    name: 'Dovetail',
    desc: 'Klassisk research-platform med AI-features til transkription og temaer.',
    category: 'Discovery',
    url: 'https://dovetail.com',
  },
  {
    name: 'Maze',
    desc: 'Usability testing med AI-summarisering.',
    category: 'Discovery',
    url: 'https://maze.co',
  },
  {
    name: 'Notably',
    desc: 'AI-først research. Yngre og mere agentisk end Dovetail.',
    category: 'Discovery',
    url: 'https://www.notably.ai',
  },
  {
    name: 'Looppanel',
    desc: 'Interview-analyse, meget hurtig.',
    category: 'Discovery',
    url: 'https://www.looppanel.com',
  },

  // 7. Møder & referater
  {
    name: 'Granola',
    desc: 'Min favorit. Tager noter live, formatterer efter mødet. Privacy-fokus.',
    category: 'Møder',
    url: 'https://www.granola.ai',
  },
  {
    name: 'Fathom',
    desc: 'Bredere mødeoptager. God til Zoom/Meet.',
    category: 'Møder',
    url: 'https://fathom.video',
  },
  {
    name: 'Tldv',
    desc: 'Optager + AI-resumé. Stærk søgning på tværs af møder.',
    category: 'Møder',
    url: 'https://tldv.io',
  },
  {
    name: 'Otter',
    desc: 'Veteranen. Stadig god til transskription, mindre stærk på AI-resumé.',
    category: 'Møder',
    url: 'https://otter.ai',
  },

  // 8. Kommunikation & samarbejde
  {
    name: 'Linear',
    desc: 'Issues, specs, roadmap. Bygger AI ind direkte i flowet — den nye standard for moderne produktteams.',
    category: 'Kommunikation',
    url: 'https://linear.app',
  },
  {
    name: 'Slack',
    desc: 'Defacto team-chat. MCP-serveren gør den interessant for agent-flows — meget kontekst lever her.',
    category: 'Kommunikation',
    url: 'https://slack.com',
  },
  {
    name: 'Loom',
    desc: 'Async video. Sparer møder. AI-resuméer gør den brugbar uden at folk ser hele klippet.',
    category: 'Kommunikation',
    url: 'https://www.loom.com',
  },
  {
    name: 'Notion',
    desc: 'Det fælles arbejdsbord — docs, databaser, specs. Som kontekst-lag dækket ovenfor; her er det samarbejds-vinklen.',
    category: 'Kommunikation',
    url: 'https://www.notion.com',
  },

  // 9. Browser-agenter
  {
    name: 'Cowork',
    desc: 'Anthropics browser-agent for ikke-udviklere. Bruger det selv til LinkedIn-scheduling og DNS-arbejde.',
    category: 'Browser',
    url: 'https://www.cowork.com',
  },
  {
    name: 'Browser Use',
    desc: 'Open source. Mere dev-tungt setup.',
    category: 'Browser',
    url: 'https://browser-use.com',
  },
  {
    name: 'OpenAI Operator',
    desc: 'ChatGPT-integreret. Mest moden i øjeblikket.',
    category: 'Browser',
    url: 'https://openai.com/index/introducing-operator/',
  },

  // 10. Skrivning
  {
    name: 'Claude (web/app)',
    desc: 'Mit primære værktøj til længere skrivning og strukturering.',
    category: 'Skrivning',
    url: 'https://claude.ai',
  },
  {
    name: 'ChatGPT',
    desc: 'God til hurtige udkast, særligt med Custom GPTs.',
    category: 'Skrivning',
    url: 'https://chatgpt.com',
  },
  {
    name: 'Loops',
    desc: 'Email-platform med god API. Bruger det til alle mine produkter.',
    category: 'Skrivning',
    url: 'https://loops.so',
  },
  {
    name: 'Cursor Tab / Apple Intelligence',
    desc: 'Til mikro-skrivning på system-niveau.',
    category: 'Skrivning',
    url: 'https://cursor.com',
  },
];
