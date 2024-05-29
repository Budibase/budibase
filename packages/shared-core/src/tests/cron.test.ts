import { cron } from "../helpers"

describe("check valid and invalid crons", () => {
  it("invalid - 0 0 0 11 *", () => {
    expect(cron.validate("0 0 0 11 *")).toStrictEqual({
      valid: false,
      err: [expect.stringContaining("less than '1'")],
    })
  })

  it("invalid - 5 4 32 1 1", () => {
    expect(cron.validate("5 4 32 1 1")).toStrictEqual({
      valid: false,
      err: [expect.stringContaining("greater than '31'")],
    })
  })

  it("valid - * * * * *", () => {
    expect(cron.validate("* * * * *")).toStrictEqual({ valid: true })
  })
})
