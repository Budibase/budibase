import { TestAPI } from "../base"

const defaultConfig: RequestSettings = {
  expect: 200,
  setHeaders: true,
  skipContentTypeCheck: false,
}

export type RequestSettings = {
  expect: number | object
  setHeaders: boolean
  skipContentTypeCheck: boolean
}

export abstract class ScimTestAPI extends TestAPI {
  call = (
    url: string,
    method: "get" | "post" | "patch" | "delete",
    requestSettings?: Partial<RequestSettings>,
    body?: object
  ) => {
    const { expect, setHeaders } = { ...defaultConfig, ...requestSettings }
    let request = this.request[method](url).expect(expect)

    request = request.set(
      "content-type",
      "application/scim+json; charset=utf-8"
    )

    if (method !== "delete" && !requestSettings?.skipContentTypeCheck) {
      request = request.expect("Content-Type", /json/)
    }

    if (body) {
      request = request.send(body)
    }

    if (setHeaders) {
      request = request.set(this.config.bearerAPIHeaders())
    }
    return request
  }
}
