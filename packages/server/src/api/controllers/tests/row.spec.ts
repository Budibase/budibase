import { exportRows } from "../row/external"
import sdk from "../../../sdk"

// @ts-ignore
sdk.datasources = {
  get: jest.fn(),
};

describe("external row controller", () => {
  describe("exportRows", () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

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
      sdk.datasources.get.mockImplementation(() => ({ entities: [] }));
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
