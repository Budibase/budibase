export type BudibaseAIProvider = "openai" | "mistral"

export interface BudibaseAIModel {
  id: string
  provider: BudibaseAIProvider
  model: string
  label: string
}

export const BUDIBASE_AI_MODELS: BudibaseAIModel[] = [
  {
    id: "budibase/v1",
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
