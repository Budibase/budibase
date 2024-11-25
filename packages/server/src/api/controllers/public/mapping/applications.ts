import { Application } from "./types"
import { RequiredKeys } from "@budibase/types"

function application(body: any): RequiredKeys<Application> {
  let app = body?.application ? body.application : body
  return {
    _id: app.appId,
    name: app.name,
    url: app.url,
    status: app.status,
    createdAt: app.createdAt,
    updatedAt: app.updatedAt,
    version: app.version,
    tenantId: app.tenantId,
    lockedBy: app.lockedBy,
  }
}

function mapApplication(ctx: any): { data: Application } {
  return {
    data: application(ctx.body),
  }
}

function mapApplications(ctx: any): { data: Application[] } {
  const apps = ctx.body.map((body: any) => application(body))
  return { data: apps }
}

export default {
  mapApplication,
  mapApplications,
}
