import { OpenAI, GPT_5_MODELS } from "./openai"

export class AzureOpenAI extends OpenAI {
  protected override getVerbosityForModel(): "low" | "medium" | undefined {
    return Object.values(GPT_5_MODELS).includes(this.model as GPT_5_MODELS)
      ? "medium"
      : undefined
  }
}
