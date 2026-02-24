import { events } from "@budibase/backend-core"
import {
  CreateEnvironmentVariableRequest,
  CreateEnvironmentVariableResponse,
  DeleteEnvironmentVariablesResponse,
  Environment,
  GetEnvironmentVariablesResponse,
  StatusEnvironmentVariableResponse,
  UpdateEnvironmentVariableRequest,
  UpdateEnvironmentVariableResponse,
  UserCtx,
} from "@budibase/types"
import { environmentVariables } from "../../../sdk"

export async function status(
  ctx: UserCtx<void, StatusEnvironmentVariableResponse>
) {
  ctx.body = {
    encryptionKeyAvailable: environmentVariables.isEncryptionKeyAvailable(),
  }
}

export async function fetch(
  ctx: UserCtx<void, GetEnvironmentVariablesResponse>
) {
  ctx.body = {
    variables: await environmentVariables.fetch(),
  }
}

export async function create(
  ctx: UserCtx<
    CreateEnvironmentVariableRequest,
    CreateEnvironmentVariableResponse
  >
) {
  const { name, production, development } = ctx.request.body
  await environmentVariables.update(name, { production, development })
  const environments = [Environment.PRODUCTION]
  if (production !== development) {
    environments.push(Environment.DEVELOPMENT)
  }
  await events.environmentVariable.created(name, environments)
  ctx.body = {
    message: `Environment variable "${name}" created.`,
  }
}

export async function update(
  ctx: UserCtx<
    UpdateEnvironmentVariableRequest,
    UpdateEnvironmentVariableResponse
  >
) {
  const { production, development } = ctx.request.body
  const varName = ctx.params.varName
  await environmentVariables.update(varName, { production, development })
  ctx.body = {
    message: `Environment variable "${varName}" updated.`,
  }
}

export async function destroy(
  ctx: UserCtx<void, DeleteEnvironmentVariablesResponse>
) {
  const varName = ctx.params.varName
  await environmentVariables.remove(varName)
  await events.environmentVariable.deleted(varName)
  ctx.body = {
    message: `Environment variable "${varName}" deleted.`,
  }
}
