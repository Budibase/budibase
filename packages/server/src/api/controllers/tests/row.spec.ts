import { exportRows } from "../row/external"
import sdk from "../../../sdk"
import { ExternalRequest } from "../row/ExternalRequest"

// @ts-ignore
sdk.datasources = {
  get: jest.fn(),
}

jest.mock("../row/ExternalRequest")
jest.mock("../view/exporters", () => ({
  csv: jest.fn(),
  Format: {
    CSV: "csv",
  },
}))
jest.mock("../../../utilities/fileSystem")

function getUserCtx() {
  return {
    params: {
      tableId: "datasource__tablename",
    },
    query: {
      format: "csv",
    },
    request: {
      body: {},
    },
    throw: jest.fn(() => {
      throw "Err"
    }),
    attachment: jest.fn(),
  }
}

describe("external row controller", () => {
  describe("exportRows", () => {
    beforeAll(() => {
      //@ts-ignore
      jest.spyOn(ExternalRequest.prototype, "run").mockImplementation(() => [])
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("should throw a 400 if no datasource entities are present", async () => {
      let userCtx = getUserCtx()
      try {
        //@ts-ignore
        await exportRows(userCtx)
      } catch (e) {
        expect(userCtx.throw).toHaveBeenCalledWith(
          400,
          "Datasource has not been configured for plus API."
        )
      }
    })

    it("should handle single quotes from a row ID", async () => {
      //@ts-ignore
      sdk.datasources.get.mockImplementation(() => ({
        entities: {
          tablename: {
            schema: {},
          },
        },
      }))
      let userCtx = getUserCtx()
      userCtx.request.body = {
        rows: ["['d001']"],
      }

      //@ts-ignore
      await exportRows(userCtx)

      expect(userCtx.request.body).toEqual({
        query: {
          oneOf: {
            _id: ["d001"],
          },
        },
      })
    })

    it("should throw a 400 if any composite keys are present", async () => {
      let userCtx = getUserCtx()
      userCtx.request.body = {
        rows: ["[123]", "['d001'%2C'10111']"],
      }
      try {
        //@ts-ignore
        await exportRows(userCtx)
      } catch (e) {
        expect(userCtx.throw).toHaveBeenCalledWith(
          400,
          "Export data does not support composite keys."
        )
      }
    })

    it("should throw a 400 if no table name was found", async () => {
      let userCtx = getUserCtx()
      userCtx.params.tableId = "datasource__"
      userCtx.request.body = {
        rows: ["[123]"],
      }
      try {
        //@ts-ignore
        await exportRows(userCtx)
      } catch (e) {
        expect(userCtx.throw).toHaveBeenCalledWith(
          400,
          "Could not find table name."
        )
      }
    })
  })
})
