import { derived, get, Writable } from "svelte/store"
import {
  IntegrationTypes,
  DEFAULT_BB_DATASOURCE_ID,
  BUDIBASE_INTERNAL_DB_ID,
} from "@/constants/backend"
import { tables } from "./tables"
import { queries } from "./queries"
import { API } from "@/api"
import {
  DatasourceFeature,
  Datasource,
  Table,
  Integration,
  UIIntegration,
  SourceName,
} from "@budibase/types"
import { TableNames } from "@/constants"
import { DerivedBudiStore } from "@/stores/BudiStore"

// when building the internal DS - seems to represent it slightly differently to the backend typing of a DS
interface InternalDatasource extends Omit<Datasource, "entities"> {
  entities: Table[]
}

class TableImportError extends Error {
  errors: Record<string, string>

  constructor(errors: Record<string, string>) {
    super()
    this.name = "TableImportError"
    this.errors = errors
  }

  get description() {
    let message = ""
    for (const key in this.errors) {
      message += `${key}: ${this.errors[key]}\n`
    }
    return message
  }
}

// when building the internal DS - seems to represent it slightly differently to the backend typing of a DS
interface InternalDatasource extends Omit<Datasource, "entities"> {
  entities: Table[]
}

interface BuilderDatasourceStore {
  rawList: Datasource[]
  selectedDatasourceId: null | string
}

interface DerivedDatasourceStore extends BuilderDatasourceStore {
  list: (Datasource | InternalDatasource)[]
  selected?: Datasource | InternalDatasource
  hasDefaultData: boolean
  hasData: boolean
}

export class DatasourceStore extends DerivedBudiStore<
  BuilderDatasourceStore,
  DerivedDatasourceStore
> {
  constructor() {
    const makeDerivedStore = (store: Writable<BuilderDatasourceStore>) => {
      return derived([store, tables], ([$store, $tables]) => {
        // Set the internal datasource entities from the table list, which we're
        // able to keep updated unlike the egress generated definition of the
        // internal datasource
        let internalDS: Datasource | InternalDatasource | undefined =
          $store.rawList?.find(ds => ds._id === BUDIBASE_INTERNAL_DB_ID)
        let otherDS = $store.rawList?.filter(
          ds => ds._id !== BUDIBASE_INTERNAL_DB_ID
        )
        if (internalDS) {
          const tables: Table[] = $tables.list?.filter((table: Table) => {
            return (
              table.sourceId === BUDIBASE_INTERNAL_DB_ID &&
              table._id !== TableNames.USERS
            )
          })
          internalDS = {
            ...internalDS,
            entities: tables,
          }
        }

        // Build up enriched DS list
        // Only add the internal DS if we have at least one non-users table
        let list: (InternalDatasource | Datasource)[] = []
        if (internalDS?.entities?.length) {
          list.push(internalDS)
        }
        list = list.concat(otherDS || [])

        return {
          ...$store,
          list,
          selected: list?.find(ds => ds._id === $store.selectedDatasourceId),
          hasDefaultData: list?.some(ds => ds._id === DEFAULT_BB_DATASOURCE_ID),
          hasData: list?.length > 0,
        }
      })
    }

    super(
      {
        rawList: [],
        selectedDatasourceId: null,
      },
      makeDerivedStore
    )

    this.fetch = this.fetch.bind(this)
    this.init = this.fetch.bind(this)
    this.select = this.select.bind(this)
    this.updateSchema = this.updateSchema.bind(this)
    this.create = this.create.bind(this)
    this.delete = this.deleteDatasource.bind(this)
    this.save = this.save.bind(this)
    this.replaceDatasource = this.replaceDatasource.bind(this)
    this.getTableNames = this.getTableNames.bind(this)
  }

  async fetch() {
    const datasources = await API.getDatasources()
    this.store.update(state => ({
      ...state,
      rawList: datasources,
    }))
  }

  async init() {
    return this.fetch()
  }

  select(id: string) {
    this.store.update(state => ({
      ...state,
      selectedDatasourceId: id,
    }))
  }

  private updateDatasourceInStore(
    response: { datasource: Datasource; errors?: Record<string, string> },
    { ignoreErrors }: { ignoreErrors?: boolean } = {}
  ) {
    const { datasource, errors } = response
    if (!ignoreErrors && errors && Object.keys(errors).length > 0) {
      throw new TableImportError(errors)
    }
    this.replaceDatasource(datasource._id!, datasource)
    this.select(datasource._id!)
    return datasource
  }

  async updateSchema(datasource: Datasource, tablesFilter: string[]) {
    const response = await API.buildDatasourceSchema(
      datasource?._id!,
      tablesFilter
    )
    this.updateDatasourceInStore(response)
  }

  sourceCount(source: string) {
    return get(this.store).rawList.filter(
      datasource => datasource.source === source
    ).length
  }

  async checkDatasourceValidity(
    integration: Integration,
    datasource: Datasource
  ): Promise<{ valid: boolean; error?: string }> {
    if (integration.features?.[DatasourceFeature.CONNECTION_CHECKING]) {
      const { connected, error } = await API.validateDatasource(datasource)
      if (connected) {
        return { valid: true }
      } else {
        return { valid: false, error }
      }
    }
    return { valid: true }
  }

  async create({
    integration,
    config,
  }: {
    integration: UIIntegration
    config: Record<string, any>
  }) {
    const count = this.sourceCount(integration.name)
    const nameModifier = count === 0 ? "" : ` ${count + 1}`

    const datasource: Datasource = {
      type: "datasource",
      source: integration.name as SourceName,
      config,
      name: `${integration.friendlyName}${nameModifier}`,
      plus: integration.plus && integration.name !== IntegrationTypes.REST,
      isSQL: integration.isSQL,
    }

    const { valid, error } = await this.checkDatasourceValidity(
      integration,
      datasource
    )
    if (!valid) {
      throw new Error(`Unable to connect - ${error}`)
    }

    const response = await API.createDatasource({
      datasource,
      fetchSchema: integration.plus,
    })

    return this.updateDatasourceInStore(response, { ignoreErrors: true })
  }

  async save({
    integration,
    datasource,
  }: {
    integration: Integration
    datasource: Datasource
  }) {
    if (!(await this.checkDatasourceValidity(integration, datasource)).valid) {
      throw new Error("Unable to connect")
    }

    const response = await API.updateDatasource(datasource)

    return this.updateDatasourceInStore(response)
  }

  async deleteDatasource(datasource: Datasource) {
    if (!datasource?._id || !datasource?._rev) {
      return
    }
    await API.deleteDatasource(datasource._id, datasource._rev)
    this.replaceDatasource(datasource._id)
  }

  async delete(datasource: Datasource) {
    return this.deleteDatasource(datasource)
  }

  replaceDatasource(datasourceId: string, datasource?: Datasource) {
    if (!datasourceId) {
      return
    }

    // Handle deletion
    if (!datasource) {
      this.store.update(state => ({
        ...state,
        rawList: state.rawList.filter(x => x._id !== datasourceId),
      }))
      tables.removeDatasourceTables(datasourceId)
      queries.removeDatasourceQueries(datasourceId)
      return
    }

    // Add new datasource
    const index = get(this.store).rawList.findIndex(
      x => x._id === datasource._id
    )
    if (index === -1) {
      this.store.update(state => ({
        ...state,
        rawList: [...state.rawList, datasource],
      }))

      // If this is a new datasource then we should refresh the tables list,
      // because otherwise we'll never see the new tables
      tables.fetch()
    }

    // Update existing datasource
    else if (datasource) {
      this.store.update(state => {
        state.rawList[index] = datasource
        return state
      })
    }
  }

  async getTableNames(datasource: Datasource) {
    const info = await API.fetchInfoForDatasource(datasource)
    return info.tableNames || []
  }
}

export const datasources = new DatasourceStore()
