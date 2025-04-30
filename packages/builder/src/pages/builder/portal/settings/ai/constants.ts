import { AIProvider, ProviderConfig } from "@budibase/types"

export const Models = [
  { label: "GPT 4o Mini", value: "gpt-4o-mini" },
  { label: "GPT 4o", value: "gpt-4o" },
  { label: "GPT 4 Turbo", value: "gpt-4-turbo" },
  { label: "GPT 4", value: "gpt-4" },
  { label: "GPT 3.5 Turbo", value: "gpt-3.5-turbo" },
]

interface AIProviderDetails {
  defaultConfig: ProviderConfig
  models: { label: string; value: string }[]
}

export const ProviderDetails: Partial<Record<AIProvider, AIProviderDetails>> = {
  BudibaseAI: {
    defaultConfig: {
      name: "Budibase AI",
      provider: "BudibaseAI",
      active: false,
      isDefault: false,
    },
    models: [],
  },
  OpenAI: {
    defaultConfig: {
      name: "OpenAI",
      provider: "OpenAI",
      active: false,
      isDefault: false,
      baseUrl: "https://api.openai.com",
    },
    models: Models,
  },
  AzureOpenAI: {
    defaultConfig: {
      name: "Azure OpenAI",
      provider: "AzureOpenAI",
      active: false,
      isDefault: false,
    },
    models: Models,
  },
}

export const ConfigMap = {
  OpenAI: {
    name: "OpenAI",
    baseUrl: "https://api.openai.com",
  },
  Anthropic: {
    name: "Anthropic",
    baseUrl: "https://api.anthropic.com/v1",
  },
  TogetherAI: {
    name: "TogetherAI",
    baseUrl: "https://api.together.xyz/v1",
  },
  AzureOpenAI: {
    name: "Azure OpenAI",
    baseUrl: "",
  },
  Custom: {
    baseUrl: "",
  },
}
