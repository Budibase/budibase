import { context } from "@budibase/backend-core"
import { UserCtx } from "@budibase/types"
import { Next } from "koa"
import type { File, Files } from "formidable"
import { isExpandedPublicApiEnabled } from "../features"

type AppImportFiles = Files & {
  appExport?: File | File[]
  file?: File | File[]
}

const ensureAppExportFile = (files?: AppImportFiles) => {
  if (!files) {
    return undefined
  }
  if (files.appExport) {
    return files.appExport
  }
  if (files.file) {
    return files.file
  }
  return undefined
}

export function buildImportFn(importFn: (ctx: UserCtx) => Promise<any>) {
  return async (ctx: UserCtx, next: Next) => {
    if (!(await isExpandedPublicApiEnabled())) {
      ctx.throw(403, "Endpoint unavailable, license required.")
    }
    const appExport = ensureAppExportFile(
      ctx.request.files as AppImportFiles | undefined
    )
    if (!appExport) {
      ctx.throw(400, "Must provide app export file for import.")
    }
    await context.doInWorkspaceContext(ctx.params.appId, async () => {
      await importFn(ctx)
      ctx.body = undefined
      ctx.status = 204
      await next()
    })
  }
}

export function buildExportFn(exportFn: (ctx: UserCtx) => Promise<any>) {
  return async (ctx: UserCtx, next: Next) => {
    if (!(await isExpandedPublicApiEnabled())) {
      ctx.throw(403, "Endpoint unavailable, license required.")
    }
    const { encryptPassword, excludeRows } = ctx.request.body
    await context.doInWorkspaceContext(ctx.params.appId, async () => {
      // make sure no other inputs
      ctx.request.body = {
        encryptPassword,
        excludeRows,
      }
      ctx.query.appId = ctx.params.appId
      await exportFn(ctx)
      await next()
    })
  }
}
