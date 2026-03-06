import {
  CreatePlaybookRequest,
  CreatePlaybookResponse,
  Ctx,
  FetchPlaybooksResponse,
  Playbook,
  PlaybookResponse,
  RequiredKeys,
  UpdatePlaybookRequest,
  UpdatePlaybookResponse,
  WithoutDocMetadata,
} from "@budibase/types"
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
