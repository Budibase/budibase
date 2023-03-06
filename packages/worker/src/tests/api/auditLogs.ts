import { AuditLogSearchParams, SearchAuditLogsResponse } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class AuditLogAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  search = async (search: AuditLogSearchParams) => {
    const res = await this.request
      .post("/api/global/auditlogs/search")
      .send(search)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return res.body as SearchAuditLogsResponse
  }

  download = (search: AuditLogSearchParams) => {
    const query = encodeURIComponent(JSON.stringify(search))
    return this.request
      .get(`/api/global/auditlogs/download?query=${query}`)
      .set(this.config.defaultHeaders())
  }
}
