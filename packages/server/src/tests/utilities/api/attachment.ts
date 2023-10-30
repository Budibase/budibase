import {
  APIError,
  Datasource,
  ProcessAttachmentResponse,
} from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"
import fs from "fs"

export class AttachmentAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  process = async (
    name: string,
    file: Buffer | fs.ReadStream | string,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<ProcessAttachmentResponse> => {
    const result = await this.request
      .post(`/api/attachments/process`)
      .attach("file", file, name)
      .set(this.config.defaultHeaders())

    if (result.statusCode !== expectStatus) {
      throw new Error(
        `Expected status ${expectStatus} but got ${
          result.statusCode
        }, body: ${JSON.stringify(result.body)}`
      )
    }

    return result.body
  }
}
