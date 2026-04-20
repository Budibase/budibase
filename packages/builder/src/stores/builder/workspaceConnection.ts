import { DerivedBudiStore } from "../BudiStore"
import type {
  Datasource,
  OAuth2Config,
  Query,
  UIInternalDatasource,
} from "@budibase/types"
import { SourceName } from "@budibase/types"
import type { UIWorkspaceConnection } from "@/types"
import type { Writable } from "svelte/store"
import { derived } from "svelte/store"
import { oauth2 } from "./oauth2"
import { datasources } from "./datasources"
import { queries } from "./queries"
import { restTemplates } from "./restTemplates"

export interface DraftConnection {
  datasource: Partial<Datasource>
  query: Partial<Query>
  key: number
  templateId?: string
  dirty: boolean
}

export interface DraftDatasource {
  _id: string
  name: string
  source: string
  restTemplateId?: string
  selected: boolean
  containsSelected: boolean
  open: boolean
  show: boolean
  tables: never[]
  queries: DraftQuery[]
}

export interface DraftQuery {
  _id: string
  name: string
  queryVerb: string | undefined
  datasourceId?: string
}

interface WorkspaceConnectionStoreState {
  loading: boolean
  error?: string
  selectedConnectionId: string | null
  draft: DraftConnection | null
}

interface DerivedWorkspaceConnectionStoreState
  extends WorkspaceConnectionStoreState {
  list: UIWorkspaceConnection[]
  selected?: UIWorkspaceConnection
  draftDatasource: DraftDatasource | null
  draftQuery: DraftQuery | null
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

const buildDraftNavEntries = (
  draft: DraftConnection | null,
  list: UIWorkspaceConnection[],
  savedQueries: Query[]
): {
  draftDatasource: DraftDatasource | null
  draftQuery: DraftQuery | null
} => {
  if (!draft) {
    return { draftDatasource: null, draftQuery: null }
  }

  const verb = draft.query?.queryVerb ?? (draft.templateId ? undefined : "read")
  const draftDatasourceId = draft.query?.datasourceId

  // Inject into the real datasource's nav entry only if it already has
  // saved queries (meaning it's visible in the nav)
  const draftDatasourceVisible =
    !!draftDatasourceId &&
    savedQueries.some(q => q.datasourceId === draftDatasourceId)

  const draftQuery: DraftQuery | null = draftDatasourceVisible
    ? {
        _id: "__draft_query__",
        name: draft.query.name ?? "Untitled request",
        queryVerb: verb,
        datasourceId: draftDatasourceId,
      }
    : null

  const liveConnection = draftDatasourceId
    ? list.find(c => c.sourceId === draftDatasourceId)
    : undefined

  const draftDatasource: DraftDatasource | null = !draftDatasourceVisible
    ? {
        _id: "__draft__",
        name: liveConnection?.name ?? draft.datasource.name ?? "New API",
        source: "REST",
        restTemplateId: draft.templateId,
        selected: true,
        containsSelected: true,
        open: true,
        show: true,
        tables: [],
        queries: [
          {
            _id: "__draft_query__",
            name: draft.query.name ?? "Untitled request",
            queryVerb: verb,
          },
        ],
      }
    : null

  return { draftDatasource, draftQuery }
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
    icon: template?.icon
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
        [store, oauth2, datasources, queries],
        ([
          $store,
          $oauth2,
          $ds,
          $queries,
        ]): DerivedWorkspaceConnectionStoreState => {
          const list: UIWorkspaceConnection[] = [
            ...$oauth2.configs.map(fromOAuth2),
            ...filterRESTDatasources($ds.list).map(fromRESTDatasource),
          ]

          list.sort((a, b) => a.name.localeCompare(b.name))

          const { draftDatasource, draftQuery } = buildDraftNavEntries(
            $store.draft,
            list,
            $queries.list || []
          )

          return {
            ...$store,
            list,
            selected: list.find(
              c => c.sourceId === $store.selectedConnectionId
            ),
            draftDatasource,
            draftQuery,
          }
        }
      )
    }

    super(
      {
        loading: false,
        selectedConnectionId: null,
        draft: null,
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

  startDraft() {
    this.store.update(s => ({
      ...s,
      draft: {
        datasource: { source: SourceName.REST, name: "New API" },
        query: { name: "Untitled request" },
        key: Date.now(),
        dirty: false,
      },
    }))
  }

  updateDraft(patch: Partial<Omit<DraftConnection, "key">>) {
    this.store.update(s => {
      if (!s.draft) return s
      const datasourceChanged =
        patch.query?.datasourceId !== undefined &&
        patch.query.datasourceId !== s.draft.query.datasourceId
      return {
        ...s,
        draft: {
          ...s.draft,
          ...patch,
          datasource: { ...s.draft.datasource, ...patch.datasource },
          query: { ...s.draft.query, ...patch.query },
          dirty: datasourceChanged ? false : s.draft.dirty,
        },
      }
    })
  }

  updateDraftQuery(patch: Partial<Query>) {
    this.store.update(s => {
      if (!s.draft) return s
      return {
        ...s,
        draft: { ...s.draft, query: { ...s.draft.query, ...patch } },
      }
    })
  }

  markDraftDirty() {
    this.store.update(s => {
      if (!s.draft || s.draft.dirty) return s
      return { ...s, draft: { ...s.draft, dirty: true } }
    })
  }

  discardDraft() {
    this.store.update(s => ({ ...s, draft: null }))
  }
}

export const workspaceConnections = new WorkspaceConnectionStore()
