import sdk from "../../sdk"
import {
  Ctx,
  FetchWorkspaceConnectionsResponse,
  CreateWorkspaceConnectionRequest,
  WorkspaceConnectionResponse,
  WorkspaceConnection,
  RestAuthType,
  UpdateWorkspaceConnectionRequest,
  PASSWORD_REPLACEMENT,
} from "@budibase/types"
import { findHBSBlocks } from "@budibase/string-templates"

const ENV_VAR_PREFIX = "env."

function useEnvVars(str: any): boolean {
  if (typeof str !== "string") {
    return false
  }
  const blocks = findHBSBlocks(str)
  return blocks.some(block => block.includes(ENV_VAR_PREFIX))
}

function scrubSecret(value: string): string {
  return useEnvVars(value) ? value : PASSWORD_REPLACEMENT
}

function toWorkspaceConnectionResponse(
  connection: WorkspaceConnection
): WorkspaceConnectionResponse {
  return {
    _id: connection._id!,
    _rev: connection._rev!,
    name: connection.name,
    type: connection.type,
    templateId: connection.templateId,
    templateVersion: connection.templateVersion,
    baseUrl: connection.baseUrl,
    auth: connection.auth.map(authConfig => {
      if (authConfig.type === RestAuthType.BASIC) {
        return {
          ...authConfig,
          config: {
            username: authConfig.config.username,
            password: scrubSecret(authConfig.config.password),
          },
        }
      } else if (authConfig.type === RestAuthType.BEARER) {
        return {
          ...authConfig,
          config: {
            token: scrubSecret(authConfig.config.token),
          },
        }
      } else if (authConfig.type === "apiKey") {
        return {
          ...authConfig,
          config: {
            location: authConfig.config.location,
            key: authConfig.config.key,
            value: scrubSecret(authConfig.config.value),
          },
        }
      } else if (authConfig.type === "oauth2") {
        return {
          ...authConfig,
          clientSecret: scrubSecret(authConfig.clientSecret),
        }
      }
      return authConfig as any
    }),
    props: connection.props,
  }
}

export async function fetch(ctx: Ctx<void, FetchWorkspaceConnectionsResponse>) {
  const connections = await sdk.connections.fetch()

  ctx.body = {
    connections: connections.map(toWorkspaceConnectionResponse),
  }
}

export async function create(
  ctx: Ctx<
    CreateWorkspaceConnectionRequest,
    { connection: WorkspaceConnectionResponse }
  >
) {
  const { body } = ctx.request

  const newConnection = {
    name: body.name,
    type: body.type,
    templateId: body.templateId,
    templateVersion: body.templateVersion,
    baseUrl: body.baseUrl,
    auth: body.auth,
    props: body.props,
  }

  const connection = await sdk.connections.create(newConnection)
  ctx.status = 201
  ctx.body = {
    connection: toWorkspaceConnectionResponse(connection),
  }
}

export async function edit(
  ctx: Ctx<
    UpdateWorkspaceConnectionRequest,
    { connection: WorkspaceConnectionResponse }
  >
) {
  const { body } = ctx.request

  if (ctx.params.id !== body._id) {
    ctx.throw("Path and body ids do not match", 400)
  }

  const updated = {
    _id: body._id,
    _rev: body._rev,
    name: body.name,
    type: body.type,
    templateId: body.templateId,
    templateVersion: body.templateVersion,
    baseUrl: body.baseUrl,
    auth: body.auth,
    props: body.props,
  }

  const connection = await sdk.connections.update(updated)
  ctx.body = {
    connection: toWorkspaceConnectionResponse(connection),
  }
}

export async function remove(ctx: Ctx<void, void>) {
  const { id, rev } = ctx.params

  await sdk.connections.remove(id, rev)
  ctx.status = 204
}
