import { readable, get } from "svelte/store"
import {
  getDatasourceForProvider,
  getSchemaForDatasource,
} from "builderStore/dataBinding"
import { store, currentAsset } from "builderStore"

const modernize = (columns = []) => {
  // If the first element has an active key all elements should be in the new format
  if (columns[0] && columns[0].active !== undefined) {
    return columns;
  }

  columns.forEach(column => ({
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

const removeInvalidAddMissing = (columns = [], defaultColumns) => {
  return defaultColumns.map(defaultColumn => {
    const column = columns.find(column => column.field === defaultColumn.field)
    return column ?? defaultColumn;
  });
}

const getDefault = (schema = {}) => {
  return Object.values(schema)
    .toSorted((a, b) => a.order - b.order)
    .map(column => ({
      label: column.name,
      field: column.name,
      active: !column.autoColumn && column.visible
    })
  );
}

const toColumns = (draggableList) => {
  return draggableList.map(entry => ({
    label: entry.label,
    field: entry.field,
    active: entry.active
  }));
}

const toDraggableList = (columns) => {
  return columns.map(column => {

    return store.actions.components.createInstance(
      "@budibase/standard-components/labelfield",
      {
        _instanceName: column.field,
        active: column.active,
        field: column.field,
        label: column.field
      },
      {}
    )
  });
}

const getPrimaryDisplayColumnName = (asset, datasource) => {
  return getSchemaForDatasource(asset, datasource)?.table?.primaryDisplay
}

const getColumnsStore = (columns, componentInstance, onChange) => {
  const datasource = getDatasourceForProvider(get(currentAsset), componentInstance)
  const schema = getSchema(get(currentAsset), datasource)
  const primaryDisplayColumnName = getPrimaryDisplayColumnName(
    get(currentAsset),
    datasource
  )

  const validatedColumns = removeInvalidAddMissing(modernize(columns), getDefault(schema));
  const draggableList = toDraggableList(validatedColumns);

  const store = readable({
    primary: draggableList.find(entry => entry.field === primaryDisplayColumnName),
    sortable: draggableList.filter(entry => entry.field !== primaryDisplayColumnName)
  });

  return {
    ...store,
    update: (newDraggableList) => {
      const mergedDraggableList = draggableList.map(entry => {
        const newEntry = newDraggableList.find(newEntry => newEntry.field === entry.field)
        return newEntry ?? entry;
      });

      onChange(toColumns(mergedDraggableList));
    }
  };
};

export default getColumnsStore;
