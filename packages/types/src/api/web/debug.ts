export interface GetDiagnosticsResponse {
  budibaseVersion: string
  hosting: string
  nodeVersion: string
  platform: string
  cpuArch: string
  cpuCores: number
  cpuInfo: string
  totalMemory: string
  uptime: string
}

export interface ApiCall {
  request: {
    method: string
    url: string
    body: any
  }
  response: {
    status: number
    headers: Record<string, string>
  }
  error: {
    message: string
  }
}

export interface BugReportRequest {
  clientApiCalls: ApiCall[]
  browserUrl: string
}
