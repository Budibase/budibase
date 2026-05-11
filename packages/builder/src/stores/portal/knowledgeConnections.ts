import { DerivedBudiStore } from "../BudiStore"
import {
  AgentKnowledgeSourceType,
  Datasource,
  OAuth2RestAuthConfig,
} from "@budibase/types"
import { derived, Writable } from "svelte/store"
import { datasources, getRestTemplateIdentifier } from "../builder/datasources"

interface KnowledgeConnection {
  _id: string
  datasourceId: string
  authConfigId: string
  sourceType: AgentKnowledgeSourceType
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
            .filter(
              config =>
                config.type === "oauth2" &&
                (config.grantType === "client_credentials" ||
                  config.authType === "delegated_oauth")
            )
            .map(config => ({
            _id: `${datasource._id}:${config._id}`,
            datasourceId: datasource._id!,
            authConfigId: config._id,
            sourceType: AgentKnowledgeSourceType.SHAREPOINT,
            datasourceName: datasource.name || "Unknown Datasource",
            authConfigName: config.name || "Unknown Auth Config",
          }))
        })
        return { connections }
      })

    super({ connections: [] }, makeDerivedStore)
  }
}

export const knowledgeConnectionsStore = new KnowledgeConnectionsStore()
