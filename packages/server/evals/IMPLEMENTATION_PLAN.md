# AI Agent Evaluations Implementation Plan

## Overview

Set up a comprehensive evaluation framework for the Budibase AI Agent node using **Evalite** that:

- Tests task completion, tool correctness, and response quality
- Runs LiteLLM in CI as a service, configured to route to OpenRouter
- Uses Evalite with the Vercel AI SDK integration
- Leverages existing `TestConfiguration` and `createAutomationBuilder` infrastructure

---

## Why Evaluations Matter

### The Unique Challenge with AI Agents

The AI Agent node is fundamentally different from traditional automation steps. Traditional steps are **deterministic** - a "Create Row" step either succeeds or fails. AI Agents are **non-deterministic** - the same prompt can produce different outputs, the agent might take different tool-calling paths, and "success" isn't binary.

### Key Risks Without Evaluations

| Risk                          | Impact                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------- |
| **Silent Failures**           | Agent calls wrong tool, hallucinates arguments, gives plausible but wrong answers |
| **Regression Risk**           | Prompt changes, SDK upgrades, or tool description updates can break behavior      |
| **Self-Hosted Compatibility** | No visibility into issues users encounter with their own LLM configurations       |
| **No Quality Baseline**       | Can't measure if changes improve or degrade agent performance                     |

### Self-Hosted User Considerations

With LiteLLM enabling self-hosted users to bring their own LLM, evaluations let us:

- Test against multiple LLM providers systematically
- Set a compatibility matrix for documentation
- Catch regressions before they hit self-hosted users
- Provide a subset of evals that self-hosted users can run to verify their setup

---

## Why Evalite?

Evalite was chosen over Promptfoo and DeepEval for the following reasons:

| Factor                   | Evalite                            | Promptfoo                    | DeepEval                  |
| ------------------------ | ---------------------------------- | ---------------------------- | ------------------------- |
| **Language**             | TypeScript-native                  | TypeScript (YAML-centric)    | Python                    |
| **Test Format**          | `.eval.ts` files (like `.test.ts`) | YAML config files            | Python decorators         |
| **Vercel AI SDK**        | First-class `wrapAISDKModel()`     | No direct integration        | No direct integration     |
| **Tool Call Evaluation** | Built-in `toolCallAccuracy` scorer | Custom JavaScript assertions | Built-in metrics          |
| **Built on**             | Vitest                             | Custom runner                | pytest                    |
| **Learning Curve**       | Feels like writing Jest tests      | New YAML DSL                 | Python knowledge required |

### Key Advantages

1. **You already use Vercel AI SDK** (`ToolLoopAgent` from `ai` package) - Evalite's integration works natively
2. **`toolCallAccuracy` scorer** - Built specifically for agent tool-calling evaluation
3. **TypeScript-native** - Team writes `.eval.ts` files just like `.spec.ts` files
4. **Built on Vitest** - Can use mocks, fixtures, and the same patterns as existing tests
5. **Beautiful local UI** - Interactive dev server at localhost:3006 while developing

---

## Architecture

```
packages/server/
├── evals/
│   ├── evalite.config.ts              # Evalite configuration
│   ├── setup/
│   │   └── eval-context.ts            # TestConfiguration + agent setup
│   ├── agent-task-completion.eval.ts  # Task completion evals
│   ├── agent-tool-correctness.eval.ts # Tool calling evals
│   └── agent-response-quality.eval.ts # Response quality evals

.github/workflows/
└── agent-evals.yml                    # GitHub Actions with LiteLLM service
```

---

## How It Works on CI

### The Two LLM Roles

| Role          | Purpose                                            | Configuration        |
| ------------- | -------------------------------------------------- | -------------------- |
| **Agent LLM** | The LLM your agent uses to reason and call tools   | LiteLLM → OpenRouter |
| **Judge LLM** | The LLM that evaluates if the agent did a good job | LiteLLM → OpenRouter |

### CI Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        GitHub Actions CI                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. LiteLLM service starts (Docker container)                        │
│  2. LiteLLM configured with OpenRouter as backend                    │
│  3. Evalite runs test cases                                          │
│     ↓                                                                │
│  4. For each test case:                                              │
│     ┌──────────────────────────────────────────────────────────┐    │
│     │  Your Agent (via TestConfiguration)                       │    │
│     │  → LiteLLM → OpenRouter → LLM response                    │    │
│     │  → Agent returns response + tool calls                    │    │
│     └──────────────────────────────────────────────────────────┘    │
│     ↓                                                                │
│  5. Evalite scorers evaluate the output                              │
│     ┌──────────────────────────────────────────────────────────┐    │
│     │  Judge LLM (via LiteLLM → OpenRouter)                     │    │
│     │  → Returns score (0-1)                                    │    │
│     └──────────────────────────────────────────────────────────┘    │
│     ↓                                                                │
│  6. Evalite aggregates scores, checks threshold                      │
│  7. Exit 0 (pass) or Exit 1 (fail)                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. GitHub Actions Workflow

**File:** `.github/workflows/agent-evals.yml`

```yaml
name: "AI Agent Evaluations"

on:
  pull_request:
    paths:
      - "packages/server/src/automations/steps/ai/**"
      - "packages/server/src/sdk/workspace/ai/**"
      - "packages/server/src/ai/**"
      - "packages/server/evals/**"
  workflow_dispatch:

jobs:
  evaluate:
    runs-on: ubuntu-latest

    services:
      litellm:
        image: ghcr.io/berriai/litellm:main-latest
        ports:
          - 4000:4000
        env:
          LITELLM_MASTER_KEY: sk-eval-master-key

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "yarn"

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build packages
        run: yarn build

      - name: Wait for LiteLLM
        run: |
          timeout 60 bash -c 'until curl -s http://localhost:4000/health > /dev/null 2>&1; do sleep 2; done'
          echo "LiteLLM is ready"

      - name: Configure LiteLLM with OpenRouter model
        run: |
          # Add eval model (for judge)
          curl -X POST http://localhost:4000/model/new \
            -H "Authorization: Bearer sk-eval-master-key" \
            -H "Content-Type: application/json" \
            -d '{
              "model_name": "eval-model",
              "litellm_params": {
                "model": "openrouter/anthropic/claude-3.5-sonnet",
                "api_key": "'$OPENROUTER_API_KEY'"
              }
            }'

          # Add agent model
          curl -X POST http://localhost:4000/model/new \
            -H "Authorization: Bearer sk-eval-master-key" \
            -H "Content-Type: application/json" \
            -d '{
              "model_name": "agent-model", 
              "litellm_params": {
                "model": "openrouter/openai/gpt-4o-mini",
                "api_key": "'$OPENROUTER_API_KEY'"
              }
            }'
        env:
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}

      - name: Run agent evaluations
        run: npx evalite --threshold=70
        working-directory: packages/server
        env:
          LITELLM_URL: http://localhost:4000
          LITELLM_MASTER_KEY: sk-eval-master-key
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}

      - name: Export eval UI
        if: always()
        run: npx evalite export --output=./eval-export
        working-directory: packages/server

      - name: Upload eval results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: evalite-results
          path: packages/server/eval-export
```

---

### 2. Evalite Config

**File:** `evals/evalite.config.ts`

```typescript
import { defineConfig } from "evalite/config"

export default defineConfig({
  scoreThreshold: 70, // Fail CI if average score < 70%
})
```

---

### 3. Eval Context Setup

**File:** `evals/setup/eval-context.ts`

Reuses existing `TestConfiguration` infrastructure:

```typescript
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { features } from "@budibase/backend-core"
import {
  FeatureFlag,
  Agent,
  Table,
  Row,
  CustomAIProviderConfig,
} from "@budibase/types"
import { createAutomationBuilder } from "../../automations/tests/utilities/AutomationTestBuilder"
import sdk from "../../sdk"

export interface EvalContext {
  config: TestConfiguration
  agent: Agent
  aiConfig: CustomAIProviderConfig
  table: Table
  rows: Row[]
}

let cachedContext: EvalContext | null = null

export async function getEvalContext(): Promise<EvalContext> {
  if (cachedContext) return cachedContext

  const config = new TestConfiguration()
  await config.init()

  // Create a test table with sample data
  const table = await config.createTable({
    name: "customers",
    schema: {
      name: { type: "string", name: "name", constraints: { presence: true } },
      email: { type: "string", name: "email" },
      status: { type: "string", name: "status" },
    },
  })

  // Create sample rows
  const rows = [
    await config.api.row.save(table._id!, {
      name: "John Smith",
      email: "john@example.com",
      status: "active",
    }),
    await config.api.row.save(table._id!, {
      name: "Jane Doe",
      email: "jane@example.com",
      status: "inactive",
    }),
    await config.api.row.save(table._id!, {
      name: "Bob Wilson",
      email: "bob@example.com",
      status: "active",
    }),
  ]

  // Create AI config pointing to LiteLLM's agent model
  const aiConfig = await config.api.ai.createConfig({
    name: "eval-ai-config",
    provider: "custom",
    model: "agent-model",
    isDefault: true,
  })

  // Create the test agent with Budibase tools enabled
  const agent = await sdk.ai.agents.create({
    name: "Eval Test Agent",
    aiconfig: aiConfig._id!,
    promptInstructions: `You are a helpful assistant that can interact with the Budibase database.
You have access to tools to list tables, query rows, create rows, update rows, and delete rows.
Always use the appropriate tool to answer questions about data.`,
    enabledTools: [
      "list_tables",
      "query_rows",
      "create_row",
      "update_row",
      "delete_row",
    ],
    live: true,
  })

  cachedContext = { config, agent, aiConfig, table, rows }
  return cachedContext
}

export async function runAgentPrompt(prompt: string): Promise<{
  success: boolean
  response: string
  steps: any[]
}> {
  const { config, agent } = await getEvalContext()

  return await features.testutils.withFeatureFlags(
    config.getTenantId(),
    { [FeatureFlag.AI_AGENTS]: true },
    async () => {
      const results = await createAutomationBuilder(config)
        .onAppAction()
        .agent({ agentId: agent._id!, prompt })
        .test({ fields: {} })

      return {
        success: results.steps[0].outputs.success,
        response: results.steps[0].outputs.response || "",
        steps: results.steps[0].outputs.steps || [],
      }
    }
  )
}

export async function cleanupEvalContext() {
  if (cachedContext) {
    await cachedContext.config.end()
    cachedContext = null
  }
}
```

---

### 4. Task Completion Eval

**File:** `evals/agent-task-completion.eval.ts`

```typescript
import { evalite } from "evalite"
import { answerCorrectness } from "evalite/scorers"
import { wrapAISDKModel } from "evalite/ai-sdk"
import { createOpenAI } from "@ai-sdk/openai"
import {
  runAgentPrompt,
  getEvalContext,
  cleanupEvalContext,
} from "./setup/eval-context"

// Judge model - calls LiteLLM which routes to OpenRouter
const litellm = createOpenAI({
  apiKey: process.env.LITELLM_MASTER_KEY || "sk-eval-master-key",
  baseURL: process.env.LITELLM_URL || "http://localhost:4000",
})
const judgeModel = wrapAISDKModel(litellm.chat("eval-model"))

evalite("Agent Task Completion", {
  data: async () => {
    await getEvalContext()

    return [
      {
        input: "List all tables in the database",
        expected: "A list containing the 'customers' table",
      },
      {
        input: "Show me all customers",
        expected:
          "A list of customer records including John Smith, Jane Doe, and Bob Wilson",
      },
      {
        input: "Find customers with status 'active'",
        expected:
          "A filtered list showing only active customers (John Smith and Bob Wilson)",
      },
      {
        input: "How many customers do we have?",
        expected: "The count should be 3 customers",
      },
      {
        input:
          "Create a new customer named Alice Brown with email alice@test.com and status pending",
        expected:
          "Confirmation that a new customer row was created with the specified data",
      },
    ]
  },

  task: async input => {
    const result = await runAgentPrompt(input)
    return result.response
  },

  scorers: [
    {
      name: "Task Completed",
      description: "Did the agent accomplish the user's goal?",
      scorer: async ({ input, output, expected }) => {
        return answerCorrectness({
          question: input,
          answer: output,
          groundTruth: [expected],
          model: judgeModel,
        })
      },
    },
  ],

  afterAll: cleanupEvalContext,
})
```

---

### 5. Tool Correctness Eval

**File:** `evals/agent-tool-correctness.eval.ts`

```typescript
import { evalite } from "evalite"
import { toolCallAccuracy } from "evalite/scorers/deterministic"
import {
  runAgentPrompt,
  getEvalContext,
  cleanupEvalContext,
} from "./setup/eval-context"

evalite("Agent Tool Correctness", {
  data: async () => {
    await getEvalContext()

    return [
      {
        input: "List all tables",
        expectedTools: [{ toolName: "list_tables" }],
      },
      {
        input: "Show me all customers",
        expectedTools: [{ toolName: "query_rows" }],
      },
      {
        input:
          "Create a new customer named Test User with email test@example.com",
        expectedTools: [{ toolName: "create_row" }],
      },
      {
        input:
          "Find the customer named John Smith and update their status to 'vip'",
        expectedTools: [{ toolName: "query_rows" }, { toolName: "update_row" }],
      },
      {
        input: "Delete all inactive customers",
        expectedTools: [{ toolName: "query_rows" }, { toolName: "delete_row" }],
      },
    ]
  },

  task: async input => {
    const result = await runAgentPrompt(input)

    // Extract tool calls from agent steps
    const toolCalls =
      result.steps?.flatMap(
        step =>
          step.toolCalls?.map((tc: any) => ({
            toolName: tc.toolName,
            input: tc.args,
          })) || []
      ) || []

    return {
      response: result.response,
      toolCalls,
    }
  },

  scorers: [
    {
      name: "Correct Tools Called",
      description: "Did the agent call the expected tools?",
      scorer: ({ output, expected }) => {
        return toolCallAccuracy({
          actualCalls: output.toolCalls,
          expectedCalls: expected.expectedTools,
          mode: "flexible", // Order doesn't matter
        })
      },
    },
  ],

  afterAll: cleanupEvalContext,
})
```

---

### 6. Response Quality Eval

**File:** `evals/agent-response-quality.eval.ts`

```typescript
import { evalite } from "evalite"
import { answerRelevancy } from "evalite/scorers"
import { wrapAISDKModel } from "evalite/ai-sdk"
import { createOpenAI } from "@ai-sdk/openai"
import {
  runAgentPrompt,
  getEvalContext,
  cleanupEvalContext,
} from "./setup/eval-context"

const litellm = createOpenAI({
  apiKey: process.env.LITELLM_MASTER_KEY || "sk-eval-master-key",
  baseURL: process.env.LITELLM_URL || "http://localhost:4000",
})
const judgeModel = wrapAISDKModel(litellm.chat("eval-model"))

evalite("Agent Response Quality", {
  data: async () => {
    await getEvalContext()

    return [
      { input: "What tables exist and what data do they contain?" },
      { input: "Summarize the customer data for me" },
      { input: "Which customers are currently active?" },
      { input: "Give me an overview of the database structure" },
    ]
  },

  task: async input => {
    const result = await runAgentPrompt(input)
    return result.response
  },

  scorers: [
    {
      name: "Relevancy",
      description: "Did the agent answer the actual question asked?",
      scorer: async ({ input, output }) => {
        return answerRelevancy({
          question: input,
          answer: output,
          model: judgeModel,
        })
      },
    },
  ],

  afterAll: cleanupEvalContext,
})
```

---

## NPM Scripts

Add to `packages/server/package.json`:

```json
{
  "scripts": {
    "eval": "evalite",
    "eval:dev": "evalite watch",
    "eval:ci": "evalite --threshold=70 --no-cache"
  }
}
```

---

## Dependencies

Add to `packages/server`:

```bash
yarn add -D evalite @ai-sdk/openai
```

---

## CI Secrets Required

| Secret               | Purpose                                               |
| -------------------- | ----------------------------------------------------- |
| `OPENROUTER_API_KEY` | Used by LiteLLM to route model requests to OpenRouter |

---

## Local Development

To run evals locally, you'll need LiteLLM running:

```bash
# Terminal 1: Start LiteLLM
docker run -p 4000:4000 -e LITELLM_MASTER_KEY=sk-local-key ghcr.io/berriai/litellm:main-latest

# Terminal 2: Configure LiteLLM with your OpenRouter key
curl -X POST http://localhost:4000/model/new \
  -H "Authorization: Bearer sk-local-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model_name": "eval-model",
    "litellm_params": {
      "model": "openrouter/anthropic/claude-3.5-sonnet",
      "api_key": "YOUR_OPENROUTER_KEY"
    }
  }'

curl -X POST http://localhost:4000/model/new \
  -H "Authorization: Bearer sk-local-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model_name": "agent-model",
    "litellm_params": {
      "model": "openrouter/openai/gpt-4o-mini",
      "api_key": "YOUR_OPENROUTER_KEY"
    }
  }'

# Terminal 2: Run evals
cd packages/server
LITELLM_URL=http://localhost:4000 LITELLM_MASTER_KEY=sk-local-key yarn eval:dev
```

---

## Cost Estimate

| Component                         | Tokens/Run (est.) | Cost (Claude 3.5 Sonnet) |
| --------------------------------- | ----------------- | ------------------------ |
| Agent LLM calls (~15 test cases)  | ~50k tokens       | ~$0.40                   |
| Judge LLM calls (~15 evaluations) | ~25k tokens       | ~$0.20                   |
| **Total per CI run**              | ~75k tokens       | **~$0.60**               |

---

## Implementation Steps

| Step | Task                                               | Estimated Time |
| ---- | -------------------------------------------------- | -------------- |
| 1    | Add `evalite` and `@ai-sdk/openai` to package.json | 5 min          |
| 2    | Create `evals/` folder structure                   | 5 min          |
| 3    | Create `evalite.config.ts`                         | 5 min          |
| 4    | Implement `evals/setup/eval-context.ts`            | 45 min         |
| 5    | Write `agent-task-completion.eval.ts`              | 30 min         |
| 6    | Write `agent-tool-correctness.eval.ts`             | 30 min         |
| 7    | Write `agent-response-quality.eval.ts`             | 30 min         |
| 8    | Create `.github/workflows/agent-evals.yml`         | 30 min         |
| 9    | Add npm scripts to package.json                    | 5 min          |
| 10   | Add `OPENROUTER_API_KEY` to GitHub repo secrets    | 5 min          |
| 11   | Test locally with LiteLLM running                  | 1-2 hours      |
| 12   | Test CI workflow                                   | 30 min         |

**Total Estimated Time: 5-7 hours**

---

## Open Items

1. **LiteLLM Secret Key Setup**: The `getLiteLLMSecretKey()` function reads from `configs.getSettingsConfigDoc()`. The eval context setup may need to seed this config.

2. **Tool Names**: Verify exact tool names from the `budibaseTools` definition match what's used in test cases.

3. **Threshold**: Starting at 70%. Can adjust after seeing initial results.

4. **Additional Test Cases**: Initial set has ~15 test cases. Can expand based on real failure patterns.

---

## Future Extensions

Once the basic framework is in place:

1. **Multi-LLM Compatibility Testing**: Run same test cases against different provider models
2. **Cost/Efficiency Metrics**: Track token usage and step counts to optimize prompts
3. **Regression Baselines**: Store historical results to detect quality degradation
4. **Self-Hosted Verification**: Provide a subset of evals that self-hosted users can run
