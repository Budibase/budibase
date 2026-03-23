import { FieldType } from "@budibase/types"
import type { DateFieldMetadata } from "@budibase/types"

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

describe("generateColumnDefinition time handling", () => {
  const baseConfig = {
    autocolumn: false,
    name: "col",
    presence: false,
  }

  it("marks time columns as time-only", () => {
    const schema = generateColumnDefinition({
      ...baseConfig,
      externalType: "time",
    })
    const dateSchema = schema as DateFieldMetadata

    expect(dateSchema.type).toEqual(FieldType.DATETIME)
    expect(dateSchema.timeOnly).toBe(true)
    expect(dateSchema.dateOnly).toBe(false)
  })

  it("marks time with precision columns as time-only", () => {
    const schema = generateColumnDefinition({
      ...baseConfig,
      externalType: "time(6)",
    })
    const dateSchema = schema as DateFieldMetadata

    expect(dateSchema.type).toEqual(FieldType.DATETIME)
    expect(dateSchema.timeOnly).toBe(true)
  })

  it("does not treat timestamp as time-only", () => {
    const schema = generateColumnDefinition({
      ...baseConfig,
      externalType: "timestamp",
    })
    const dateSchema = schema as DateFieldMetadata

    expect(dateSchema.type).toEqual(FieldType.DATETIME)
    expect(dateSchema.timeOnly).toBe(false)
  })
})
