import type { Datasource } from "@budibase/types"
import { derived, type Writable } from "svelte/store"
import { DerivedBudiStore } from "../BudiStore"
import { datasources } from "../builder/datasources"
import {
  deriveKnowledgeConnections,
  type KnowledgeConnectionsState,
} from "./knowledgeConnectionsUtils"

class KnowledgeConnectionsStore extends DerivedBudiStore<
  KnowledgeConnectionsState,
  KnowledgeConnectionsState
> {
  constructor() {
    const makeDerivedStore = (_store: Writable<KnowledgeConnectionsState>) =>
      derived([datasources], ([$datasources]) => {
        const list = $datasources.rawList as Datasource[]
        return deriveKnowledgeConnections(list)
      })

    super({ connections: [], sharePointDatasourceIds: [] }, makeDerivedStore)
  }
}

export const knowledgeConnectionsStore = new KnowledgeConnectionsStore()
