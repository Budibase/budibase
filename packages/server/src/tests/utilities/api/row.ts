import {
  PatchRowRequest,
  SaveRowRequest,
  Row,
  ValidateResponse,
  ExportRowsRequest,
  BulkImportRequest,
  BulkImportResponse,
} from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class RowAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  get = async (
    sourceId: string,
    rowId: string,
    { expectStatus } = { expectStatus: 200 }
  ) => {
    const request = this.request
      .get(`/api/${sourceId}/rows/${rowId}`)
      .set(this.config.defaultHeaders())
      .expect(expectStatus)
    if (expectStatus !== 404) {
      request.expect("Content-Type", /json/)
    }
    return request
  }

  getEnriched = async (
    sourceId: string,
    rowId: string,
    { expectStatus } = { expectStatus: 200 }
  ) => {
    const request = this.request
      .get(`/api/${sourceId}/${rowId}/enrich`)
      .set(this.config.defaultHeaders())
      .expect(expectStatus)
    if (expectStatus !== 404) {
      request.expect("Content-Type", /json/)
    }
    return request
  }

  save = async (
    tableId: string,
    row: SaveRowRequest,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<Row> => {
    const resp = await this.request
      .post(`/api/${tableId}/rows`)
      .send(row)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
    return resp.body as Row
  }

  validate = async (
    sourceId: string,
    row: SaveRowRequest,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<ValidateResponse> => {
    const resp = await this.request
      .post(`/api/${sourceId}/rows/validate`)
      .send(row)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
    return resp.body as ValidateResponse
  }

  patch = async (
    sourceId: string,
    row: PatchRowRequest,
    { expectStatus } = { expectStatus: 200 }
  ) => {
    return this.request
      .patch(`/api/${sourceId}/rows`)
      .send(row)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
  }

  delete = async (
    sourceId: string,
    rows: Row | string | (Row | string)[],
    { expectStatus } = { expectStatus: 200 }
  ) => {
    return this.request
      .delete(`/api/${sourceId}/rows`)
      .send(Array.isArray(rows) ? { rows } : rows)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
  }

  fetch = async (
    sourceId: string,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<Row[]> => {
    const request = this.request
      .get(`/api/${sourceId}/rows`)
      .set(this.config.defaultHeaders())
      .expect(expectStatus)

    return (await request).body
  }

  exportRows = async (
    tableId: string,
    body: ExportRowsRequest,
    { expectStatus } = { expectStatus: 200 }
  ) => {
    const request = this.request
      .post(`/api/${tableId}/rows/exportRows?format=json`)
      .set(this.config.defaultHeaders())
      .send(body)
      .expect("Content-Type", /json/)
      .expect(expectStatus)
    return request
  }

  bulkImport = async (
    tableId: string,
    body: BulkImportRequest,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<BulkImportResponse> => {
    let request = this.request
      .post(`/api/tables/${tableId}/import`)
      .send(body)
      .set(this.config.defaultHeaders())
      .expect(expectStatus)
    return (await request).body
  }

  search = async (
    sourceId: string,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<Row[]> => {
    const request = this.request
      .post(`/api/${sourceId}/search`)
      .set(this.config.defaultHeaders())
      .expect(expectStatus)

    return (await request).body
  }
}
