import { fixAutoColumnSubType } from "../utils"
import { AutoFieldDefaultNames, AutoFieldSubTypes } from "../../../constants"
import { FieldSchema, FieldType, RelationshipType } from "@budibase/types"

describe("rowProcessor utility", () => {
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
        AutoFieldSubTypes.CREATED_BY
      )
      schema.subtype = undefined

      schema.name = AutoFieldDefaultNames.UPDATED_BY
      expect(fixAutoColumnSubType(schema).subtype).toEqual(
        AutoFieldSubTypes.UPDATED_BY
      )
      schema.subtype = undefined

      schema.name = AutoFieldDefaultNames.CREATED_AT
      expect(fixAutoColumnSubType(schema).subtype).toEqual(
        AutoFieldSubTypes.CREATED_AT
      )
      schema.subtype = undefined

      schema.name = AutoFieldDefaultNames.UPDATED_AT
      expect(fixAutoColumnSubType(schema).subtype).toEqual(
        AutoFieldSubTypes.UPDATED_AT
      )
      schema.subtype = undefined

      schema.name = AutoFieldDefaultNames.AUTO_ID
      expect(fixAutoColumnSubType(schema).subtype).toEqual(
        AutoFieldSubTypes.AUTO_ID
      )
      schema.subtype = undefined
    })

    it("returns the column if subtype exists", async () => {
      schema.subtype = AutoFieldSubTypes.CREATED_BY
      schema.name = AutoFieldDefaultNames.CREATED_AT
      expect(fixAutoColumnSubType(schema)).toEqual(schema)
    })
  })
})
