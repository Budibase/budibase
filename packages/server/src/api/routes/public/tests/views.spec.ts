import * as setup from "../../tests/utilities"
import { basicTable } from "../../../../tests/utilities/structures"
import { Table } from "@budibase/types"
import { PublicAPIRequest } from "./Request"

describe("check public API security", () => {
  const config = setup.getConfig()
  let request: PublicAPIRequest, table: Table

  beforeAll(async () => {
    await config.init()
    request = await PublicAPIRequest.init(config, await config.globalUser())
    table = (await request.tables.create(basicTable())).data
  })

  it("should be able to create a view", async () => {
    await request.views.create(
      {
        name: "view",
        tableId: table._id!,
        query: {},
        schema: {
          name: {
            readonly: true,
            visible: true,
          },
        },
      },
      { status: 201 }
    )
  })
})
