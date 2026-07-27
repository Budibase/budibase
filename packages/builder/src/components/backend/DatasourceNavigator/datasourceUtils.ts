import { TableNames } from "@/constants"
import { DEFAULT_BB_DATASOURCE_ID } from "@/constants/backend"
import { INTERNAL_TABLE_SOURCE_ID, SourceName } from "@budibase/types"

interface DatasourceTable {
  _id: string
  sourceId?: string
  name?: string
  views?: Record<string, unknown>
  [key: string]: unknown
}

interface DatasourceQuery {
  _id: string
  datasourceId?: string
  name?: string
  [key: string]: unknown
}

interface NavigatorDatasource {
  _id: string
  name?: string
  source?: string
  entities?: DatasourceTable[] | Record<string, DatasourceTable>
  [key: string]: unknown
}

interface RouteParams {
  datasourceId?: string
  queryId?: string
  tableId?: string
}

type IsActive = (route: string) => boolean

interface TablesState {
  list: DatasourceTable[]
  selected?: { _id?: string }
}

interface QueriesState {
  list: DatasourceQuery[]
  selectedQueryId?: string
}

interface ViewsState {
  selected?: { name?: string }
}

interface ViewsV2State {
  selected?: { tableId?: string }
}

interface DatasourcesState {
  list?: NavigatorDatasource[]
  selectedDatasourceId?: string
}

interface EnrichedDatasource extends NavigatorDatasource {
  selected: boolean
  containsSelected: boolean
  open: boolean
  queries: DatasourceQuery[]
  tables: DatasourceTable[]
  show: boolean
}

interface ShowDatasourceOpenParams {
  selected: boolean
  containsSelected: boolean
  dsToggledStatus?: boolean
  searchTerm?: string
  onlyOneSource: boolean
}

const defaultParams: RouteParams = {}
const defaultIsActive: IsActive = () => false
const defaultTablesState: TablesState = { list: [] }
const defaultQueriesState: QueriesState = { list: [] }
const defaultViewsState: ViewsState = {}
const defaultViewsV2State: ViewsV2State = {}

export const canCreateDatasourceQuery = (datasource?: {
  _id?: string
  source?: string
}) => {
  return (
    datasource?._id !== INTERNAL_TABLE_SOURCE_ID &&
    datasource?._id !== DEFAULT_BB_DATASOURCE_ID &&
    datasource?.source !== SourceName.GOOGLE_SHEETS
  )
}

const showDatasourceOpen = ({
  selected,
  containsSelected,
  dsToggledStatus,
  searchTerm,
  onlyOneSource,
}: ShowDatasourceOpenParams) => {
  // We want to display all the ds expanded while filtering ds
  if (searchTerm) {
    return true
  }

  // If the toggle status has been a value
  if (dsToggledStatus !== undefined) {
    return dsToggledStatus
  }

  if (onlyOneSource) {
    return true
  }

  return selected || containsSelected
}

const containsActiveEntity = (
  datasource: NavigatorDatasource,
  params: RouteParams,
  isActive: IsActive,
  tables: TablesState,
  queries: QueriesState,
  views: ViewsState,
  viewsV2: ViewsV2State
) => {
  // Check for being on a datasource page
  if (params.datasourceId === datasource._id) {
    return true
  }

  // Check for hardcoded datasource edge cases
  if (
    isActive("./datasource/bb_internal") &&
    datasource._id === INTERNAL_TABLE_SOURCE_ID
  ) {
    return true
  }
  if (
    isActive("./datasource/datasource_internal_bb_default") &&
    datasource._id === "datasource_internal_bb_default"
  ) {
    return true
  }

  // Check for a matching query (including the selected query when on ./query/new)
  const activeQueryId = params.queryId || queries.selectedQueryId
  if (activeQueryId) {
    const query = queries.list?.find(q => q._id === activeQueryId)
    return datasource._id === query?.datasourceId
  }

  // If there are no entities it can't contain anything
  if (!datasource.entities) {
    return false
  }

  // Get a list of table options
  const options = Array.isArray(datasource.entities)
    ? datasource.entities
    : Object.values(datasource.entities)

  // Check for a matching table
  if (params.tableId) {
    const selectedTable = tables.selected?._id
    return options.find(x => x._id === selectedTable) != null
  }

  // Check for a matching view
  const selectedView = views.selected?.name
  const viewTable =
    selectedView &&
    options.find(table => {
      return table.views?.[selectedView] != null
    })
  if (viewTable) {
    return true
  }

  // Check for a matching viewV2
  const viewV2Table = options.find(x => x._id === viewsV2.selected?.tableId)
  return viewV2Table != null
}

export const enrichDatasources = (
  datasources?: DatasourcesState,
  params: RouteParams = defaultParams,
  isActive: IsActive = defaultIsActive,
  tables: TablesState = defaultTablesState,
  queries: QueriesState = defaultQueriesState,
  views: ViewsState = defaultViewsState,
  viewsV2: ViewsV2State = defaultViewsV2State,
  toggledDatasources: Record<string, boolean | undefined> = {},
  searchTerm?: string,
  datasourceFilter: (datasource: NavigatorDatasource) => boolean = () => true
): EnrichedDatasource[] => {
  if (!datasources?.list?.length) {
    return []
  }

  const datasourceList = (datasources.list || []).filter(datasourceFilter)
  if (!datasourceList.length) {
    return []
  }

  const normalisedSearchTerm = searchTerm?.toLowerCase()
  const onlySource = datasourceList.length === 1
  return datasourceList.map(datasource => {
    const selected =
      isActive("./datasource") &&
      datasources?.selectedDatasourceId === datasource._id
    const containsSelected = containsActiveEntity(
      datasource,
      params,
      isActive,
      tables,
      queries,
      views,
      viewsV2
    )

    const dsTables = tables.list.filter(
      table =>
        table.sourceId === datasource._id && table._id !== TableNames.USERS
    )
    const dsQueries = queries.list.filter(
      query => query.datasourceId === datasource._id
    )

    const open = showDatasourceOpen({
      selected,
      containsSelected,
      dsToggledStatus: toggledDatasources[datasource._id],
      searchTerm: normalisedSearchTerm,
      onlyOneSource: onlySource,
    })

    const visibleDsQueries = !normalisedSearchTerm
      ? dsQueries
      : dsQueries.filter(
          q => (q.name?.toLowerCase() || "").indexOf(normalisedSearchTerm) > -1
        )

    const visibleDsTables = dsTables
      .map(t => ({
        ...t,
        views: !normalisedSearchTerm
          ? t.views
          : Object.keys(t.views || {})
              .filter(
                viewName =>
                  viewName.toLowerCase().indexOf(normalisedSearchTerm) > -1
              )
              .reduce<Record<string, unknown>>(
                (acc, viewName) => ({
                  ...acc,
                  [viewName]: t.views?.[viewName],
                }),
                {}
              ),
      }))
      .filter(
        table =>
          !normalisedSearchTerm ||
          (table.name?.toLowerCase() || "").indexOf(normalisedSearchTerm) >
            -1 ||
          Object.keys(table.views || {}).length > 0
      )

    const isRESTWithNoQueries =
      datasource.source === SourceName.REST && dsQueries.length === 0

    const datasourceNameMatches =
      normalisedSearchTerm != null
        ? datasource.name?.toLowerCase().includes(normalisedSearchTerm)
        : false

    const show = !!(
      !isRESTWithNoQueries &&
      (!normalisedSearchTerm ||
        datasourceNameMatches ||
        visibleDsQueries.length ||
        visibleDsTables.length)
    )

    return {
      ...datasource,
      selected,
      containsSelected,
      open,
      queries: datasourceNameMatches ? dsQueries : visibleDsQueries,
      tables: datasourceNameMatches ? dsTables : visibleDsTables,
      show,
    }
  })
}
