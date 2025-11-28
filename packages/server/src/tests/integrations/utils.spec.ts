import { FieldType } from "@budibase/types"

import { generateColumnDefinition } from "../../integrations/utils/utils"

describe("generateColumnDefinition tinyint handling", () => {
  const baseConfig = {
    autocolumn: false,
    name: "col",
    presence: false,
  }

  it("treats generic tinyint as a number", () => {
    const schema = generateColumnDefinition({
      ...baseConfig,
      externalType: "tinyint",
    })

    expect(schema.type).toEqual(FieldType.NUMBER)
  })

  it("treats tinyint(1) as a number", () => {
    const schema = generateColumnDefinition({
      ...baseConfig,
      externalType: "tinyint(1)",
    })

    expect(schema.type).toEqual(FieldType.NUMBER)
  })

  it("treats extended tinyint definitions as numbers", () => {
    const schema = generateColumnDefinition({
      ...baseConfig,
      externalType: "tinyint(1) unsigned",
    })

    expect(schema.type).toEqual(FieldType.NUMBER)
  })
})
