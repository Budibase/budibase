import { generator } from "@budibase/backend-core/tests"
import { BBRequest, FieldType, Row, Table } from "@budibase/types"
import * as utils from "../../db/utils"
import trimViewRowInfoMiddleware from "../trimViewRowInfo"

jest.mock("../../sdk", () => ({
  views: {
    ...jest.requireActual("../../sdk/app/views"),
    get: jest.fn(),
  },
  tables: {
    getTable: jest.fn(),
  },
}))

import sdk from "../../sdk"
import { Next } from "koa"

const mockGetView = sdk.views.get as jest.MockedFunction<typeof sdk.views.get>
const mockGetTable = sdk.tables.getTable as jest.MockedFunction<
  typeof sdk.tables.getTable
>

class TestConfiguration {
  next: Next
  throw: jest.Mock<(status: number, message: string) => never>
  middleware: typeof trimViewRowInfoMiddleware
  params: Record<string, any>
  request?: Pick<BBRequest<Row>, "body">

  constructor() {
    this.next = jest.fn()
    this.throw = jest.fn()
    this.params = {}

    this.middleware = trimViewRowInfoMiddleware
  }

  executeMiddleware(viewId: string, ctxRequestBody: Row) {
    this.request = {
      body: ctxRequestBody,
    }
    this.params.viewId = viewId
    return this.middleware(
      {
        request: this.request as any,
        next: this.next,
        throw: this.throw as any,
        params: this.params,
      } as any,
      this.next
    )
  }

  afterEach() {
    jest.clearAllMocks()
  }
}

describe("trimViewRowInfo middleware", () => {
  let config: TestConfiguration

  beforeEach(() => {
    config = new TestConfiguration()
  })

  afterEach(() => {
    config.afterEach()
  })

  const table: Table = {
    _id: utils.generateTableID(),
    name: generator.word(),
    type: "table",
    schema: {
      name: {
        name: "name",
        type: FieldType.STRING,
      },
      age: {
        name: "age",
        type: FieldType.NUMBER,
      },
      address: {
        name: "address",
        type: FieldType.STRING,
      },
    },
  }
  let viewId: string = undefined!

  beforeEach(() => {
    jest.resetAllMocks()
    mockGetTable.mockResolvedValue(table)
    viewId = utils.generateViewID(table._id!)
  })

  const getRandomData = () => ({
    _id: generator.guid(),
    name: generator.name(),
    age: generator.age(),
    address: generator.address(),
  })

  it("when no columns are defined, same data is returned", async () => {
    mockGetView.mockResolvedValue({
      version: 2,
      id: viewId,
      name: generator.guid(),
      tableId: table._id!,
    })

    const data = getRandomData()
    await config.executeMiddleware(viewId, {
      _viewId: viewId,
      ...data,
    })

    expect(config.request?.body).toEqual(data)
    expect(config.params.tableId).toEqual(table._id)

    expect(config.next).toBeCalledTimes(1)
    expect(config.throw).not.toBeCalled()
  })

  it("when columns are defined, trimmed data is returned", async () => {
    mockGetView.mockResolvedValue({
      version: 2,
      id: viewId,
      name: generator.guid(),
      tableId: table._id!,
      columns: ["name", "address"],
    })

    const data = getRandomData()
    await config.executeMiddleware(viewId, {
      _viewId: viewId,
      ...data,
    })

    expect(config.request?.body).toEqual({
      _id: data._id,
      name: data.name,
      address: data.address,
    })
    expect(config.params.tableId).toEqual(table._id)

    expect(config.next).toBeCalledTimes(1)
    expect(config.throw).not.toBeCalled()
  })

  it("it should throw an error if no viewid is provided on the body", async () => {
    const data = getRandomData()
    await config.executeMiddleware(viewId, {
      ...data,
    })

    expect(config.throw).toBeCalledTimes(1)
    expect(config.throw).toBeCalledWith(400, "_viewId is required")
    expect(config.next).not.toBeCalled()
  })

  it("it should throw an error if no viewid is provided on the parameters", async () => {
    const data = getRandomData()
    await config.executeMiddleware(undefined as any, {
      _viewId: viewId,
      ...data,
    })

    expect(config.throw).toBeCalledTimes(1)
    expect(config.throw).toBeCalledWith(400, "viewId path is required")
    expect(config.next).not.toBeCalled()
  })
})
