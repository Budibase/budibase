export const Providers = {
  OpenAI: {
    name: "OpenAI",
    models: [
      "gpt-4o-mini",
      "gpt-4o",
      "gpt-3.5-turbo",
      "chatgpt-4o-latest",
      "gpt-4-turbo",
      "gpt-4",
    ]
  },
  Anthropic: {
    name: "Anthropic",
    models: [
      "claude-3-5-sonnet-20240620",
      "claude-3-sonnet-20240229",
      "claude-3-opus-20240229",
      "claude-3-haiku-20240307"
    ]
  },
  TogetherAI: {
    name: "Together AI",
    // TODO: too many - probably need to use an autocomplete for this
    models: [
      "gpt-4o-mini",
      "gpt-4o",
      "gpt-3.5-turbo",
      "chatgpt-4o-latest",
      "gpt-4-turbo",
      "gpt-4",
    ]
  },
  AzureOpenAI: {
    name: "Azure Open AI",
    models: [
      "gpt-4o-mini",
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