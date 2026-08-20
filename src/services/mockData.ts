import { AIModel, ChatConversation, NotificationItem, Project, StoredFile, User, AITool } from '../types';

export const MOCK_USER: User = {
  id: 'usr_dilshad_01',
  name: 'Dilshad Developer',
  email: 'dilshad@workspace.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  tier: 'Pro',
  creditsLeft: 8450,
  maxCredits: 10000,
};

export const AI_MODELS: AIModel[] = [
  {
    id: 'dilshad-pro',
    name: 'Dilshad AI Pro',
    badge: 'FLAGSHIP',
    description: 'Complex reasoning, multi-modal synthesis, and comprehensive research',
    speed: 'Deep Thinker',
    capability: 'Max Reasoning & Coding',
    contextWindow: '2 Million Tokens',
    iconName: 'Sparkles',
    isPro: true,
  },
  {
    id: 'dilshad-core',
    name: 'Dilshad AI',
    badge: 'DEFAULT',
    description: 'Versatile general-purpose model for everyday high-speed tasks and writing',
    speed: 'Fast',
    capability: 'Balanced Multipurpose',
    contextWindow: '1 Million Tokens',
    iconName: 'Zap',
  },
  {
    id: 'dilshad-fast',
    name: 'Fast',
    badge: 'LIGHTNING',
    description: 'Ultra-low latency designed for quick queries and instant drafts',
    speed: 'Ultra Fast',
    capability: 'High Speed Text',
    contextWindow: '128k Tokens',
    iconName: 'Flame',
  },
  {
    id: 'dilshad-balanced',
    name: 'Balanced',
    badge: 'ANALYTICS',
    description: 'Precision data analysis, structured spreadsheets, and mathematical logic',
    speed: 'Balanced',
    capability: 'Data & Technical',
    contextWindow: '500k Tokens',
    iconName: 'Scale',
  },
  {
    id: 'dilshad-creative',
    name: 'Creative',
    badge: 'VISIONARY',
    description: 'Nuanced storytelling, brand marketing voice, and creative brainstorming',
    speed: 'Balanced',
    capability: 'Creative Writing',
    contextWindow: '500k Tokens',
    iconName: 'Palette',
  },
];

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'chat_today_1',
    title: 'Website redesign ideas',
    createdAt: Date.now() - 1000 * 60 * 45, // 45 mins ago
    updatedAt: Date.now() - 1000 * 60 * 45,
    category: 'today',
    pinned: true,
    modelId: 'dilshad-pro',
    messages: [
      {
        id: 'msg_1_1',
        role: 'user',
        content: 'Give me 5 breakthrough UX and visual redesign concepts for a modern B2B SaaS platform in 2026.',
        timestamp: Date.now() - 1000 * 60 * 45,
      },
      {
        id: 'msg_1_2',
        role: 'assistant',
        content: `Here are **5 breakthrough design concepts** for your 2026 SaaS redesign that elevate utility and visual distinction:

### 1. Contextual Glass Command Surfaces
Instead of static multi-level navigation trees, implement floating, context-aware command docks that adapt based on the user's active workflow stage.

* **Visual Rhythm:** Crisp 1px translucent borders with subtle ambient backlight matching the brand's primary spectrum.
* **Micro-interactions:** Keyboard-first ergonomics with instant hotkeys (\`Cmd+K\`, \`/\`, \`Tab\`).

### 2. Live Data Streams with Semantic Color Coding
Replace traditional tabular data with reactive visual cards that highlight velocity and delta metrics:

\`\`\`typescript
interface MetricStreamConfig {
  sampleRateMs: number;
  highlightDeltaThreshold: number; // e.g. 15% surge triggers ambient glow
  visualArchetype: 'bento-compact' | 'stream-expanded';
}
\`\`\`

### 3. Ambient Dark Canvas with Precision Contrast
* **Canvas Tone:** Deep obsidian neutrals (\`#0a0a0f\`) with strictly warm or cool neutral ramps.
* **Typography:** Display pairings with geometric body fonts at high optical sizing ratios (1.333 Major Third).

### 4. Interactive Simulation Playgrounds
Embed inline interactive preview nodes right within standard table rows, enabling users to test parameters without navigating to separate configuration screens.

### 5. Multi-User Telemetry & Live Spatial Presence
Subtle cursor ribbons indicating active teammates currently inspecting or modifying shared records, with instant inline threads.`,
        timestamp: Date.now() - 1000 * 60 * 44,
        model: 'Dilshad AI Pro',
        reactions: { liked: true },
        reasoning: 'Analyzed modern B2B design patterns, SaaS ergonomic benchmarks, and spatial UI best practices.',
      },
    ],
  },
  {
    id: 'chat_today_2',
    title: 'Product description for AI camera',
    createdAt: Date.now() - 1000 * 60 * 120, // 2 hours ago
    updatedAt: Date.now() - 1000 * 60 * 120,
    category: 'today',
    modelId: 'dilshad-creative',
    messages: [
      {
        id: 'msg_2_1',
        role: 'user',
        content: 'Write a magnetic, high-converting product description for "Iris Pro" — a studio AI webcam that tracks lighting and adjusts depth of field in real-time.',
        timestamp: Date.now() - 1000 * 60 * 120,
      },
      {
        id: 'msg_2_2',
        role: 'assistant',
        content: `## **Iris Pro Studio** — *Cinematic Presence, Intelligently Automated.*

Turn any desk into a high-end broadcast studio. Engineered with a custom 1-inch Sony sensor and powered by Dilshad Neural Vision Engine, **Iris Pro** continuously shapes your light, isolates your voice, and sculpts cinematic depth of field with zero manual tuning.

---

### **Key Highlights:**

* **Adaptive Photometric Balancing:** Dynamically compensates for harsh window glare or low-light evening calls without noise artifacts.
* **True Optical Bokeh:** Hardware-assisted f/1.4 aperture emulation renders buttery background falloff while preserving hairline edge clarity.
* **Neural Beamforming Array:** Triple directional microphones eliminate ambient keyboard clicks and room echoes.

> *"The single biggest upgrade to my remote presentation kit this year."* — Wired Reviewer

### **Specifications at a Glance:**
| Spec | Metric |
| :--- | :--- |
| **Sensor** | 1" Custom 4K HDR 60fps |
| **Field of View** | 65° – 95° Auto-Framing |
| **Connectivity** | USB-C 3.2 Gen 2 / Thunderbolt |
| **Onboard AI Chip** | Dual NPU 14 TOPS |`,
        timestamp: Date.now() - 1000 * 60 * 119,
        model: 'Dilshad Creative',
      },
    ],
  },
  {
    id: 'chat_today_3',
    title: 'Marketing strategy Q3',
    createdAt: Date.now() - 1000 * 60 * 240,
    updatedAt: Date.now() - 1000 * 60 * 240,
    category: 'today',
    modelId: 'dilshad-balanced',
    messages: [
      {
        id: 'msg_3_1',
        role: 'user',
        content: 'Outline a 3-pillar Q3 marketing expansion strategy for developer adoption.',
        timestamp: Date.now() - 1000 * 60 * 240,
      },
      {
        id: 'msg_3_2',
        role: 'assistant',
        content: `### Q3 Developer Adoption Framework

Here is a structured three-pillar strategy engineered to accelerate bottom-up developer discovery and community retention:

1. **Pillar 1: Interactive SDK Sandboxes & 60-Second Onboarding**
   * Pre-built StackBlitz / Codesandbox templates for Next.js, Remix, and Node.js.
   * Zero-config CLI: \`npx dilshad-ai init\` generates complete boilerplate with type safety.

2. **Pillar 2: Technical Breakdown Content & Live Benchmark Reports**
   * Bi-weekly engineering deep-dives analyzing latency, caching strategies, and memory optimization.
   * Open-source comparison harness against industry standards.

3. **Pillar 3: Community Hackathons with Real-World Bounty Tracks**
   * $25k prize pool focusing on developer tooling, agentic workflows, and creative multimodal experiments.`,
        timestamp: Date.now() - 1000 * 60 * 239,
        model: 'Dilshad Balanced',
      },
    ],
  },
  {
    id: 'chat_yesterday_1',
    title: 'Business plan for SaaS launch',
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
    updatedAt: Date.now() - 1000 * 60 * 60 * 26,
    category: 'yesterday',
    pinned: true,
    modelId: 'dilshad-pro',
    messages: [
      {
        id: 'msg_4_1',
        role: 'user',
        content: 'What are the core financial and unit economics metrics we should track for our seed round SaaS pitch deck?',
        timestamp: Date.now() - 1000 * 60 * 60 * 26,
      },
      {
        id: 'msg_4_2',
        role: 'assistant',
        content: `### Essential Unit Economics for Seed Stage SaaS

When presenting to top-tier investors, focus relentlessly on these 5 metric categories:

* **1. Net Revenue Retention (NRR):** Target > 115% for enterprise and > 100% for mid-market.
* **2. CAC Payback Period:** Aim for < 12 months on a gross margin-adjusted basis.
* **3. LTV / CAC Ratio:** Benchmark of 3.5x to 5x indicates sustainable marketing leverage.
* **4. Magic Number (Sales Efficiency):** \`[Net New ARR (Quarter) * 4] / [Sales & Marketing Expense (Prior Quarter)]\`. Above 0.75x is strong.
* **5. Burn Multiple:** Net Burn / Net New ARR. Below 1.5x in early stages demonstrates disciplined capital stewardship.`,
        timestamp: Date.now() - 1000 * 60 * 60 * 25,
        model: 'Dilshad AI Pro',
      },
    ],
  },
  {
    id: 'chat_yesterday_2',
    title: 'Social media captions & hooks',
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
    updatedAt: Date.now() - 1000 * 60 * 60 * 30,
    category: 'yesterday',
    modelId: 'dilshad-creative',
    messages: [
      {
        id: 'msg_5_1',
        role: 'user',
        content: 'Give me 3 viral hooks for an X/LinkedIn thread about how AI agents are transforming engineering workflows.',
        timestamp: Date.now() - 1000 * 60 * 60 * 30,
      },
      {
        id: 'msg_5_2',
        role: 'assistant',
        content: `Here are 3 high-impact hooks designed for developer engagement:

#### **Hook 1: The Contrarian Perspective**
> "Most teams think AI coding is about generating functions faster.
> 
> The real breakthrough in 2026? AI agents that delete 40% of obsolete boilerplate before you even write a test.
> 
> Here's how our team halved our PR turnaround time:"

#### **Hook 2: The Data-Driven Case Study**
> "We gave 10 senior engineers full autonomous AI copilots for 30 days.
> 
> Here is what happened to our bug velocity, cycle times, and mental fatigue (with raw telemetry data): 🧵👇"

#### **Hook 3: The Framework Teardown**
> "The 5-layer autonomous agent stack that is replacing fragile monolithic scripts in production:
> 
> 1. Intent routing
> 2. Schema-validated tool dispatch
> 3. Error recovery loops
> 4. Human-in-the-loop gates
> 5. Continuous evaluation
> 
> Let's break down each layer:"`,
        timestamp: Date.now() - 1000 * 60 * 60 * 29,
        model: 'Dilshad Creative',
      },
    ],
  },
  {
    id: 'chat_older_1',
    title: 'Python data processing script',
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    updatedAt: Date.now() - 1000 * 60 * 60 * 72,
    category: 'older',
    modelId: 'dilshad-balanced',
    messages: [
      {
        id: 'msg_6_1',
        role: 'user',
        content: 'Show me an efficient async Python script using Polars to parse 5GB CSV files with memory mapping.',
        timestamp: Date.now() - 1000 * 60 * 60 * 72,
      },
      {
        id: 'msg_6_2',
        role: 'assistant',
        content: `Here is a high-performance, memory-efficient data processing script utilizing **Polars LazyFrame** and streaming execution:

\`\`\`python
import polars as pl
from pathlib import Path

def process_large_telemetry(csv_path: str, output_parquet: str) -> None:
    """
    Processes large CSV files with zero full-file RAM memory overhead
    using Polars streaming lazy execution engine.
    """
    source_path = Path(csv_path)
    
    # 1. Initialize lazy frame without loading entire file into RAM
    lazy_df = (
        pl.scan_csv(
            source_path,
            has_header=True,
            infer_schema_length=10000,
            low_memory=True
        )
        .filter(pl.col("status_code") == 200)
        .with_columns([
            (pl.col("response_time_ms") / 1000.0).alias("response_time_sec"),
            pl.col("timestamp").str.to_datetime("%Y-%m-%d %H:%M:%S")
        ])
        .group_by(pl.col("timestamp").dt.truncate("1h"), "service_name")
        .agg([
            pl.col("response_time_sec").mean().alias("avg_latency"),
            pl.col("response_time_sec").quantile(0.99).alias("p99_latency"),
            pl.len().alias("total_requests")
        ])
        .sort("timestamp", descending=False)
    )

    # 2. Collect using the streaming query engine
    print("Executing streaming aggregation...")
    lazy_df.sink_parquet(
        output_parquet,
        compression="zstd",
        compression_level=6
    )
    print(f"Successfully wrote optimized parquet to {output_parquet}")

if __name__ == "__main__":
    process_large_telemetry("access_logs_5gb.csv", "aggregated_metrics.parquet")
\`\`\`

### Why this is optimal:
* **\`scan_csv\`** builds an execution plan and defers I/O until sink.
* **\`sink_parquet\`** streams chunks to disk with Zstandard compression, holding only active batches in memory.`,
        timestamp: Date.now() - 1000 * 60 * 60 * 71,
        model: 'Dilshad Balanced',
      },
    ],
  },
  {
    id: 'chat_older_2',
    title: 'Customer persona matrix',
    createdAt: Date.now() - 1000 * 60 * 60 * 120,
    updatedAt: Date.now() - 1000 * 60 * 60 * 120,
    category: 'older',
    modelId: 'dilshad-core',
    messages: [],
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    name: 'Brand Overhaul 2026',
    description: 'Comprehensive design system, tone guidelines, and multi-channel asset generator.',
    color: '#6366f1', // Indigo
    chatsCount: 8,
    filesCount: 14,
    updatedAt: Date.now() - 1000 * 60 * 180,
  },
  {
    id: 'proj_2',
    name: 'SaaS Growth Engine',
    description: 'B2B acquisition funnels, outbound email architectures, and conversion telemetry.',
    color: '#10b981', // Emerald
    chatsCount: 12,
    filesCount: 9,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'proj_3',
    name: 'Mobile App v2.0 Architecture',
    description: 'React Native + Expo migration specs, offline sync engine, and push notifications.',
    color: '#ec4899', // Pink
    chatsCount: 5,
    filesCount: 6,
    updatedAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: 'proj_4',
    name: 'Q3 Investor Deck & Model',
    description: 'Financial forecasting spreadsheets, TAM/SAM sizing, and unit economics breakdowns.',
    color: '#f59e0b', // Amber
    chatsCount: 15,
    filesCount: 22,
    updatedAt: Date.now() - 1000 * 60 * 60 * 72,
  },
];

export const MOCK_FILES: StoredFile[] = [
  {
    id: 'file_1',
    name: 'Q3_Financial_Forecast_v4.xlsx',
    size: 2450000,
    type: 'csv',
    uploadedAt: Date.now() - 1000 * 60 * 60 * 18,
    extension: 'xlsx',
    tags: ['Finance', 'Forecast', 'Deck'],
    summary: 'Contains pro-forma cash flow modeling, CAC payback graphs, and scenario stress tests.',
  },
  {
    id: 'file_2',
    name: 'Dilshad_Brand_Style_Guide_2026.pdf',
    size: 8900000,
    type: 'pdf',
    uploadedAt: Date.now() - 1000 * 60 * 60 * 40,
    extension: 'pdf',
    tags: ['Design', 'Brand', 'Typography'],
    summary: 'Complete typography scales, color palettes, spacing rhythm, and logo clear-space rules.',
  },
  {
    id: 'file_3',
    name: 'API_Architecture_Spec.docx',
    size: 1150000,
    type: 'docx',
    uploadedAt: Date.now() - 1000 * 60 * 60 * 60,
    extension: 'docx',
    tags: ['Engineering', 'Architecture', 'v2'],
    summary: 'Detailed GraphQL & REST endpoint specs, authentication schemes, and rate limiting rules.',
  },
  {
    id: 'file_4',
    name: 'Hero_Banner_Visual_Mockup.png',
    size: 4200000,
    type: 'image',
    uploadedAt: Date.now() - 1000 * 60 * 60 * 80,
    extension: 'png',
    tags: ['Creative', 'Assets', 'Homepage'],
    summary: 'High-res 4K dark mode hero visual featuring dynamic glass command surfaces.',
  },
  {
    id: 'file_5',
    name: 'Database_Schema_Migration.sql',
    size: 320000,
    type: 'code',
    uploadedAt: Date.now() - 1000 * 60 * 60 * 100,
    extension: 'sql',
    tags: ['Database', 'Postgres', 'Backend'],
    summary: 'DDL scripts establishing relational multi-tenant isolation with index optimizations.',
  },
];

export const MOCK_AI_TOOLS: AITool[] = [
  {
    id: 'tool_doc_analyzer',
    name: 'Smart Document Analyzer',
    description: 'Deep multi-page PDF & report synthesis with citations, discrepancy checks, and executive summaries.',
    category: 'Analysis',
    icon: 'FileSearch',
    badge: 'POPULAR',
    samplePrompt: 'Please extract the key obligations, risk flags, and milestone dates from this agreement:',
  },
  {
    id: 'tool_code_reviewer',
    name: 'Code Reviewer & Refactor',
    description: 'Audits source code for security vulnerabilities, race conditions, memory leaks, and performance gains.',
    category: 'Coding',
    icon: 'Code2',
    badge: 'DEV',
    samplePrompt: 'Review the following code for memory leaks, type safety, and edge-case error handling:',
  },
  {
    id: 'tool_copy_architect',
    name: 'SEO & Copy Architect',
    description: 'Generates high-converting landing page copy, value propositions, and search-optimized articles.',
    category: 'Writing',
    icon: 'PenTool',
    badge: 'MARKETING',
    samplePrompt: 'Write a high-converting landing page headline, 3 benefit bullet points, and an FAQ section for:',
  },
  {
    id: 'tool_business_model',
    name: 'Business Idea Validator',
    description: 'Calculates TAM, competitive moat analysis, monetization matrices, and go-to-market strategies.',
    category: 'Productivity',
    icon: 'Lightbulb',
    badge: 'STRATEGY',
    samplePrompt: 'Validate this business concept with TAM sizing, 3 biggest existential risks, and unit economics:',
  },
  {
    id: 'tool_sql_architect',
    name: 'SQL & Schema Optimizer',
    description: 'Designs normalized schemas, writes complex recursive queries, and provides index tuning advice.',
    category: 'Coding',
    icon: 'Database',
    samplePrompt: 'Write an optimized PostgreSQL query with window functions to compute monthly cohort churn:',
  },
  {
    id: 'tool_creative_story',
    name: 'Story & Narrative Engine',
    description: 'Shapes compelling brand stories, video scripts, keynote speeches, and creative narratives.',
    category: 'Creative',
    icon: 'Sparkles',
    samplePrompt: 'Draft an inspirational 3-minute keynote opening script for our annual product keynote about:',
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Dilshad AI Pro 2.5 is now active',
    description: 'Experience 2x faster reasoning with 2M token context window capabilities.',
    time: '10m ago',
    read: false,
    type: 'feature',
  },
  {
    id: 'notif_2',
    title: 'Batch file processing completed',
    description: 'Successfully indexed 4 documents in "Brand Overhaul 2026" project.',
    time: '2h ago',
    read: false,
    type: 'system',
  },
  {
    id: 'notif_3',
    title: 'Pro tip: Use Cmd+K anywhere',
    description: 'Quickly trigger commands, switch models, or start new conversations.',
    time: '1d ago',
    read: true,
    type: 'tip',
  },
];
