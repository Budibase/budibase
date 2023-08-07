import { generator } from "@budibase/backend-core/tests"
import { BBRequest, FieldType, Row, Table } from "@budibase/types"
import { Next } from "koa"
import * as utils from "../../db/utils"
import noViewDataMiddleware from "../noViewData"

class TestConfiguration {
  next: Next
  throw: jest.Mock<(status: number, message: string) => never>
  middleware: typeof noViewDataMiddleware
  params: Record<string, any>
  request?: Pick<BBRequest<Row>, "body">

  constructor() {
    this.next = jest.fn()
    this.throw = jest.fn()
    this.params = {}

    this.middleware = noViewDataMiddleware
  }

  executeMiddleware(ctxRequestBody: Row) {
    this.request = {
      body: ctxRequestBody,
    }
    return this.middleware(
      {
        request: this.request as any,
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

describe("noViewData middleware", () => {
  let config: TestConfiguration

  beforeEach(() => {
    config = new TestConfiguration()
  })

  afterEach(() => {
    config.afterEach()
  })

  const getRandomData = () => ({
    _id: generator.guid(),
    name: generator.name(),
    age: generator.age(),
    address: generator.address(),
  })

  it("it should pass without view id data", async () => {
    const data = getRandomData()
    await config.executeMiddleware({
      ...data,
    })

    expect(config.next).toBeCalledTimes(1)
    expect(config.throw).not.toBeCalled()
  })

  it("it should throw an error if _viewid is provided", async () => {
    const data = getRandomData()
    await config.executeMiddleware({
      _viewId: generator.guid(),
      ...data,
    })

    expect(config.throw).toBeCalledTimes(1)
    expect(config.throw).toBeCalledWith(
      400,
      "Table row endpoints cannot contain view info"
    )
    expect(config.next).not.toBeCalled()
  })
})
