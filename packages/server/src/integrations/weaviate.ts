import {
  Integration,
  DatasourceFieldType,
  QueryType,
  HttpMethod,
} from "@budibase/types"
import weaviate, { QueryMetadata, WeaviateClient } from "weaviate-client"
import { OpenAI } from "openai"

interface WeaviateConfig {
  url: string
  weaviateApiKey: string
  openAIApiKey: string
}

interface WeaviateQuery {
  term: string
  collection: string
  commaSeparatedReturnProperties?: string
  commaSeparatedReturnMetadata?: string
  distance?: number
}

const SCHEMA: Integration = {
  docs: "https://github.com/node-fetch/node-fetch",
  description: "Bla bla bla.",
  friendlyName: "Weaviate query",
  type: "API",
  datasource: {
    url: {
      type: DatasourceFieldType.STRING,
      default: "",
      required: true,
    },
    weaviateApiKey: {
      type: DatasourceFieldType.PASSWORD,
      default: "",
      required: true,
      display: "Weaviate API key",
    },
    openAIApiKey: {
      type: DatasourceFieldType.PASSWORD,
      default: "",
      required: true,
      display: "OpenAI API key",
    },
  },
  query: {
    read: {
      readable: true,
      displayName: HttpMethod.POST,
      type: QueryType.FIELDS,
      fields: {
        term: {
          type: DatasourceFieldType.STRING,
        },
        collection: {
          type: DatasourceFieldType.STRING,
        },
        distance: {
          type: DatasourceFieldType.NUMBER,
          display: "Max distance",
        },
        commaSeparatedReturnProperties: {
          type: DatasourceFieldType.LIST,
          display: "Return properties (comma separated)",
        },
        commaSeparatedReturnMetadata: {
          type: DatasourceFieldType.LIST,
          display: "Return metadata (comma separated)",
        },
      },
    },
  },
}

class WeaviateIntegration {
  private config: WeaviateConfig

  constructor(config: WeaviateConfig) {
    this.config = config
  }

  private async getEmbeddings(text: string) {
    try {
      const openai = new OpenAI({
        apiKey: this.config.openAIApiKey,
      })
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002", // Choose the model as per your requirements
        input: text,
      })

      return response.data
    } catch (error) {
      console.error("Error fetching embeddings:", error)
      return null
    }
  }

  async read(opts: WeaviateQuery) {
    const client: WeaviateClient = await weaviate.connectToWCS(
      this.config.url,
      {
        authCredentials: new weaviate.ApiKey(this.config.weaviateApiKey),
        headers: {
          "X-OpenAI-Api-Key": this.config.openAIApiKey,
        },
      }
    )

    const embeddings = await this.getEmbeddings(opts.term)

    const vector = embeddings![0].embedding

    const questions = client.collections.get(opts.collection)

    let returnProperties
    if (opts.commaSeparatedReturnProperties) {
      returnProperties = opts.commaSeparatedReturnProperties
        .split(",")
        .map(x => x.trim())
    }

    let returnMetadata
    if (opts.commaSeparatedReturnMetadata) {
      returnMetadata = opts.commaSeparatedReturnMetadata
        .split(",")
        .map(x => x.trim()) as QueryMetadata
    }

    const result = await questions.query.nearVector(vector, {
      returnProperties,
      returnMetadata,
      distance: opts.distance,
    })

    return result
  }
}

export default {
  schema: SCHEMA,
  integration: WeaviateIntegration,
}
