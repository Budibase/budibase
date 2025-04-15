import * as setup from "../../tests/utilities"
import { checkSlashesInUrl } from "../../../../utilities"
import supertest from "supertest"
import { User } from "@budibase/types"
import environment from "../../../../environment"
import nock from "nock"
import { generator } from "@budibase/backend-core/tests"

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

export function mockWorkerUserAPI(...seedUsers: User[]) {
  const users: Record<string, User> = {
    ...seedUsers.reduce((acc, user) => {
      acc[user._id!] = user
      return acc
    }, {} as Record<string, User>),
  }

  nock(environment.WORKER_URL!)
    .get(new RegExp(`/api/global/users/.*`))
    .reply(200, (uri, body) => {
      const id = uri.split("/").pop()
      return users[id!]
    })
    .persist()

  nock(environment.WORKER_URL!)
    .post(`/api/global/users`)
    .reply(200, (uri, body) => {
      const newUser = body as User
      if (!newUser._id) {
        newUser._id = `us_${generator.guid()}`
      }
      users[newUser._id!] = newUser
      return newUser
    })
    .persist()

  nock(environment.WORKER_URL!)
    .put(new RegExp(`/api/global/users/.*`))
    .reply(200, (uri, body) => {
      const id = uri.split("/").pop()!
      const updatedUser = body as User
      const existingUser = users[id] || {}
      users[id] = { ...existingUser, ...updatedUser }
      return users[id]
    })
    .persist()
}
