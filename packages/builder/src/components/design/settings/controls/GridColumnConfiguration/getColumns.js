const modernize = columns => {
  if (!columns) {
    return []
  }
  // If the first element has no active key then it's safe to assume all elements are in the old format
  if (columns?.[0] && columns[0].active === undefined) {
    return columns.map(column => ({
      label: column.displayName,
      field: column.name,
      active: true,
      related: column.related,
    }))
  }

  return columns
}

const removeInvalidAddMissing = (
  columns = [],
  defaultColumns,
  primaryDisplayColumnName,
  schema
) => {
  const defaultColumnNames = defaultColumns.map(column => column.field)
  const columnNames = columns.map(column => column.field)

  const validColumns = columns.filter(column =>
    defaultColumnNames.includes(column.field)
  )
  let missingColumns = defaultColumns.filter(
    defaultColumn => !columnNames.includes(defaultColumn.field)
  )

  // If the user already has fields selected, any appended missing fields should be disabled by default
  if (validColumns.length) {
    missingColumns = missingColumns.map(field => ({ ...field, active: false }))
  }

  const combinedColumns = [...validColumns, ...missingColumns]

  // Ensure the primary display column is always visible
  const primaryDisplayIndex = combinedColumns.findIndex(
    column => column.field === primaryDisplayColumnName
  )
  if (primaryDisplayIndex > -1) {
    combinedColumns[primaryDisplayIndex].active = true
  }

  for (const column of combinedColumns) {
    if (!column.related) {
      column.columnType = schema[column.field]?.type
      continue
    }

    const { field: relField, subField: relSubField } = column.related
    column.columnType = schema[relField]?.columns?.[relSubField]?.type
  }

  return combinedColumns
}

const getDefault = (schema = {}) => {
  const defaultValues = Object.values(schema)
    .filter(column => !column.nestedJSON)
    .flatMap(column => {
      const order = column.visible
        ? column.order ?? -1
        : Number.MAX_SAFE_INTEGER
      const columns = [
        {
          label: column.name,
          field: column.name,
          active: column.visible ?? true,
          order,
        },
      ]

      if (column.columns) {
        for (const relColumn of Object.keys(column.columns).filter(
          relColumn => column.columns[relColumn].visible !== false
        )) {
          columns.push({
            label: `${relColumn} (${column.name})`,
            field: `${column.name}.${relColumn}`,
            active: false,
            order,
            related: { field: column.name, subField: relColumn },
          })
        }
      }

      return columns
    })

  defaultValues.sort((a, b) => a.order - b.order)

  return defaultValues
}

const toGridFormat = draggableListColumns => {
  return draggableListColumns.map(entry => ({
    label: entry.label,
    field: entry.field,
    active: entry.active,
    width: entry.width,
    conditions: entry.conditions,
    related: entry.related,
  }))
}

const toDraggableListFormat = (gridFormatColumns, createComponent) => {
  return gridFormatColumns.map(column => {
    return createComponent(
      "@budibase/standard-components/labelfield",
      {
        _id: column.field,
        _instanceName: column.field,
        active: column.active,
        field: column.field,
        label: column.label,
        columnType: column.columnType,
        width: column.width,
        conditions: column.conditions,
        related: column.related,
      },
      {}
    )
  })
}

const getColumns = ({
  columns,
  schema,
  primaryDisplayColumnName,
  onChange,
  createComponent,
}) => {
  const validatedColumns = removeInvalidAddMissing(
    modernize(columns),
    getDefault(schema),
    primaryDisplayColumnName,
    schema
  )
  const draggableList = toDraggableListFormat(validatedColumns, createComponent)
  const primary = draggableList
    .filter(entry => entry.field === primaryDisplayColumnName)
    .map(instance => ({ ...instance, schema }))[0]
  const sortable = draggableList
    .filter(entry => entry.field !== primaryDisplayColumnName)
    .map(instance => ({ ...instance, schema }))

  return {
    primary,
    sortable,
    updateSortable: newDraggableList => {
      onChange(toGridFormat(newDraggableList.concat(primary || [])))
    },
    update: newEntry => {
      const newDraggableList = draggableList.map(entry => {
        return newEntry.field === entry.field ? newEntry : entry
      })

      onChange(toGridFormat(newDraggableList))
    },
  }
}

export default getColumns
