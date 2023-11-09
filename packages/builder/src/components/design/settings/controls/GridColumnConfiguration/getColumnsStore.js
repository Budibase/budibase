import { get } from "svelte/store"
import {
  getDatasourceForProvider,
  getSchemaForDatasource,
} from "builderStore/dataBinding"
import { store, currentAsset } from "builderStore"

const modernize = (columns) => {
  if (!columns) {
    return []
  }
  // If the first element has no active key then it's safe to assume all elements are in the old format
  if (columns?.[0] && columns[0].active === undefined) {
    return columns.map(column => ({
      label: column.displayName,
      field: column.name,
      active: true
    }));
  }

  return columns;
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
  const defaultColumnNames = defaultColumns.map(column => column.field);
  const columnNames = columns.map(column => column.field);

  const columnsWithoutInvalid = columns.filter(column => defaultColumnNames.includes(column.field));
  const missingFields = defaultColumns.filter(defaultColumn => !columnNames.includes(defaultColumn.field))

  return [...columnsWithoutInvalid, ...missingFields];
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
        label: column.label
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
  const primary = draggableList.find(entry => entry.field === primaryDisplayColumnName);
  const sortable = draggableList.filter(entry => entry.field !== primaryDisplayColumnName);

  return {
    primary,
    sortable,
    updateSortable: (newDraggableList) => {
      onChange(toColumns(newDraggableList.concat(primary)));
    },
    update: (newEntry) => {
      const newDraggableList = draggableList.map(entry => {
        return newEntry.field === entry.field ? newEntry : entry;
      });

      onChange(toColumns(newDraggableList));
    }
  };
};

export default getColumnsStore;
