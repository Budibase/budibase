import { checkSlashesInUrl } from "../../../../utilities"

export function generateMakeRequest(apiKey: string, setup: any) {
  const request = setup.getRequest()
  const config = setup.getConfig()
  return async (
    method: string,
    endpoint: string,
    body?: any,
    intAppId: string = config.getAppId()
  ) => {
    const extraHeaders: any = {
      "x-budibase-api-key": apiKey,
    }
    if (intAppId) {
      extraHeaders["x-budibase-app-id"] = intAppId
    }
    const req = request[method](
      checkSlashesInUrl(`/api/public/v1/${endpoint}`)
    ).set(config.defaultHeaders(extraHeaders))
    if (body) {
      req.send(body)
    }
    const res = await req
    expect(res.body).toBeDefined()
    return res
  }
}
