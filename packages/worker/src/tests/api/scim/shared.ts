import TestConfiguration from "../../TestConfiguration"
import { TestAPI } from "../base"

const defaultConfig = {
  expect: 200,
  setHeaders: true,
  skipContentTypeCheck: false,
}

export type RequestSettings = typeof defaultConfig

export abstract class ScimTestAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

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
