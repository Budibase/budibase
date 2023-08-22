import { AnyDocument, PermissionLevel } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class PermissionAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  create = async (
    {
      roleId,
      resourceId,
      level,
    }: { roleId: string; resourceId: string; level: PermissionLevel },
    { expectStatus } = { expectStatus: 200 }
  ): Promise<AnyDocument[]> => {
    const res = await this.request
      .post(`/api/permission/${roleId}/${resourceId}/${level}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
    return res.body
  }
}
