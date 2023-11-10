import { exportRows } from "../../app/rows/search/external"
import sdk from "../.."
import { ExternalRequest } from "../../../api/controllers/row/ExternalRequest"
import { ExportRowsParams } from "../../app/rows/search"
import { Format } from "../../../api/controllers/view/exporters"
import { HTTPError } from "@budibase/backend-core"
import { Operation } from "@budibase/types"

const mockDatasourcesGet = jest.fn()
const mockTableGet = jest.fn()
sdk.datasources.get = mockDatasourcesGet
sdk.tables.getTable = mockTableGet

jest.mock("../../../api/controllers/row/ExternalRequest")
jest.mock("../../../utilities/rowProcessor", () => ({
  outputProcessing: jest.fn((_, rows) => rows),
}))

jest.mock("../../../api/controllers/view/exporters", () => ({
  ...jest.requireActual("../../../api/controllers/view/exporters"),
  csv: jest.fn(),
  Format: {
    CSV: "csv",
  },
}))
jest.mock("../../../utilities/fileSystem")

describe("external row sdk", () => {
  describe("exportRows", () => {
    function getExportOptions(): ExportRowsParams {
      return {
        tableId: "datasource__tablename",
        format: Format.CSV,
        query: {},
      }
    }

    const externalRequestCall = jest.fn()
    beforeAll(() => {
      jest
        .spyOn(ExternalRequest.prototype, "run")
        .mockImplementation(externalRequestCall.mockResolvedValue([]))
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("should throw a 400 if no datasource entities are present", async () => {
      const exportOptions = getExportOptions()
      await expect(exportRows(exportOptions)).rejects.toThrowError(
        new HTTPError("Datasource has not been configured for plus API.", 400)
      )
    })

    it("should handle single quotes from a row ID", async () => {
      mockDatasourcesGet.mockImplementation(async () => ({
        entities: {
          tablename: {
            schema: {},
          },
        },
      }))
      const exportOptions = getExportOptions()
      exportOptions.rowIds = ["['d001']"]

      await exportRows(exportOptions)

      expect(ExternalRequest).toBeCalledTimes(1)
      expect(ExternalRequest).toBeCalledWith(
        Operation.READ,
        exportOptions.tableId,
        undefined
      )

      expect(externalRequestCall).toBeCalledTimes(1)
      expect(externalRequestCall).toBeCalledWith(
        expect.objectContaining({
          filters: {
            oneOf: {
              _id: ["d001"],
            },
          },
        })
      )
    })

    it("should throw a 400 if any composite keys are present", async () => {
      const exportOptions = getExportOptions()
      exportOptions.rowIds = ["[123]", "['d001'%2C'10111']"]
      await expect(exportRows(exportOptions)).rejects.toThrowError(
        new HTTPError("Export data does not support composite keys.", 400)
      )
    })

    it("should throw a 400 if no table name was found", async () => {
      const exportOptions = getExportOptions()
      exportOptions.tableId = "datasource__"
      exportOptions.rowIds = ["[123]"]

      await expect(exportRows(exportOptions)).rejects.toThrowError(
        new HTTPError("Could not find table name.", 400)
      )
    })
  })
})
