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

describe("searchInputMapping", () => {
  it("should be able to map ro_ to global user IDs", () => {
    const globalUserId = dbCore.generateGlobalUserID()
    const userMedataId = dbCore.generateUserMetadataID(globalUserId)
    const params: SearchParams = {
      tableId,
      query: {
        equal: {
          "1:user": userMedataId,
        },
      },
    }
    const output = searchInputMapping(tableWithUserCol, params)
    expect(output.query.equal!["1:user"]).toBe(globalUserId)
  })

  it("shouldn't change any other input", () => {
    const params: SearchParams = {
      tableId,
      query: {
        equal: {
          "1:user": "test@test.com",
        },
      },
    }
  })
})
