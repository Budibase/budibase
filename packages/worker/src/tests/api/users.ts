import {
  BulkCreateUsersRequest,
  BulkCreateUsersResponse,
  BulkDeleteUsersRequest,
  CreateUserResponse,
  User,
  UserDetails,
} from "@budibase/types"
import TestConfiguration from "../TestConfiguration"

export class UserAPI {
  config: TestConfiguration
  request: any

  constructor(config: TestConfiguration) {
    this.config = config
    this.request = config.request
  }

  // INVITE

  sendUserInvite = async (sendMailMock: any) => {
    await this.config.saveSmtpConfig()
    await this.config.saveSettingsConfig()
    const res = await this.request
      .post(`/api/global/users/invite`)
      .send({
        email: "invite@test.com",
      })
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)

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

  // BULK

  bulkCreateUsers = async (users: User[], groups: any[] = []) => {
    const body: BulkCreateUsersRequest = { users, groups }
    const res = await this.request
      .post(`/api/global/users/bulkCreate`)
      .send(body)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)

    return res.body as BulkCreateUsersResponse
  }

  bulkDeleteUsers = (body: BulkDeleteUsersRequest, status?: number) => {
    return this.request
      .post(`/api/global/users/bulkDelete`)
      .send(body)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(status ? status : 200)
  }

  // USER

  saveUser = (user: User, status?: number) => {
    return this.request
      .post(`/api/global/users`)
      .send(user)
      .set(this.config.defaultHeaders())
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
}
