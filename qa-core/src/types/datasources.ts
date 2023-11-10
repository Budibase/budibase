export interface DatasourceRequest {
  datasource: {
    name: string
    plus?: boolean
    source: string
    type: string
    config: {
      connectionString?: string
      db?: string
      database?: string
      host?: string
      password?: string
      port?: string
      schema?: string
      user?: string
      defaultHeaders?: {}
      rejectUnauthorized?: boolean
      url?: string
    }
  }
  fetchSchema: boolean
}
