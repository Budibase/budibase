import { DerivedBudiStore } from "../BudiStore"
import {
  Datasource,
  OAuth2RestAuthConfig,
  isOAuth2ClientCredentialsAuthConfig,
} from "@budibase/types"
import { derived, Writable } from "svelte/store"
import { datasources, getRestTemplateIdentifier } from "../builder/datasources"

interface KnowledgeConnection {
  _id: string
  datasourceId: string
  authConfigId: string
  sourceType: "sharepoint"
  authType: "client_credentials"
  datasourceName: string
  authConfigName: string
}

interface KnowledgeConnectionsState {
  connections: KnowledgeConnection[]
}

class KnowledgeConnectionsStore extends DerivedBudiStore<
  KnowledgeConnectionsState,
  KnowledgeConnectionsState
> {
  constructor() {
    const makeDerivedStore = (_store: Writable<KnowledgeConnectionsState>) =>
      derived([datasources], ([$datasources]) => {
        const list = $datasources.rawList as Datasource[]
        const connections = list.flatMap(datasource => {
          if (
            getRestTemplateIdentifier(datasource) !== "microsoft-sharepoint"
          ) {
            return []
          }
          const authConfigs = (datasource.config?.authConfigs ||
            []) as OAuth2RestAuthConfig[]
          return authConfigs
            .filter(config => isOAuth2ClientCredentialsAuthConfig(config))
            .map(config => ({
              _id: `${datasource._id}:${config._id}`,
              datasourceId: datasource._id!,
              authConfigId: config._id,
              sourceType: "sharepoint" as const,
              authType: "client_credentials" as const,
              datasourceName: datasource.name || "Datasource",
              authConfigName: config.name || "OAuth2 config",
            }))
        })
        return { connections }
      })

    super({ connections: [] }, makeDerivedStore)
  }
}

export const knowledgeConnectionsStore = new KnowledgeConnectionsStore()
