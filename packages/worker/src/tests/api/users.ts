import {
  BulkUserResponse,
  BulkUserRequest,
  InviteUsersRequest,
  User,
  CreateAdminUserRequest,
  SearchFilters,
  InviteUsersResponse,
} from "@budibase/types"
import structures from "../structures"
import { generator } from "@budibase/backend-core/tests"
import { TestAPI, TestAPIOpts } from "./base"

export class UserAPI extends TestAPI {
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
      .expect(status)
      .expect("Content-Type", /json/)

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
        password: "newpassword1",
        inviteCode: code,
        firstName: "Ted",
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

  bulkDeleteUsers = async (
    users: Array<{
      userId: string
      email: string
    }>,
    status?: number
  ) => {
    const body: BulkUserRequest = { delete: { users } }
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
        password: generator.string({ length: 12 }),
        tenantId: structures.tenant.id(),
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

  addSsoSupportInternalAPIAuth = (ssoId: string, email: string) => {
    return this.request
      .post(`/api/global/users/sso`)
      .send({ ssoId, email })
      .set(this.config.internalAPIHeaders())
  }

  addSsoSupportDefaultAuth = (ssoId: string, email: string) => {
    return this.request
      .post(`/api/global/users/sso`)
      .send({ ssoId, email })
      .set(this.config.defaultHeaders())
  }

  deleteUser = (userId: string, status?: number) => {
    return this.request
      .delete(`/api/global/users/${userId}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(status ? status : 200)
  }

  searchUsers = (
    { query }: { query?: SearchFilters },
    opts?: { status?: number; noHeaders?: boolean }
  ) => {
    const req = this.request
      .post("/api/global/users/search")
      .send({ query })
      .expect("Content-Type", /json/)
      .expect(opts?.status ? opts.status : 200)
    if (!opts?.noHeaders) {
      req.set(this.config.defaultHeaders())
    }
    return req
  }

  getUser = (userId: string, opts?: TestAPIOpts) => {
    return this.request
      .get(`/api/global/users/${userId}`)
      .set(opts?.headers ? opts.headers : this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(opts?.status ? opts.status : 200)
  }

  grantBuilderToApp = (userId: string, appId: string, statusCode = 200) => {
    return this.request
      .post(`/api/global/users/${userId}/app/${appId}/builder`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(statusCode)
  }

  revokeBuilderFromApp = (userId: string, appId: string) => {
    return this.request
      .delete(`/api/global/users/${userId}/app/${appId}/builder`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }

  onboardUser = async (
    req: InviteUsersRequest
  ): Promise<InviteUsersResponse> => {
    const resp = await this.request
      .post(`/api/global/users/onboard`)
      .send(req)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)

    if (resp.status !== 200) {
      throw new Error(
        `request failed with status ${resp.status} and body ${JSON.stringify(
          resp.body
        )}`
      )
    }

    return resp.body as InviteUsersResponse
  }
}
