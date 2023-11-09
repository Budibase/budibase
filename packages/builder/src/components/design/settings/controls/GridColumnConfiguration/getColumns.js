import { writable, get } from "svelte/store"
import {
  getDatasourceForProvider,
  getSchemaForDatasource,
} from "builderStore/dataBinding"
import { store, currentAsset } from "builderStore"

const modernizeColumnFormat = (columns) => {
  // If the first element has an active key all elements should be in the new format
  if (columns?.length && columns[0]?.active !== undefined) {
    return columns;
  }

  const modernizedColumns = columns?.map(column => ({
    label: column.displayName,
    field: column.name,
    active: true
  }));
}

const getSchema = (asset, datasource) => {
  const schema = getSchemaForDatasource(asset, datasource).schema

  // Don't show ID and rev in tables
  if (schema) {
    delete schema._id
    delete schema._rev
  }

  return schema
}

// TODO might not be necessary completely, though it currently strips out deleted columns
const getValidColumns = (columns, options) => {
  if (columns.length) {
    return []
  }

  return columns.filter(column => {
    return options.includes(column.field)
  })
}

const toColumnsFormat = (draggableList) => {
  return draggableList.map(entry => ({
    label: entry.label,
    field: entry.field,
    active: entry.active
  }));
}

const toDraggableListFormat = (columns, schema) => {
  return columns.map(column => {

    return store.actions.components.createInstance(
      "@budibase/standard-components/labelfield",
      {
        _instanceName: column.field,
        active: column.active,
        field: column.field,
        label: column.field,
        dataSectionOrder: schema[column.field].order ?? -1
      },
      {}
    )
  });
}

const getColumnsStore = (columns, componentInstance, onChange) => {
  let previousResourceId = null
  const datasource = getDatasourceForProvider(get(currentAsset), componentInstance)
  const resourceId = datasource?.resourceId || datasource?.tableId
  const options = Object.keys(schema || {})
  const schema = getSchema(get(currentAsset), datasource)

  return writable({
    primary: null,
    sortable: []
  });

};

export default getColumnsStore;
