import type { ProcessAttachmentResponse } from "@budibase/types"
import type { Expectations } from "./base"
import { TestAPI } from "./base"
import type fs from "fs"

export class AttachmentAPI extends TestAPI {
  process = async (
    name: string,
    file: Buffer | fs.ReadStream | string,
    expectations?: Expectations
  ): Promise<ProcessAttachmentResponse> => {
    return await this._post(`/api/attachments/process`, {
      files: { file: { name, file } },
      expectations,
    })
  }
}
