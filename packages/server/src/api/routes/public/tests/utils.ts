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

export type MakeRequestWithFormDataResponse = (
  method: HttpMethod,
  endpoint: string,
  fields: Record<string, string | { path: string }>,
  intAppId?: string
) => Promise<supertest.Response>

function base(
  apiKey: string,
  endpoint: string,
  opts?: {
    intAppId?: string
    internal?: boolean
  }
) {
  const extraHeaders: any = {
    "x-budibase-api-key": apiKey,
  }
  if (opts?.intAppId) {
    extraHeaders["x-budibase-app-id"] = opts.intAppId
  }

  const url = opts?.internal
    ? endpoint
    : checkSlashesInUrl(`/api/public/v1/${endpoint}`)
  return { headers: extraHeaders, url }
}

export function generateMakeRequest(
  apiKey: string,
  opts?: { internal?: boolean }
): MakeRequestResponse {
  const request = setup.getRequest()!
  const config = setup.getConfig()!
  return async (
    method: HttpMethod,
    endpoint: string,
    body?: any,
    intAppId: string | undefined = config.getAppId()
  ) => {
    const { headers, url } = base(apiKey, endpoint, { ...opts, intAppId })
    if (body && typeof body !== "string") {
      headers["Content-Type"] = "application/json"
    }
    const req = request[method](url).set(config.defaultHeaders(headers))
    if (body) {
      req.send(body)
    }
    const res = await req
    expect(res.body).toBeDefined()
    return res
  }
}

export function generateMakeRequestWithFormData(
  apiKey: string,
  opts?: { internal?: boolean; browser?: boolean }
): MakeRequestWithFormDataResponse {
  const request = setup.getRequest()!
  const config = setup.getConfig()!
  return async (
    method: HttpMethod,
    endpoint: string,
    fields: Record<string, string | { path: string }>,
    intAppId: string | undefined = config.getAppId()
  ) => {
    const { headers, url } = base(apiKey, endpoint, { ...opts, intAppId })
    const req = request[method](url).set(config.defaultHeaders(headers))
    for (let [field, value] of Object.entries(fields)) {
      if (typeof value === "string") {
        req.field(field, value)
      } else {
        req.attach(field, value.path)
      }
    }
    const res = await req
    expect(res.body).toBeDefined()
    return res
  }
}
