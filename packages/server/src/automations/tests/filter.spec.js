const setup = require("./utilities")
const { LogicConditions } = require("../steps/filter")

describe("test the delay action", () => {
  async function checkFilter(field, condition, value, pass = true) {
    let res = await setup.runStep(setup.logic.FILTER.stepId,
      { field, condition, value }
    )
    expect(res.success).toEqual(pass)
  }

  it("should be able test equality", async () => {
    await checkFilter("hello", LogicConditions.EQUAL, "hello", true)
    await checkFilter("hello", LogicConditions.EQUAL, "no", false)
  })

  it("should be able to test greater than", async () => {
    await checkFilter(10, LogicConditions.GREATER_THAN, 5, true)
    await checkFilter(10, LogicConditions.GREATER_THAN, 15, false)
  })

  it("should be able to test less than", async () => {
    await checkFilter(5, LogicConditions.LESS_THAN, 10, true)
    await checkFilter(15, LogicConditions.LESS_THAN, 10, false)
  })

  it("should be able to in-equality", async () => {
    await checkFilter("hello", LogicConditions.NOT_EQUAL, "no", true)
    await checkFilter(10, LogicConditions.NOT_EQUAL, 10, false)
  })

  it("check number coercion", async () => {
    await checkFilter("10", LogicConditions.GREATER_THAN, "5", true)
  })

  it("check date coercion", async () => {
    await checkFilter(
      (new Date()).toISOString(),
      LogicConditions.GREATER_THAN,
      (new Date(-10000)).toISOString(),
      true
    )
  })

  it("check objects always false", async () => {
    await checkFilter({}, LogicConditions.EQUAL, {}, false)
  })
})