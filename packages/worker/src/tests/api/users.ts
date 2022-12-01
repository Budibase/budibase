import {
  BulkUserResponse,
  BulkUserRequest,
  InviteUsersRequest,
  User,
  CreateAdminUserRequest,
} from "@budibase/types"
import * as structures from "../structures"
import { generator } from "@budibase/backend-core/tests"
import TestConfiguration from "../TestConfiguration"
import { TestAPI, TestAPIOpts } from "./base"

export class UserAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  // INVITE

  sendUserInvite = async (sendMailMock: any, email: string, status = 200) => {
    await this.config.saveSmtpConfig()
    await this.config.saveSettingsConfig()
    const res = await this.request
      .post(`/api/global/users/invite`)
      .send({
        email,
      })
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(status)

    if (status !== 200) {
      return { code: undefined, res }
    }

    const emailCall = sendMailMock.mock.calls[0][0]
    // after this URL there should be a code
    const parts = emailCall.html.split(
      "http://localhost:10000/builder/invite?code="
    )
    const code = parts[1].split('"')[0].split("&")[0]
    return { code, res }
  }

  acceptInvite = (code: string) => {
    return this.request
      .post(`/api/global/users/invite/accept`)
      .send({
        password: "newpassword",
        inviteCode: code,
      })
      .expect("Content-Type", /json/)
      .expect(200)
  }

  sendMultiUserInvite = async (request: InviteUsersRequest, status = 200) => {
    await this.config.saveSmtpConfig()
    await this.config.saveSettingsConfig()
    return this.request
      .post(`/api/global/users/multi/invite`)
      .send(request)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(status)
  }

  // BULK

  bulkCreateUsers = async (users: User[], groups: any[] = []) => {
    const body: BulkUserRequest = { create: { users, groups } }
    const res = await this.request
      .post(`/api/global/users/bulk`)
      .send(body)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)

    return res.body as BulkUserResponse
  }

  bulkDeleteUsers = async (userIds: string[], status?: number) => {
    const body: BulkUserRequest = { delete: { userIds } }
    const res = await this.request
      .post(`/api/global/users/bulk`)
      .send(body)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(status ? status : 200)
    return res.body as BulkUserResponse
  }

  // USER

  createAdminUser = async (
    request?: CreateAdminUserRequest,
    opts?: TestAPIOpts
  ) => {
    if (!request) {
      request = {
        email: structures.email(),
        password: generator.string(),
        tenantId: structures.uuid(),
      }
    }
    const res = await this.request
      .post(`/api/global/users/init`)
      .send(request)
      .set(this.config.internalAPIHeaders())
      .expect("Content-Type", /json/)
      .expect(opts?.status ? opts.status : 200)

    return {
      ...request,
      userId: res.body._id,
    }
  }

  saveUser = (user: User, status?: number, headers?: any) => {
    return this.request
      .post(`/api/global/users`)
      .send(user)
      .set(headers ?? this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(status ? status : 200)
  }

  deleteUser = (userId: string, status?: number) => {
    return this.request
      .delete(`/api/global/users/${userId}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(status ? status : 200)
  }

  getUser = (userId: string, opts?: TestAPIOpts) => {
    return this.request
      .get(`/api/global/users/${userId}`)
      .set(opts?.headers ? opts.headers : this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(opts?.status ? opts.status : 200)
  }
}
