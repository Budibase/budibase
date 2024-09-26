import { searchInputMapping } from "../utils"
import { db as dbCore } from "@budibase/backend-core"
import {
  FieldType,
  BBReferenceFieldSubType,
  INTERNAL_TABLE_SOURCE_ID,
  RowSearchParams,
  Table,
  TableSourceType,
} from "@budibase/types"

const tableId = "ta_a"
const tableWithUserCol: Table = {
  type: "table",
  _id: tableId,
  name: "table",
  sourceId: INTERNAL_TABLE_SOURCE_ID,
  sourceType: TableSourceType.INTERNAL,
  schema: {
    user: {
      name: "user",
      type: FieldType.BB_REFERENCE_SINGLE,
      subtype: BBReferenceFieldSubType.USER,
    },
  },
}

const tableWithUsersCol: Table = {
  type: "table",
  _id: tableId,
  name: "table",
  sourceId: INTERNAL_TABLE_SOURCE_ID,
  sourceType: TableSourceType.INTERNAL,
  schema: {
    user: {
      name: "user",
      type: FieldType.BB_REFERENCE,
      subtype: BBReferenceFieldSubType.USER,
    },
  },
}

describe.each([tableWithUserCol, tableWithUsersCol])(
  "searchInputMapping",
  col => {
    const globalUserId = dbCore.generateGlobalUserID()
    const userMedataId = dbCore.generateUserMetadataID(globalUserId)

    it("should be able to map ro_ to global user IDs", () => {
      const params: RowSearchParams = {
        tableId,
        query: {
          equal: {
            "1:user": userMedataId,
          },
        },
      }
      const output = searchInputMapping(col, params)
      expect(output.query.equal!["1:user"]).toBe(globalUserId)
    })

    it("should handle array of user IDs", () => {
      const params: RowSearchParams = {
        tableId,
        query: {
          oneOf: {
            "1:user": [userMedataId, globalUserId],
          },
        },
      }
      const output = searchInputMapping(col, params)
      expect(output.query.oneOf!["1:user"]).toStrictEqual([
        globalUserId,
        globalUserId,
      ])
    })

    it("shouldn't change any other input", () => {
      const email = "test@example.com"
      const params: RowSearchParams = {
        tableId,
        query: {
          equal: {
            "1:user": email,
          },
        },
      }
      const output = searchInputMapping(col, params)
      expect(output.query.equal!["1:user"]).toBe(email)
    })

    it("shouldn't error if no query supplied", () => {
      // @ts-expect-error - intentionally passing in a bad type
      const output = searchInputMapping(col, { tableId })
      expect(output.query).toBeUndefined()
    })
  }
)
