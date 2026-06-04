import {
  CreateProjectRequest,
  CreateProjectResponse,
  Ctx,
  FetchProjectsResponse,
  Project,
  ProjectResponse,
  UpdateProjectRequest,
  UpdateProjectResponse,
  WithoutDocMetadata,
} from "@budibase/types"
import sdk from "../../sdk"

const toProjectResponse = (project: Project): ProjectResponse => ({
  _id: project._id!,
  _rev: project._rev!,
  name: project.name,
  description: project.description,
  color: project.color,
  createdAt: String(project.createdAt),
  updatedAt: project.updatedAt,
})

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
  const project: WithoutDocMetadata<Project> = {
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
