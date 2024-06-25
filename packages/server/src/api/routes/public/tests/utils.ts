import { checkSlashesInUrl } from "../../../../utilities"
import supertest from "supertest"
import TestConfiguration from "../../../../../src/tests/utilities/TestConfiguration"

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
  intAppId: string | null,
  isInternal: boolean
) {
  const extraHeaders: any = {
    "x-budibase-api-key": apiKey,
  }
  if (intAppId) {
    extraHeaders["x-budibase-app-id"] = intAppId
  }

  const url = isInternal
    ? endpoint
    : checkSlashesInUrl(`/api/public/v1/${endpoint}`)
  return { headers: extraHeaders, url }
}

export function generateMakeRequest(
  config: TestConfiguration,
  apiKey: string,
  isInternal = false
): MakeRequestResponse {
  return async (
    method: HttpMethod,
    endpoint: string,
    body?: any,
    intAppId: string | null = config.getAppId()
  ) => {
    const { headers, url } = base(apiKey, endpoint, intAppId, isInternal)
    const req = config.request![method](url).set(config.defaultHeaders(headers))
    if (body) {
      req.send(body)
    }
    const res = await req
    expect(res.body).toBeDefined()
    return res
  }
}

export function generateMakeRequestWithFormData(
  config: TestConfiguration,
  apiKey: string,
  isInternal = false
): MakeRequestWithFormDataResponse {
  return async (
    method: HttpMethod,
    endpoint: string,
    fields: Record<string, string | { path: string }>,
    intAppId: string | null = config.getAppId()
  ) => {
    const { headers, url } = base(apiKey, endpoint, intAppId, isInternal)
    const req = config.request![method](url).set(config.defaultHeaders(headers))
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
