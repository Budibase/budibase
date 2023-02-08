import * as setup from "../../tests/utilities"
import { checkSlashesInUrl } from "../../../../utilities"
import supertest from "supertest"

export type HttpMethod = "post" | "get" | "put" | "delete" | "patch"

export type MakeRequestResponse = (
  method: HttpMethod,
  endpoint: string,
  body?: any,
  intAppId?: string
) => Promise<supertest.Response>

export function generateMakeRequest(
  apiKey: string,
  isInternal = false
): MakeRequestResponse {
  const request = setup.getRequest()!
  const config = setup.getConfig()!
  return async (
    method: HttpMethod,
    endpoint: string,
    body?: any,
    intAppId: string | null = config.getAppId()
  ) => {
    const extraHeaders: any = {
      "x-budibase-api-key": apiKey,
    }
    if (intAppId) {
      extraHeaders["x-budibase-app-id"] = intAppId
    }

    const url = isInternal
      ? endpoint
      : checkSlashesInUrl(`/api/public/v1/${endpoint}`)

    const req = request[method](url).set(config.defaultHeaders(extraHeaders))
    if (body) {
      req.send(body)
    }
    const res = await req
    expect(res.body).toBeDefined()
    return res
  }
}
