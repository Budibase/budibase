export interface LLMPromptResponse {
  message: string
  tokensUsed?: number
}

export interface ILargeLanguageModel {
  prompt(prompt: string): Promise<LLMPromptResponse>
  summarizeText(prompt: string): Promise<LLMPromptResponse>
}
