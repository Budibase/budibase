import * as setup from "../../tests/utilities"
import { PublicAPIRequest } from "./Request"

describe("check public API security", () => {
  const config = setup.getConfig()
  let request: PublicAPIRequest

  beforeAll(async () => {
    await config.init()
    request = await PublicAPIRequest.init(config, await config.globalUser())
  })

  it("should have Access-Control-Allow-Origin set to *", async () => {
    await request.tables.search("", {
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
      },
    })
  })
})
