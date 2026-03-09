import {
  CreatePlaybookRequest,
  CreatePlaybookResponse,
  Ctx,
  ExportPlaybookRequest,
  ExportPlaybookResponse,
  FetchPlaybooksResponse,
  ImportPlaybookRequest,
  ImportPlaybookResponse,
  Playbook,
  PlaybookResponse,
  RequiredKeys,
  UpdatePlaybookRequest,
  UpdatePlaybookResponse,
  WithoutDocMetadata,
} from "@budibase/types"
import type { File, Files } from "formidable"
import sdk from "../../sdk"

const toPlaybookResponse = (playbook: Playbook): PlaybookResponse => ({
  _id: playbook._id!,
  _rev: playbook._rev!,
  name: playbook.name,
  description: playbook.description,
  color: playbook.color,
  createdAt: String(playbook.createdAt),
  updatedAt: playbook.updatedAt,
})

export async function fetch(ctx: Ctx<void, FetchPlaybooksResponse>) {
  const playbooks = await sdk.playbooks.fetch()
  ctx.body = {
    playbooks: playbooks.map(toPlaybookResponse),
  }
}

export async function create(
  ctx: Ctx<CreatePlaybookRequest, CreatePlaybookResponse>
) {
  const { body } = ctx.request
  const playbook: WithoutDocMetadata<Playbook> = {
    name: body.name,
    description: body.description,
    color: body.color,
  }

  const created = await sdk.playbooks.create(playbook)
  ctx.status = 201
  ctx.body = {
    playbook: toPlaybookResponse(created),
  }
}

export async function update(
  ctx: Ctx<UpdatePlaybookRequest, UpdatePlaybookResponse>
) {
  const { body } = ctx.request

  if (ctx.params.id !== body._id) {
    ctx.throw("Path and body ids do not match", 400)
  }

  const playbook: RequiredKeys<Playbook> = {
    _id: body._id,
    _rev: body._rev,
    _deleted: undefined,
    name: body.name,
    description: body.description,
    color: body.color,
    createdAt: body.createdAt,
    updatedAt: body.updatedAt,
  }
  const updated = await sdk.playbooks.update(playbook)
  ctx.body = {
    playbook: toPlaybookResponse(updated),
  }
}

export async function remove(ctx: Ctx<void, void>) {
  const { id, rev } = ctx.params
  await sdk.playbooks.remove(id, rev)
  ctx.status = 204
}

export async function exportBundle(
  ctx: Ctx<ExportPlaybookRequest, ExportPlaybookResponse>
) {
  const { id } = ctx.params
  const playbook = await sdk.playbooks.get(id)
  if (!playbook) {
    ctx.throw(404, `Playbook with id '${id}' not found.`)
  }

  const encryptPassword = ctx.request.body?.encryptPassword || undefined

  ctx.req.setTimeout(0)

  const extension = encryptPassword ? "enc.tar.gz" : "tar.gz"
  const identifier = `${playbook.name}-playbook-export-${Date.now()}.${extension}`
  ctx.attachment(identifier)
  ctx.body = await sdk.playbooks.streamExportPlaybook({
    playbookId: id,
    encryptPassword,
  })
}

type PlaybookImportFiles = Files & {
  file?: File | File[]
  playbookExport?: File | File[]
}

export async function importBundle(
  ctx: Ctx<ImportPlaybookRequest, ImportPlaybookResponse>
) {
  const files = ctx.request.files as PlaybookImportFiles | undefined
  const playbookExport = files?.playbookExport ?? files?.file

  if (!playbookExport) {
    ctx.throw(400, "Must supply Playbook export file to import")
  }
  if (Array.isArray(playbookExport)) {
    ctx.throw(400, "Must only supply one Playbook export")
  }

  ctx.body = await sdk.playbooks.importPlaybook(
    {
      path: playbookExport.path!,
    },
    {
      encryptPassword: ctx.request.body?.encryptPassword || undefined,
    }
  )
}
