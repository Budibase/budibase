import { exportRows } from "../row/external"
const { datasources } = require("../../../sdk")

jest.mock("../../../sdk")
// jest.mock("../../../sdk", () => {
//   mockGetDatasource = jest.fn(() => null)
//   return {
//     datasources: {
//       get: mockGetDatasource,
//     },
//   }
// })
// let mockGetDatasource: jest.Mock

describe("external row controller", () => {
  describe("exportRows", () => {
    it("should throw a 400 if no datasource entities are present", async () => {
      let userCtx = {
        params: {
          tableId: "ta__123abc",
        },
        query: {},
        request: {
          body: {},
        },
        throw: jest.fn(() => {
          throw "Err"
        }),
      }
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

    it("should something", async () => {
      //@ts-ignore
      datasources.mockImplementationOnce(() => ({
        datasources: {
          get: jest.fn(() => ({ entities: [] })),
        },
      }))
      let userCtx = {
        params: {
          tableId: "ta__123abc",
        },
        query: {},
        request: {
          body: {
            rows: ["['d001']"],
          },
        },
        throw: jest.fn(() => {
          throw "Err"
        }),
      }

      //@ts-ignore
      await exportRows(userCtx)

      expect(userCtx.request.body).toEqual({
        query: {
          oneOf: {
            _id: "d001",
          },
        },
      })
    })
  })
})
