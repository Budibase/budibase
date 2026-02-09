export type BudibaseAIProvider = "openai" | "mistral"

export interface BudibaseAIModel {
  id: string
  provider: BudibaseAIProvider
  model: string
  label: string
}

export const BUDIBASE_AI_MODELS: BudibaseAIModel[] = [
  {
    id: "budibase/gpt-4o-mini",
    provider: "openai",
    model: "gpt-4o-mini",
    label: "GPT 4o Mini",
  },
  {
    id: "budibase/gpt-4o",
    provider: "openai",
    model: "gpt-4o",
    label: "GPT 4o",
  },
  {
    id: "budibase/gpt-5",
    provider: "openai",
    model: "gpt-5",
    label: "GPT 5",
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
