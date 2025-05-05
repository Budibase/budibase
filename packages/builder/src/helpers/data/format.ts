import {
  Datasource,
  Table,
  UIInternalDatasource,
  UITableResource,
  UIViewResource,
  ViewV2,
} from "@budibase/types"

export const datasourceSelect = {
  table: (table: Table, datasources: Omit<Datasource, "entities">[]) => {
    const sourceId = table.sourceId || (table as any).datasourceId
    const datasource = datasources.find(ds => ds._id === sourceId)
    return {
      label: table.name,
      tableId: table._id,
      type: "table",
      datasourceName: datasource?.name,
    }
  },
  viewV2: (view: ViewV2, datasources: UIInternalDatasource[] = []) => {
    const datasource = datasources
      ?.filter(d => d.entities)
      .flatMap(d => d.entities)
      .find(ds => ds._id === view.tableId)
    return {
      ...view,
      label: view.name,
      type: "viewV2",
      datasourceName: datasource?.name,
    }
  },
}

export const tableSelect = {
  table: (table: Table): UITableResource => ({
    type: "table",
    label: table.name,
    tableId: table._id!,
    resourceId: table._id!,
  }),
  viewV2: (view: ViewV2): UIViewResource => ({
    type: "viewV2",
    id: view.id,
    label: view.name,
    tableId: view.tableId,
    resourceId: view.id,
  }),
}

export const sortAndFormat = {
  tables: (tables: Table[], datasources: Omit<Datasource, "entities">[]) => {
    return tables
      .map(table => {
        const formatted = datasourceSelect.table(table, datasources)
        return {
          ...formatted,
          resourceId: table._id,
        }
      })
      .sort((a, b) => {
        // sort tables alphabetically, grouped by datasource
        const dsA = a.datasourceName ?? ""
        const dsB = b.datasourceName ?? ""

        const dsComparison = dsA.localeCompare(dsB)
        if (dsComparison !== 0) {
          return dsComparison
        }
        return a.label.localeCompare(b.label)
      })
  },
  viewsV2: (views: ViewV2[], datasources: UIInternalDatasource[]) => {
    return views.map(view => {
      const formatted = datasourceSelect.viewV2(view, datasources)
      return {
        ...formatted,
        resourceId: view.id,
      }
    })
  },
}
