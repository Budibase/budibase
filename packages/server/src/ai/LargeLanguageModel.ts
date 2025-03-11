import { ai, configs } from "@budibase/backend-core"
import {
  ILargeLanguageModel,
  AIOperationEnum,
  AIInnerConfig,
  AIFieldMetadata,
  AIConfig,
  Row,
} from "@budibase/types"
import { utils } from "@budibase/shared-core"
import {
  OpenAIModel,
  AnthropicModel,
  OpenAIConfigOptions,
  AnthropicConfigOptions,
} from "./models"
import * as models from "./models"
import { quotas, features } from "@budibase/pro"
import * as Prompts from "./prompts"

type ModelIdentifier = OpenAIModel | AnthropicModel

const ProviderMap = {
  OpenAI: models.OpenAI,
  Anthropic: models.Anthropic,
  TogetherAI: models.OpenAI,
  AzureOpenAI: models.OpenAI,
  Custom: models.OpenAI,
}

type LLMConfigOptions = OpenAIConfigOptions & AnthropicConfigOptions

function extractTextFromColumns(row: Row, columns: string[]) {
  return columns.map(column => row[column]).join(" ")
}

export class LargeLanguageModel {
  llm?: ILargeLanguageModel
  model: ModelIdentifier

  public static async forCurrentTenant(model: ModelIdentifier) {
    const llm = new LargeLanguageModel(model)
    await llm.init()
    return llm
  }

  private constructor(model: ModelIdentifier) {
    this.model = model
  }

  private determineDefault(config: AIInnerConfig) {
    for (const uuid in config) {
      if (config[uuid].isDefault) {
        return config[uuid]
      }
    }
  }

  async init() {
    let aiConfig = await configs.getAIConfig()
    const bbAIEnabled = await features.isBudibaseAIEnabled()
    if (!aiConfig && !bbAIEnabled) {
      // no custom configs and BB AI config not available to fall back on
      return
    }

    if (!aiConfig) {
      aiConfig = { config: {} } as AIConfig
    }
    if (bbAIEnabled) {
      ai.addBudibaseAIConfig(aiConfig)
    }

    const selectedConfig = this.determineDefault(aiConfig.config)
    if (!selectedConfig) {
      // no config exists - LLM can't be configured but a valid case
      return
    }

    const llmConfigOptions = {
      model: selectedConfig.defaultModel || this.model,
      apiKey: selectedConfig.apiKey,
      measureUsage:
        aiConfig?.config?.budibase_ai?.apiKey === selectedConfig.apiKey,
    }

    const LLMProvider = ProviderMap[selectedConfig.provider]
    const llm = new LLMProvider(llmConfigOptions as LLMConfigOptions)
    if (!llm) {
      throw Error("LLM Initialisation failed. No model configured.")
    }
    this.llm = llm
  }

  buildPromptFromAIOperation({
    schema,
    row,
  }: {
    schema: AIFieldMetadata
    row: Record<string, any>
  }): string {
    const { operation } = schema
    switch (operation) {
      case AIOperationEnum.SUMMARISE_TEXT:
        return Prompts.summarizeText(
          extractTextFromColumns(row, schema.columns!)
        )

      case AIOperationEnum.CLEAN_DATA:
        return Prompts.cleanData(row[schema.column!])

      case AIOperationEnum.TRANSLATE:
        return Prompts.translate(row[schema.column!], schema.language!)

      case AIOperationEnum.CATEGORISE_TEXT:
        if (!schema.categories) {
          throw Error(
            "No categories provided for categorise text operation. Please provide categories."
          )
        }
        return Prompts.classifyText(
          extractTextFromColumns(row, schema.columns!),
          schema.categories.split(",")
        )

      case AIOperationEnum.SENTIMENT_ANALYSIS:
        return Prompts.sentimentAnalysis(row[schema.column!])

      case AIOperationEnum.PROMPT:
        return schema.prompt!

      case AIOperationEnum.SEARCH_WEB:
        return Prompts.searchWeb(extractTextFromColumns(row, schema.columns!))

      default:
        throw utils.unreachable(operation)
    }
  }

  async run(prompt: string) {
    if (!this.llm) {
      throw Error(
        "No model configuration selected. You must instantiate an LLM before prompting."
      )
    }
    const response = await this.llm.prompt(prompt)
    await quotas.incrementBudibaseAICredits(response.tokensUsed || 0)
    return response.message
  }
}
