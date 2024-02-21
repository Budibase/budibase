import { Response } from "supertest"
import { App, type CreateAppRequest } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"
import { AppStatus } from "../../../db/utils"
import { dbObjectAsPojo } from "oracledb"

export class ApplicationAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  create = async (app: CreateAppRequest): Promise<App> => {
    const request = this.request
      .post("/api/applications")
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)

    for (const key of Object.keys(app)) {
      request.field(key, (app as any)[key])
    }

    if (app.templateFile) {
      request.attach("templateFile", app.templateFile)
    }

    const result = await request

    if (result.statusCode !== 200) {
      fail(JSON.stringify(result.body))
    }

    return result.body as App
  }

  getRaw = async (appId: string): Promise<Response> => {
    const result = await this.request
      .get(`/api/applications/${appId}/appPackage`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return result
  }

  get = async (appId: string): Promise<App> => {
    const result = await this.getRaw(appId)
    return result.body.application as App
  }

  fetch = async ({ status }: { status?: AppStatus } = {}): Promise<App[]> => {
    let query = []
    if (status) {
      query.push(`status=${status}`)
    }

    const result = await this.request
      .get(`/api/applications${query.length ? `?${query.join("&")}` : ""}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return result.body as App[]
  }
}
