import { searchInputMapping } from "../utils"
import { db as dbCore } from "@budibase/backend-core"
import {
  FieldType,
  FieldTypeSubtypes,
  Table,
  SearchParams,
} from "@budibase/types"

const tableId = "ta_a"
const tableWithUserCol: Table = {
  _id: tableId,
  name: "table",
  schema: {
    user: {
      name: "user",
      type: FieldType.BB_REFERENCE,
      subtype: FieldTypeSubtypes.BB_REFERENCE.USER,
    },
  },
}

const tableWithUsersCol: Table = {
  _id: tableId,
  name: "table",
  schema: {
    user: {
      name: "user",
      type: FieldType.BB_REFERENCE,
      subtype: FieldTypeSubtypes.BB_REFERENCE.USERS,
    },
  },
}

describe.each([tableWithUserCol, tableWithUsersCol])(
  "searchInputMapping",
  col => {
    const globalUserId = dbCore.generateGlobalUserID()
    const userMedataId = dbCore.generateUserMetadataID(globalUserId)

    it("should be able to map ro_ to global user IDs", () => {
      const params: SearchParams = {
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
      const params: SearchParams = {
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
      const email = "test@test.com"
      const params: SearchParams = {
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
      const params: any = {
        tableId,
      }
      const output = searchInputMapping(col, params)
      expect(output.query).toBeUndefined()
    })
  }
)
