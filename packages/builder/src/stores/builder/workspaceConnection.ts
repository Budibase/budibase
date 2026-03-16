import { DerivedBudiStore } from "../BudiStore"
import type {
  Datasource,
  OAuth2Config,
  UIInternalDatasource,
} from "@budibase/types"
import type { UIWorkspaceConnection } from "@/types"
import type { Writable } from "svelte/store"
import { derived } from "svelte/store"
import { oauth2 } from "./oauth2"
import { datasources } from "./datasources"
import { restTemplates } from "./restTemplates"

interface WorkspaceConnectionStoreState {
  loading: boolean
  error?: string
  selectedConnectionId: string | null
}

interface DerivedWorkspaceConnectionStoreState
  extends WorkspaceConnectionStoreState {
  list: UIWorkspaceConnection[]
  selected?: UIWorkspaceConnection
}

const fromOAuth2 = (o: OAuth2Config): UIWorkspaceConnection => {
  return {
    ...o,
    source: "oauth2" as const,
    sourceId: o._id!,
    name: o.name,
    icon: { type: "icon", value: "key" },
  }
}

const fromRESTDatasource = (
  ds: Datasource | UIInternalDatasource
): UIWorkspaceConnection => {
  const templateRef = ds?.restTemplateId || ds?.restTemplate
  const template = templateRef ? restTemplates.get(templateRef) : undefined
  return {
    source: "datasource" as const,
    sourceId: ds._id!,
    name: ds.name || "REST Datasource",
    icon: template
      ? { type: "asset", value: template.icon }
      : { type: "icon", value: "globe-simple" },
    auth: ds?.config?.authConfigs || [],
    props: {
      headers: ds?.config?.defaultHeaders || {},
      staticVariables: ds?.config?.staticVariables || {},
      query: ds?.config?.defaultQueryParameters || {},
    },
  }
}

const filterRESTDatasources = (
  sources: (Datasource | UIInternalDatasource)[]
) => {
  return (sources || []).filter(d => d.source === "REST")
}

export class WorkspaceConnectionStore extends DerivedBudiStore<
  WorkspaceConnectionStoreState,
  DerivedWorkspaceConnectionStoreState
> {
  constructor() {
    const makeDerivedStore = (
      store: Writable<WorkspaceConnectionStoreState>
    ) => {
      return derived(
        [store, oauth2, datasources],
        ([$store, $oauth2, $ds]): DerivedWorkspaceConnectionStoreState => {
          const list: UIWorkspaceConnection[] = [
            ...$oauth2.configs.map(fromOAuth2),
            ...filterRESTDatasources($ds.list).map(fromRESTDatasource),
          ]

          list.sort((a, b) => a.name.localeCompare(b.name))

          return {
            ...$store,
            list,
            selected: list.find(
              c => c.sourceId === $store.selectedConnectionId
            ),
          }
        }
      )
    }

    super(
      {
        loading: false,
        selectedConnectionId: null,
      },
      makeDerivedStore
    )
  }

  select(id: string | null) {
    this.store.update(s => {
      if (s.selectedConnectionId === id) {
        return s
      }
      return { ...s, selectedConnectionId: id }
    })
  }
}

export const workspaceConnections = new WorkspaceConnectionStore()
