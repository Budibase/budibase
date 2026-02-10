export type BudibaseAIProvider = "openai" | "mistral"

export interface BudibaseAIModel {
  id: string
  provider: BudibaseAIProvider
  model: string
  label: string
}

export const BUDIBASE_AI_MODELS: BudibaseAIModel[] = [
  {
    id: "budibase/gpt-5",
    provider: "openai",
    model: "gpt-5.2",
    label: "GPT 5.2",
  },
  {
    id: "budibase/gpt-5-mini",
    provider: "openai",
    model: "gpt-5-mini",
    label: "GPT 5 Mini",
  },
  {
    id: "budibase/gpt-5-nano",
    provider: "openai",
    model: "gpt-5-nano",
    label: "GPT 5 Nano",
  },
  {
    id: "budibase/mistral-small-latest",
    provider: "mistral",
    model: "mistral-small-latest",
    label: "Mistral small",
  },
  {
    id: "budibase/mistral-medium-latest",
    provider: "mistral",
    model: "mistral-medium-latest",
    label: "Mistral medium",
  },
  {
    id: "budibase/mistral-large-latest",
    provider: "mistral",
    model: "mistral-large-latest",
    label: "Mistral large",
  },
]

export const BUDIBASE_AI_MODEL_MAP: Record<
  string,
  { provider: BudibaseAIProvider; model: string }
> = BUDIBASE_AI_MODELS.reduce(
  (acc, entry) => {
    acc[entry.id] = { provider: entry.provider, model: entry.model }
    return acc
  },
  {} as Record<string, { provider: BudibaseAIProvider; model: string }>
)
