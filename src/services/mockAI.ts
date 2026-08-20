import { Attachment } from '../types';

export interface AIResponsePayload {
  content: string;
  reasoning?: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export async function getMockAIResponse(
  prompt: string,
  modelId: string = 'dilshad-pro',
  attachments: Attachment[] = [],
  options?: {
    webSearch?: boolean;
    deepReasoning?: boolean;
  }
): Promise<AIResponsePayload> {
  const lower = prompt.toLowerCase();

  let reasoning = options?.deepReasoning
    ? `> **Thought Process:**\n> 1. Evaluated query intent: "${prompt.slice(0, 60)}..."\n> 2. Cross-referenced relevant domain ontologies and best-practice principles.\n> 3. Synthesized structured output with clear hierarchy, practical examples, and actionable takeaways.`
    : undefined;

  let content = '';

  // 1. Suggestions and common queries
  if (lower.includes('professional email') || lower.includes('create an email') || lower.includes('draft email')) {
    content = `Here is a polished, high-impact executive email draft:

---

**Subject:** Strategic Partnership Proposal: Accelerating Q3 Enterprise AI Rollout

**Dear [Recipient Name],**

I hope this week is treating you well.

Following up on our brief conversation at the Global Tech Summit, I wanted to share a structured overview of how our organizations can collaborate to accelerate your team's workflow automation goals.

Over the past quarter, our enterprise partners have achieved:
* **42% reduction** in manual document synthesis turnaround times
* **Zero-loss knowledge retrieval** across distributed codebases and documentation
* **End-to-end SOC2 Type II compliance** with localized private deployment tiers

I've attached our 3-page technical brief for your review. Would you or your technical lead be available for a focused 15-minute sync next **Tuesday at 10:00 AM PST** or **Thursday at 2:00 PM PST**?

Looking forward to hearing your thoughts.

Warm regards,

**Dilshad Developer**  
*Lead Solutions Architect, Dilshad AI*  
[dilshad@workspace.ai](mailto:dilshad@workspace.ai) | [+1 (555) 019-2834](tel:+15550192834)`;
  } else if (lower.includes('10 business ideas') || lower.includes('business ideas') || lower.includes('startup ideas')) {
    content = `Here are **10 high-potential, defensible business ideas** built for the 2026 AI-native ecosystem:

### 1. Autonomous Compliance & Audit Agents (Fintech & Healthtech)
* **Value Prop:** Real-time SOC2, HIPAA, and GDPR audit telemetry that automatically flags non-compliant commits and writes remediation PRs.
* **Target Audience:** Series A–C SaaS engineering teams.
* **Monetization:** $1.5k–$5k/month per repository.

### 2. Hyper-Personalized Technical Curriculum Builder
* **Value Prop:** Analyzes an engineer's GitHub commits and Slack questions, dynamically generating interactive code katas to close individual knowledge gaps.
* **Target Audience:** Enterprise L&D departments and self-taught developers.

### 3. Spatial Video Commerce Platform
* **Value Prop:** AI-assisted conversion of 2D product photos into photorealistic 3D spatial interactive assets for Apple Vision Pro and web viewports.

### 4. Smart Supply Chain Disruption Predictor
* **Value Prop:** Correlates maritime satellite feeds, weather patterns, and port customs APIs to reroute logistics shipments before bottlenecks occur.

### 5. AI Voice Agent Quality & Hallucination Firewall
* **Value Prop:** Low-latency proxy layer that intercepts real-time voice and telephony agents, preventing hallucinations and policy breaches in sub-50ms.

### 6. Architectural Energy Optimization Twin
* **Value Prop:** Ingests building CAD schematics and IoT thermal sensor streams to reduce commercial HVAC power bills by up to 28%.

### 7. AI Synthetic User Testing Laboratory
* **Value Prop:** Simulates 500 diverse user personas simultaneously testing new web app onboarding funnels, returning video heatmap replay predictions.

### 8. Fractional Executive AI Orchestrator
* **Value Prop:** Auto-synthesizes board updates, OKR alignment check-ins, and cash runway burn calculations for early-stage founders.

### 9. Real-Time Legal Redlining for Freelancers & Agencies
* **Value Prop:** One-click contract risk scoring that flags predatory indemnification clauses, payment terms, and intellectual property transfers.

### 10. Localized Edge AI Appliance for Sovereign Data
* **Value Prop:** Plug-and-play desktop rack server pre-loaded with quantized reasoning models for clinics and law firms with zero cloud outbound connections.`;
  } else if (lower.includes('quantum computing') || lower.includes('explain quantum')) {
    content = `### Quantum Computing Explained in Plain English

Imagine you're searching for your car keys in a massive 1,000-room hotel:

#### 1. The Classical Computer (Standard Bits)
A traditional computer is like a single detective running through the hotel. It opens Room 1, checks for keys, shuts the door, opens Room 2, and so on. If there are 1,000 rooms, it has to inspect them **one by one**.
* A classical bit is either **0 (Door Closed)** or **1 (Door Open)**.

#### 2. The Quantum Computer (Qubits & Superposition)
A quantum computer is like flooding the entire hotel with water simultaneously. It doesn't check one room at a time—because of a quantum property called **Superposition**, a qubit can be in a blend of 0 and 1 at the same time.
* It explores **all 1,000 rooms in parallel**, instantly finding the path of least resistance to where the keys are located.

---

### Core Quantum Concepts:

| Concept | Everyday Analogy | What it Enables |
| :--- | :--- | :--- |
| **Superposition** | A spinning coin (heads and tails simultaneously until caught) | Massive parallel search spaces |
| **Entanglement** | Two magic dice (roll one in Tokyo, the other in London always matches) | Instantaneous coordinated state transfer |
| **Quantum Decoherence** | A fragile bubble bursting from vibrations | The biggest engineering challenge: keeping qubits cold (-273°C) |

#### Where will this actually matter?
* **Medicine:** Simulating molecular drug interactions in seconds rather than decades.
* **Logistics:** Perfecting global flight routing and container ship packing.
* **Materials Science:** Inventing room-temperature superconductors and ultra-dense batteries.`;
  } else if (lower.includes('summarize') || lower.includes('pdf') || (attachments && attachments.length > 0)) {
    const fileNames = attachments.map((a) => a.name).join(', ') || 'uploaded document';
    content = `### Document Analysis & Executive Synthesis

**Source Analyzed:** \`${fileNames}\`  
**Processed Tokens:** 14,820 tokens across structured sections.

---

### Executive Summary
The document establishes an operational and architectural blueprint designed to elevate system resilience, streamline cross-functional collaboration, and enforce rigorous governance standards.

### Key Takeaways & Findings:
1. **Strategic Priority:** Prioritizes shifting from reactive maintenance to proactive automated validation loops.
2. **Resource Allocation:** 40% of technical resources are earmarked for API hardening and latency optimization.
3. **Risk Mitigation:** Identifies single points of failure in legacy data pipelines and recommends decoupled asynchronous queues.

### Critical Action Items:
* [x] **Phase 1 (Month 1):** Complete security boundary audit and token rotation schedule.
* [ ] **Phase 2 (Month 2–3):** Deploy containerized worker services with auto-scaling triggers.
* [ ] **Phase 3 (Month 4):** Conduct end-to-end stress testing under 10x projected peak load.

> *Recommendation:* Proceed with Phase 1 immediately while finalizing SLA metrics for vendor dependencies.`;
  } else if (lower.includes('product description') || lower.includes('write a product')) {
    content = `## **Aether Ultra** — *Minimalist Ergonomics, Precision Engineering.*

Elevate your workspace with the **Aether Ultra Mechanical Keyboard**. Sculpted from an aerospace-grade CNC aluminum unibody, it unites tactile acoustic satisfaction with ultra-low 0.5ms wireless latency.

---

### Why You'll Love It:
* **Gasket-Mounted Precision:** Multi-layer Poron foam dampening delivers a deep, satisfying acoustic profile without fatigue.
* **Hot-Swappable Switches:** Custom factory-lubricated linear switches rated for 100M actuations.
* **Tri-Mode Wireless:** Instant Bluetooth 5.4, 2.4GHz ultra-fast dongle, and braided Type-C connectivity.
* **180-Hour Battery Life:** Smart ambient sensor powers down backlights when your hands leave the keys.

**In the Box:** Keyboard, braided coil cable, switch puller, 4 accent keycaps, 2.4GHz nano receiver.`;
  } else if (lower.includes('code') || lower.includes('react') || lower.includes('typescript') || lower.includes('function') || lower.includes('component')) {
    content = `Here is a clean, production-ready TypeScript implementation with strict typing, error boundaries, and reactive state management:

\`\`\`typescript
import React, { useState, useEffect, useCallback } from 'react';

interface UseDebounceProps<T> {
  value: T;
  delayMs: number;
}

/**
 * Custom hook for debouncing high-frequency state updates (e.g. search inputs)
 */
export function useDebounce<T>({ value, delayMs = 300 }: UseDebounceProps<T>): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

// Example Component Usage:
export const SearchFilterComponent: React.FC = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce({ value: query, delayMs: 400 });

  const handleSearch = useCallback((searchTerm: string) => {
    console.log('Dispatching optimized query:', searchTerm);
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery, handleSearch]);

  return (
    <div className="flex flex-col gap-2 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
        Live Filter
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to filter records..."
        className="px-3 py-2 bg-neutral-950 text-white rounded-lg border border-neutral-700 focus:outline-none focus:border-indigo-500 transition-colors"
      />
    </div>
  );
};
\`\`\`

### Key Design Considerations:
1. **Memory Safety:** Automatically cleans up pending timers on component unmount or rapid keystroke revisions.
2. **Generic Typing:** Accepts any generic data type (\`string\`, \`number\`, \`object\`) seamlessly.`;
  } else {
    // General high-quality conversational response
    content = `I'd be glad to help you with that!

Here is a structured, in-depth breakdown addressing your inquiry:

### 1. Key Principles & Core Foundation
When approaching this objective, it is essential to balance **immediate execution velocity** with **long-term maintainability**:

* **Clarity of Purpose:** Define explicit criteria for what constitutes a successful outcome.
* **Iterative Refinement:** Break down complex goals into modular, testable milestones.
* **Automation & Feedback Loops:** Leverage intelligent tooling to catch discrepancies early.

### 2. Recommended Action Plan

| Phase | Objective | Deliverable |
| :--- | :--- | :--- |
| **Discovery** | Clarify scope, gather baseline metrics | Architecture & Spec Document |
| **Execution** | Implement core functionality iteratively | Alpha Prototype |
| **Validation** | Stress-test with real workloads & feedback | Production Release |

### 3. Next Steps
How would you like to proceed?
1. **Deepen the technical implementation** with detailed code/examples
2. **Draft a structured executive brief** or presentation outline
3. **Explore alternative strategies** and risk mitigation options`;
  }

  // Token count calculation
  const promptTokens = Math.ceil(prompt.length / 4) + (attachments.length * 250);
  const completionTokens = Math.ceil(content.length / 4);

  return {
    content,
    reasoning,
    tokens: {
      prompt: promptTokens,
      completion: completionTokens,
      total: promptTokens + completionTokens,
    },
  };
}
