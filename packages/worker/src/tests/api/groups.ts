import { UserGroup } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class GroupsAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  saveGroup = (group: UserGroup, { expect } = { expect: 200 }) => {
    return this.request
      .post(`/api/global/groups`)
      .send(group)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expect)
  }

  deleteGroup = (id: string, rev: string) => {
    return this.request
      .delete(`/api/global/groups/${id}/${rev}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }

  searchUsers = (id: string) => {
    return this.request
      .get(`/api/global/groups/${id}/users`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }
}
