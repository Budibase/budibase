import { AnyDocument, PermissionLevel } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class PermissionAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  get = async (
    resourceId: string,
    { expectStatus } = { expectStatus: 200 }
  ) => {
    return this.request
      .get(`/api/permission/${resourceId}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
  }

  set = async (
    {
      roleId,
      resourceId,
      level,
    }: { roleId: string; resourceId: string; level: PermissionLevel },
    { expectStatus } = { expectStatus: 200 }
  ): Promise<any> => {
    const res = await this.request
      .post(`/api/permission/${roleId}/${resourceId}/${level}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
    return res.body
  }

  revoke = async (
    {
      roleId,
      resourceId,
      level,
    }: { roleId: string; resourceId: string; level: PermissionLevel },
    { expectStatus } = { expectStatus: 200 }
  ) => {
    const res = await this.request
      .delete(`/api/permission/${roleId}/${resourceId}/${level}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
    return res
  }
}
