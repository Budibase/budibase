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

  searchUsers = (
    id: string,
    params?: { bookmark?: string; emailSearch?: string }
  ) => {
    let url = `/api/global/groups/${id}/users?`
    if (params?.bookmark) {
      url += `bookmark=${params.bookmark}&`
    }
    if (params?.emailSearch) {
      url += `emailSearch=${params.emailSearch}&`
    }
    return this.request
      .get(url)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }

  updateGroupUsers = (
    id: string,
    body: { add: string[]; remove: string[] }
  ) => {
    return this.request
      .post(`/api/global/groups/${id}/users`)
      .send(body)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }
}
