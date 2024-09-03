export const Providers = {
  OpenAI: {
    name: "OpenAI",
    models: [
      {label: "GPT 4o Mini", value: "gpt-4o-mini" },
      {label: "GPT 4o", value: "gpt-4o" },
      {label: "GPT 4 Turbo", value: "gpt-4-turbo" },
      {label: "GPT 4", value: "gpt-4" },
      {label: "GPT 3.5 Turbo", value: "gpt-3.5-turbo" },
    ]
  },
  Anthropic: {
    name: "Anthropic",
    models: [
      {label: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet-20240620" },
      {label: "Claude 3 Sonnet", value: "claude-3-sonnet-20240229" },
      {label: "Claude 3 Opus", value: "claude-3-opus-20240229" },
      {label: "Claude 3 Haiku", value: "claude-3-haiku-20240307" },
    ]
  },
  TogetherAI: {
    name: "Together AI",
    // TODO: too many - probably need to use an autocomplete for this
    models: [
      {label: "GPT 4o Mini", value: "gpt-4o-mini" },
      {label: "GPT 4o", value: "gpt-4o" },
      {label: "GPT 4 Turbo", value: "gpt-4-turbo" },
      {label: "GPT 4", value: "gpt-4" },
      {label: "GPT 3.5 Turbo", value: "gpt-3.5-turbo" },
    ]
  },
  AzureOpenAI: {
    name: "Azure Open AI",
    models: [
      {label: "GPT 4o Mini", value: "gpt-4o-mini" },
      {label: "GPT 4o", value: "gpt-4o" },
      {label: "GPT 4 Turbo", value: "gpt-4-turbo" },
      {label: "GPT 4", value: "gpt-4" },
      {label: "GPT 3.5 Turbo", value: "gpt-3.5-turbo" },
    ]
  },
  Custom: {
    name: "Custom",
  },
}

export const ConfigMap = {
  OpenAI: {
    name: "OpenAI",
    baseUrl: "https://api.openai.com",
  },
  Anthropic: {
    name: "Anthropic",
    baseUrl: "",
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
    baseUrl: ""
  }
}