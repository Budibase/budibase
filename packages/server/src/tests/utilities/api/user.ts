import {
  FetchUserMetadataResponse,
  FindUserMetadataResponse,
  Flags,
  UserMetadata,
} from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"
import { DocumentInsertResponse } from "@budibase/nano"

export class UserAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  fetch = async (
    { expectStatus } = { expectStatus: 200 }
  ): Promise<FetchUserMetadataResponse> => {
    const res = await this.request
      .get(`/api/users/metadata`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)

    if (res.status !== expectStatus) {
      throw new Error(
        `Expected status ${expectStatus} but got ${
          res.status
        } with body ${JSON.stringify(res.body)}`
      )
    }

    return res.body
  }

  find = async (
    id: string,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<FindUserMetadataResponse> => {
    const res = await this.request
      .get(`/api/users/metadata/${id}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)

    if (res.status !== expectStatus) {
      throw new Error(
        `Expected status ${expectStatus} but got ${
          res.status
        } with body ${JSON.stringify(res.body)}`
      )
    }

    return res.body
  }

  update = async (
    user: UserMetadata,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<DocumentInsertResponse> => {
    const res = await this.request
      .put(`/api/users/metadata`)
      .set(this.config.defaultHeaders())
      .send(user)
      .expect("Content-Type", /json/)

    if (res.status !== expectStatus) {
      throw new Error(
        `Expected status ${expectStatus} but got ${
          res.status
        } with body ${JSON.stringify(res.body)}`
      )
    }

    return res.body as DocumentInsertResponse
  }

  updateSelf = async (
    user: UserMetadata,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<DocumentInsertResponse> => {
    const res = await this.request
      .post(`/api/users/metadata/self`)
      .set(this.config.defaultHeaders())
      .send(user)
      .expect("Content-Type", /json/)

    if (res.status !== expectStatus) {
      throw new Error(
        `Expected status ${expectStatus} but got ${
          res.status
        } with body ${JSON.stringify(res.body)}`
      )
    }

    return res.body as DocumentInsertResponse
  }

  destroy = async (
    id: string,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<{ message: string }> => {
    const res = await this.request
      .delete(`/api/users/metadata/${id}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)

    if (res.status !== expectStatus) {
      throw new Error(
        `Expected status ${expectStatus} but got ${
          res.status
        } with body ${JSON.stringify(res.body)}`
      )
    }

    return res.body as { message: string }
  }

  setFlag = async (
    flag: string,
    value: any,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<{ message: string }> => {
    const res = await this.request
      .post(`/api/users/flags`)
      .set(this.config.defaultHeaders())
      .send({ flag, value })
      .expect("Content-Type", /json/)

    if (res.status !== expectStatus) {
      throw new Error(
        `Expected status ${expectStatus} but got ${
          res.status
        } with body ${JSON.stringify(res.body)}`
      )
    }

    return res.body as { message: string }
  }

  getFlags = async (
    { expectStatus } = { expectStatus: 200 }
  ): Promise<Flags> => {
    const res = await this.request
      .get(`/api/users/flags`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)

    if (res.status !== expectStatus) {
      throw new Error(
        `Expected status ${expectStatus} but got ${
          res.status
        } with body ${JSON.stringify(res.body)}`
      )
    }

    return res.body as Flags
  }
}
