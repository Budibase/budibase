import { AIProvider, ProviderConfig } from "@budibase/types"

export const Models = [
  { label: "GPT 4o Mini", value: "gpt-4o-mini" },
  { label: "GPT 4o", value: "gpt-4o" },
  { label: "GPT 5", value: "gpt-5" },
  { label: "GPT 5 Mini", value: "gpt-5-mini" },
  { label: "GPT 5 Nano", value: "gpt-5-nano" },
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
