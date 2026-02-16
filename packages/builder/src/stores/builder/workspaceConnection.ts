import { API } from "@/api"
import { DerivedBudiStore } from "../BudiStore"
import type {
  CreateWorkspaceConnectionRequest,
  Datasource,
  OAuth2Config,
  UIInternalDatasource,
  UpdateWorkspaceConnectionRequest,
  WorkspaceConnectionResponse,
} from "@budibase/types"
import type { UIWorkspaceConnection } from "@/types"
import type { Writable } from "svelte/store"
import { derived } from "svelte/store"
import { oauth2 } from "./oauth2"
import { datasources } from "./datasources"
import { restTemplates } from "./restTemplates"

interface WorkspaceConnectionStoreState {
  connections: WorkspaceConnectionResponse[]
  loading: boolean
  error?: string
  selectedConnectionId: string | null
}

interface DerivedWorkspaceConnectionStoreState
  extends WorkspaceConnectionStoreState {
  list: UIWorkspaceConnection[]
  selected?: UIWorkspaceConnection
}

const fromWorkspaceConnection = (
  c: WorkspaceConnectionResponse
): UIWorkspaceConnection => {
  const template = c.templateId
    ? restTemplates.getById(c.templateId)
    : undefined
  return {
    ...c,
    source: "workspace_connection" as const,
    sourceId: c._id!,
    icon: template
      ? { type: "asset", value: template.icon }
      : { type: "icon", value: "lock-simple" },
  }
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
      : { type: "icon", value: "webhooks-logo" },
    auth: ds?.config?.authConfigs || [],
    props: {
      headers: ds?.config?.defaultHeaders || {},
      staticVariables: ds?.config?.staticVariables || {},
    },
  }
}

const filterRESTDatasources = (
  sources: (Datasource | UIInternalDatasource)[]
) => {
  return (sources || []).filter(d => {
    // Exclude datasources created from templates - their auth should be
    // managed via WorkspaceConnection instead
    if (d?.restTemplateId) {
      return false
    }
    const staticVars = Object.keys(d?.config?.staticVariables || {})
    const headers = Object.keys(d?.config?.defaultHeaders || {})
    return d?.config?.authConfigs?.length || staticVars.length || headers.length
  })
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
            ...$store.connections.map(fromWorkspaceConnection),
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
        connections: [],
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

  async fetch() {
    this.store.update(store => ({
      ...store,
      loading: true,
    }))
    try {
      const connections = await API.workspaceConnections.fetch()
      this.store.update(store => ({
        ...store,
        connections,
        loading: false,
      }))
    } catch (e: any) {
      this.store.update(store => ({
        ...store,
        loading: false,
        error: e.message,
      }))
    }
  }

  async create(connection: CreateWorkspaceConnectionRequest) {
    const created = await API.workspaceConnections.create(connection)
    await this.fetch()
    return created
  }

  async edit(config: UpdateWorkspaceConnectionRequest) {
    await API.workspaceConnections.update(config)
    await this.fetch()
  }

  async delete(id: string, rev: string) {
    await API.workspaceConnections.delete(id, rev)
    await this.fetch()
  }
}

export const workspaceConnections = new WorkspaceConnectionStore()
