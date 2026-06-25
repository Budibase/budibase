import {
  CreateProjectRequest,
  CreateProjectResponse,
  Ctx,
  ExportProjectRequest,
  ExportProjectResponse,
  FetchProjectsResponse,
  ImportProjectRequest,
  ImportProjectResponse,
  KoaFile,
  Project,
  ProjectResponse,
  UpdateProjectRequest,
  UpdateProjectResponse,
} from "@budibase/types"
import sdk from "../../sdk"

export const toProjectResponse = (project: Project): ProjectResponse => {
  return {
    _id: project._id!,
    _rev: project._rev!,
    name: project.name,
    description: project.description,
    color: project.color,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }
}

export async function fetch(ctx: Ctx<void, FetchProjectsResponse>) {
  const projects = await sdk.projects.fetch()
  ctx.body = {
    projects: projects.map(toProjectResponse),
  }
}

export async function create(
  ctx: Ctx<CreateProjectRequest, CreateProjectResponse>
) {
  const { body } = ctx.request
  const project = {
    name: body.name,
    description: body.description,
    color: body.color,
  }

  const created = await sdk.projects.create(project)
  ctx.status = 201
  ctx.body = {
    project: toProjectResponse(created),
  }
}

export async function update(
  ctx: Ctx<UpdateProjectRequest, UpdateProjectResponse>
) {
  const { body } = ctx.request

  if (ctx.params.id !== body._id) {
    ctx.throw(400, "Path and body ids do not match")
  }

  const project = {
    _id: body._id,
    _rev: body._rev,
    name: body.name,
    description: body.description,
    color: body.color,
  }
  const updated = await sdk.projects.update(project)
  ctx.body = {
    project: toProjectResponse(updated),
  }
}

export async function remove(ctx: Ctx<void, void>) {
  const { id, rev } = ctx.params
  await sdk.projects.remove(id, rev)
  ctx.status = 204
}

export async function exportBundle(
  ctx: Ctx<ExportProjectRequest, ExportProjectResponse>
) {
  const { id } = ctx.params
  const project = await sdk.projects.get(id)
  if (!project) {
    ctx.throw(404, `Project with id '${id}' not found.`)
  }

  const encryptPassword = ctx.request.body?.encryptPassword || undefined

  ctx.req.setTimeout(0)

  const extension = encryptPassword ? "enc.tar.gz" : "tar.gz"
  const identifier = `${project.name}-project-export-${Date.now()}.${extension}`
  ctx.attachment(identifier)
  ctx.body = await sdk.projects.streamExportProject({
    projectId: id,
    encryptPassword,
  })
}

type ProjectImportFiles = {
  file?: KoaFile | KoaFile[]
}

export async function importBundle(
  ctx: Ctx<ImportProjectRequest, ImportProjectResponse>
) {
  const files = ctx.request.files as ProjectImportFiles | undefined
  const file = files?.file

  if (!file) {
    ctx.throw(400, "Must supply Project export file to import")
  }
  if (Array.isArray(file)) {
    ctx.throw(400, "Must only supply one Project export")
  }
  const filePath = file.filepath
  if (!filePath) {
    ctx.throw(400, "Must supply Project export file to import")
  }

  ctx.body = await sdk.projects.importProject(
    {
      path: filePath,
    },
    {
      encryptPassword: ctx.request.body?.encryptPassword || undefined,
    }
  )
}
