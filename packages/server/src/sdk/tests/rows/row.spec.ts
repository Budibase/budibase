import { exportRows } from "../../app/rows/search/external"
import sdk from "../.."
import { ExternalRequest } from "../../../api/controllers/row/ExternalRequest"

const mockDatasourcesGet = jest.fn()
sdk.datasources.get = mockDatasourcesGet

jest.mock("../../../api/controllers/row/ExternalRequest")

jest.mock("../../../api/controllers/view/exporters", () => ({
  ...jest.requireActual("../../../api/controllers/view/exporters"),
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
  } as any
}

describe("external row controller", () => {
  describe("exportRows", () => {
    beforeAll(() => {
      jest
        .spyOn(ExternalRequest.prototype, "run")
        .mockImplementation(() => Promise.resolve([]))
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("should throw a 400 if no datasource entities are present", async () => {
      let userCtx = getUserCtx()
      try {
        await exportRows(userCtx)
      } catch (e) {
        expect(userCtx.throw).toHaveBeenCalledWith(
          400,
          "Datasource has not been configured for plus API."
        )
      }
    })

    it("should handle single quotes from a row ID", async () => {
      mockDatasourcesGet.mockImplementation(async () => ({
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
