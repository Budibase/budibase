import { fixAutoColumnSubType, processAIColumns } from "../utils"
import { AutoFieldDefaultNames } from "../../../constants"
import {
  AIOperationEnum,
  AutoFieldSubType,
  FieldSchema,
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  RelationshipType,
  Table,
  TableSourceType,
} from "@budibase/types"
import { generator, mocks } from "@budibase/backend-core/tests"
import { mockChatGPTResponse } from "../../../tests/utilities/mocks/openai"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import nock from "nock"
import { setEnv } from "@budibase/backend-core"

describe("rowProcessor utility", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  describe("fixAutoColumnSubType", () => {
    const schema: FieldSchema = {
      name: "",
      type: FieldType.LINK,
      subtype: undefined, // missing subtype
      icon: "ri-magic-line",
      autocolumn: true,
      constraints: { type: "array", presence: false },
      tableId: "ta_users",
      fieldName: "test-Updated By",
      relationshipType: RelationshipType.MANY_TO_MANY,
      sortable: false,
    }

    it("updates the schema with the correct subtype", async () => {
      schema.name = AutoFieldDefaultNames.CREATED_BY
      expect(fixAutoColumnSubType(schema).subtype).toEqual(
        AutoFieldSubType.CREATED_BY
      )
      schema.subtype = undefined

      schema.name = AutoFieldDefaultNames.UPDATED_BY
      expect(fixAutoColumnSubType(schema).subtype).toEqual(
        AutoFieldSubType.UPDATED_BY
      )
      schema.subtype = undefined

      schema.name = AutoFieldDefaultNames.CREATED_AT
      expect(fixAutoColumnSubType(schema).subtype).toEqual(
        AutoFieldSubType.CREATED_AT
      )
      schema.subtype = undefined

      schema.name = AutoFieldDefaultNames.UPDATED_AT
      expect(fixAutoColumnSubType(schema).subtype).toEqual(
        AutoFieldSubType.UPDATED_AT
      )
      schema.subtype = undefined

      schema.name = AutoFieldDefaultNames.AUTO_ID
      expect(fixAutoColumnSubType(schema).subtype).toEqual(
        AutoFieldSubType.AUTO_ID
      )
      schema.subtype = undefined
    })

    it("returns the column if subtype exists", async () => {
      schema.subtype = AutoFieldSubType.CREATED_BY
      schema.name = AutoFieldDefaultNames.CREATED_AT
      expect(fixAutoColumnSubType(schema)).toEqual(schema)
    })
  })

  describe("processAIColumns", () => {
    let lastPrompt: string | null = null

    let cleanup: () => void
    beforeAll(() => {
      cleanup = setEnv({ OPENAI_API_KEY: "test-api" })
      mocks.licenses.useBudibaseAI()
    })

    afterAll(() => {
      cleanup()
      mocks.licenses.useCloudFree()
    })

    beforeEach(() => {
      lastPrompt = null
      nock.cleanAll()
      mockChatGPTResponse((prompt: string) => {
        lastPrompt = prompt
        return "response from LLM"
      })
    })

    it("ensures that bindable inputs are mapped and passed to to LLM prompt generation", async () => {
      mocks.licenses.useBudibaseAI()
      const table: Table = {
        _id: generator.guid(),
        name: "AITestTable",
        type: "table",
        sourceId: INTERNAL_TABLE_SOURCE_ID,
        sourceType: TableSourceType.INTERNAL,
        schema: {
          product: {
            type: FieldType.STRING,
            name: "product",
            constraints: {
              presence: true,
              type: "string",
            },
          },
          aicol: {
            type: FieldType.AI,
            name: "aicol",
            operation: AIOperationEnum.PROMPT,
            prompt: "Translate '{{ product }}' into German",
          },
        },
      }

      const inputRows = [
        {
          product: "Car Battery",
        },
      ]

      await config.doInApp(async () => {
        const result = await processAIColumns(table, inputRows, {
          contextRows: inputRows,
        })
        expect(result).toEqual([
          {
            aicol: "response from LLM",
            product: "Car Battery",
          },
        ])
        expect(lastPrompt).toEqual("Translate 'Car Battery' into German")
      })
    })
  })
})
