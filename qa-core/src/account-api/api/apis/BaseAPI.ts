import { Response } from "node-fetch"
import { APIRequestOpts } from "../../../types"

export default class BaseAPI {
  async doRequest(
    request: () => Promise<[Response, any]>,
    opts: APIRequestOpts
  ): Promise<[Response, any]> {
    const [response, body] = await request()

    // do expect on by default
    if (opts.doExpect === undefined) {
      opts.doExpect = true
    }
    if (opts.doExpect && opts.status) {
      expect(response).toHaveStatusCode(opts.status)
    }
    return [response, body]
  }
}
