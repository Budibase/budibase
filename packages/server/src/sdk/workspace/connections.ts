import { context, docIds, HTTPError, cache } from "@budibase/backend-core"
import {
  SEPARATOR,
  WorkspaceConnection,
  DocumentType,
  WithoutDocMetadata,
  WithRequired,
  PASSWORD_REPLACEMENT,
  RestAuthType,
} from "@budibase/types"

type CreatedWorkspaceConnection = WithRequired<
  WorkspaceConnection,
  "_id" | "_rev"
>

export async function get(
  id: string
): Promise<WorkspaceConnection | undefined> {
  const db = context.getWorkspaceDB()
  return await db.tryGet(id)
}

async function cleanCache(configId: string) {
  const cacheKey = cache.CacheKey.OAUTH2_TOKEN(configId)
  await cache.destroy(cacheKey)
}

export async function fetch(): Promise<CreatedWorkspaceConnection[]> {
  const db = context.getWorkspaceDB()

  const workspaceConnections = await db.find<WorkspaceConnection>({
    selector: {
      _id: {
        $regex: `^${DocumentType.WORKSPACE_CONNECTION}${SEPARATOR}`,
      },
    },
  })

  return workspaceConnections.docs.map(doc => ({
    ...doc,
    _id: doc._id!,
    _rev: doc._rev!,
  }))
}

export async function create(
  connection: WithoutDocMetadata<WorkspaceConnection>
): Promise<CreatedWorkspaceConnection> {
  const db = context.getWorkspaceDB()

  const response = await db.put({
    _id: docIds.generateWorkspaceConnectionID(),
    ...connection,
  })

  return {
    _id: response.id,
    _rev: response.rev!,
    ...connection,
  }
}

export async function update(
  connection: CreatedWorkspaceConnection
): Promise<CreatedWorkspaceConnection> {
  const db = context.getWorkspaceDB()
  // await guardName(config.name, config._id)

  const existing = await get(connection._id)
  if (!existing) {
    throw new HTTPError(
      `WorkspaceConnection config with id '${connection._id}' not found.`,
      404
    )
  }

  const toUpdate = {
    ...connection,
    auth: connection.auth.map(authConfig => {
      const existingAuth = existing.auth.find(a => a._id === authConfig._id)
      if (!existingAuth) {
        return authConfig
      }

      if (authConfig.type === RestAuthType.BASIC) {
        return {
          ...authConfig,
          config: {
            ...authConfig.config,
            password:
              authConfig.config.password === PASSWORD_REPLACEMENT
                ? existingAuth.type === RestAuthType.BASIC
                  ? existingAuth.config.password
                  : authConfig.config.password
                : authConfig.config.password,
          },
        }
      } else if (authConfig.type === RestAuthType.BEARER) {
        return {
          ...authConfig,
          config: {
            ...authConfig.config,
            token:
              authConfig.config.token === PASSWORD_REPLACEMENT
                ? existingAuth.type === RestAuthType.BEARER
                  ? existingAuth.config.token
                  : authConfig.config.token
                : authConfig.config.token,
          },
        }
      } else if (authConfig.type === "apiKey") {
        return {
          ...authConfig,
          config: {
            ...authConfig.config,
            value:
              authConfig.config.value === PASSWORD_REPLACEMENT
                ? existingAuth.type === "apiKey"
                  ? existingAuth.config.value
                  : authConfig.config.value
                : authConfig.config.value,
          },
        }
      } else if (authConfig.type === "oauth2") {
        return {
          ...authConfig,
          clientSecret:
            authConfig.clientSecret === PASSWORD_REPLACEMENT
              ? existingAuth.type === "oauth2"
                ? existingAuth.clientSecret
                : authConfig.clientSecret
              : authConfig.clientSecret,
        }
      }

      return authConfig
    }),
  }

  const result = await db.put(toUpdate)

  await cleanCache(connection._id)

  return { ...toUpdate, _rev: result.rev }
}

export async function remove(
  workspaceConnectionID: string,
  _rev: string
): Promise<void> {
  const db = context.getWorkspaceDB()
  try {
    await db.remove(workspaceConnectionID, _rev)
  } catch (e: any) {
    if (e.status === 404) {
      throw new HTTPError(
        `Connection with id '${workspaceConnectionID}' not found.`,
        404
      )
    }
    throw e
  }

  await cleanCache(workspaceConnectionID)
}
