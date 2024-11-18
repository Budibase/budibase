import * as setup from "./utilities"
import { FilterConditions } from "../steps/filter"

describe("test the filter logic", () => {
  const config = setup.getConfig()

  beforeAll(async () => {
    await config.init()
  })

  async function checkFilter(
    field: any,
    condition: string,
    value: any,
    pass = true
  ) {
    let res = await setup.runStep(config, setup.actions.FILTER.stepId, {
      field,
      condition,
      value,
    })
    expect(res.result).toEqual(pass)
    expect(res.success).toEqual(true)
  }

  it("should be able test equality", async () => {
    await checkFilter("hello", FilterConditions.EQUAL, "hello", true)
    await checkFilter("hello", FilterConditions.EQUAL, "no", false)
  })

  it("should be able to test greater than", async () => {
    await checkFilter(10, FilterConditions.GREATER_THAN, 5, true)
    await checkFilter(10, FilterConditions.GREATER_THAN, 15, false)
  })

  it("should be able to test less than", async () => {
    await checkFilter(5, FilterConditions.LESS_THAN, 10, true)
    await checkFilter(15, FilterConditions.LESS_THAN, 10, false)
  })

  it("should be able to in-equality", async () => {
    await checkFilter("hello", FilterConditions.NOT_EQUAL, "no", true)
    await checkFilter(10, FilterConditions.NOT_EQUAL, 10, false)
  })

  it("check number coercion", async () => {
    await checkFilter("10", FilterConditions.GREATER_THAN, "5", true)
  })

  it("check date coercion", async () => {
    await checkFilter(
      new Date().toISOString(),
      FilterConditions.GREATER_THAN,
      new Date(-10000).toISOString(),
      true
    )
  })

  it("check objects always false", async () => {
    await checkFilter({}, FilterConditions.EQUAL, {}, false)
  })
})
