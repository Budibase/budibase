export const BBAI_KEY = "BudibaseAI"
export const OPENAI_KEY = "OpenAI"
export const AZURE_KEY = "AzureOpenAI"

export const Providers = {
  BudibaseAI: "BudibaseAI",
  OpenAI: "OpenAI",
  AzureOpenAI: "AzureOpenAI",
}

export const Models = [
  { label: "GPT 4o Mini", value: "gpt-4o-mini" },
  { label: "GPT 4o", value: "gpt-4o" },
  { label: "GPT 4 Turbo", value: "gpt-4-turbo" },
  { label: "GPT 4", value: "gpt-4" },
  { label: "GPT 3.5 Turbo", value: "gpt-3.5-turbo" },
]

export const ProviderDetails = {
  [BBAI_KEY]: {
    provider: "BudibaseAI",
    name: "BB AI",
    defaultConfig: {
      active: false,
      isDefault: false,
    },
    models: [],
  },
  [OPENAI_KEY]: {
    provider: "OpenAI",
    name: "OpenAI",
    baseUrl: "https://api.openai.com",
    defaultConfig: {
      active: false,
      isDefault: false,
      apiKey: "",
      baseUrl: "https://api.openai.com",
      defaultModel: "",
    },
    models: [
      { label: "GPT 4o Mini", value: "gpt-4o-mini" },
      { label: "GPT 4o", value: "gpt-4o" },
      { label: "GPT 4 Turbo", value: "gpt-4-turbo" },
      { label: "GPT 4", value: "gpt-4" },
      { label: "GPT 3.5 Turbo", value: "gpt-3.5-turbo" },
    ],
  },
  [AZURE_KEY]: {
    provider: "AzureOpenAI",
    name: "Azure OpenAI",
    baseUrl: "",
    defaultConfig: {
      active: false,
      isDefault: false,
      apiKey: "",
      baseUrl: "",
      defaultModel: "",
    },
    models: [
      { label: "GPT 4o Mini", value: "gpt-4o-mini" },
      { label: "GPT 4o", value: "gpt-4o" },
      { label: "GPT 4 Turbo", value: "gpt-4-turbo" },
      { label: "GPT 4", value: "gpt-4" },
      { label: "GPT 3.5 Turbo", value: "gpt-3.5-turbo" },
    ],
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
