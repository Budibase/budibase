export type BudibaseAIProvider = "openai" | "openrouter"

export interface BudibaseAIModel {
  id: string
  provider: BudibaseAIProvider
  model: string
  label: string
}

export const BUDIBASE_AI_MODELS: BudibaseAIModel[] = [
  {
    id: "budibase/v1",
    provider: "openrouter",
    model: "google/gemini-3-flash-preview",
    label: "Gemini 3 Flash",
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
