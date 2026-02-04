<script>
  import { goto as gotoStore, url } from "@roxi/routify"
  import { DataEnvironmentMode, FieldType } from "@budibase/types"
  import { notifications, Input, ModalContent } from "@budibase/bbui"
  import { API } from "@/api"
  import { tables, datasources, dataEnvironmentStore } from "@/stores/builder"
  import TableDataImport from "../TableDataImport.svelte"
  import { chunkRows, IMPORT_ROWS_PER_CHUNK } from "../utils"
  import {
    BUDIBASE_INTERNAL_DB_ID,
    BUDIBASE_DATASOURCE_TYPE,
    DB_TYPE_INTERNAL,
  } from "@/constants/backend"

  $: goto = $gotoStore
  $url

  $: tableNames = $tables.list.map(table => table.name)
  $: selectedSource = $datasources.list.find(
    source => source._id === $datasources.selected
  )

  $: isSelectedInternal = selectedSource?.type === BUDIBASE_DATASOURCE_TYPE
  $: targetDatasourceId = isSelectedInternal
    ? selectedSource._id
    : BUDIBASE_INTERNAL_DB_ID

  export let promptUpload = false
  export let name
  export let beforeSave = async () => {}
  export let afterSave = async table => {
    notifications.success(`Table ${name} created successfully.`)

    // Navigate to new table
    const currentUrl = $url()
    const path = currentUrl.endsWith("data")
      ? `./table/${table._id}`
      : `../../table/${table._id}`
    goto(path)
  }

  let error = ""

  let schema = {}
  let rows = []
  let allValid = true
  let displayColumn = null

  const buildOptionConstraints = (schema, rows) => {
    const updatedSchema = {}
    const optionColumns = []

    for (const [name, field] of Object.entries(schema || {})) {
      const constraints = field?.constraints ? { ...field.constraints } : {}
      updatedSchema[name] = { ...field, constraints }

      if (
        field?.type === FieldType.OPTIONS ||
        field?.type === FieldType.ARRAY
      ) {
        updatedSchema[name].constraints = {
          ...constraints,
          inclusion: Array.isArray(constraints.inclusion)
            ? [...constraints.inclusion]
            : [],
        }
        optionColumns.push({
          name,
          isArray: field.type === FieldType.ARRAY,
        })
      }
    }

    if (!rows?.length || optionColumns.length === 0) {
      return updatedSchema
    }

    const inclusionMap = optionColumns.reduce((acc, { name }) => {
      acc[name] = new Set()
      return acc
    }, {})

    const addValue = (set, value) => {
      if (value === null || value === undefined || value === "") {
        return
      }
      set.add(value)
    }

    const parseArrayValue = value => {
      if (Array.isArray(value)) {
        return value
      }
      if (value === null || value === undefined || value === "") {
        return []
      }
      if (typeof value === "string") {
        const trimmed = value.trim()
        if (!trimmed) {
          return []
        }
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          try {
            const parsed = JSON.parse(trimmed.replace(/'/g, '"'))
            return Array.isArray(parsed) ? parsed : [parsed]
          } catch (_error) {
            return [value]
          }
        }
        return [value]
      }
      return [value]
    }

    for (const row of rows) {
      for (const { name, isArray } of optionColumns) {
        const value = row?.[name]
        if (isArray) {
          const values = parseArrayValue(value)
          values.forEach(val => addValue(inclusionMap[name], val))
        } else if (Array.isArray(value)) {
          value.forEach(val => addValue(inclusionMap[name], val))
        } else {
          addValue(inclusionMap[name], value)
        }
      }
    }

    for (const { name } of optionColumns) {
      updatedSchema[name].constraints.inclusion = Array.from(
        inclusionMap[name]
      ).sort()
    }

    return updatedSchema
  }

  function checkValid(evt) {
    const tableName = evt.target.value
    if (tableNames.includes(tableName)) {
      error = `Table with name ${tableName} already exists. Please choose another name.`
      return
    }
    error = ""
  }

  async function saveTable() {
    const schemaForSave = buildOptionConstraints(schema, rows)
    let newTable = {
      name,
      schema: { ...schemaForSave },
      type: "table",
      sourceId: targetDatasourceId,
      sourceType: DB_TYPE_INTERNAL,
    }

    // Only set primary display if defined
    if (displayColumn && displayColumn.length) {
      newTable.primaryDisplay = displayColumn
    }

    let table
    try {
      await beforeSave()
      if (rows.length > IMPORT_ROWS_PER_CHUNK) {
        table = await tables.save(newTable)
        const chunks = chunkRows(rows, IMPORT_ROWS_PER_CHUNK)
        for (const chunk of chunks) {
          await API.importTableData(table._id, chunk)
        }
      } else {
        table = await tables.save({
          ...newTable,
          rows,
        })
      }
      dataEnvironmentStore.setMode(DataEnvironmentMode.DEVELOPMENT)
      await datasources.fetch()
      await afterSave(table)
    } catch (e) {
      notifications.error(e.message || e)
      // reload in case the table was created
      await tables.fetch()
    }
  }
</script>

<ModalContent
  title="Create Table"
  confirmText="Create"
  onConfirm={saveTable}
  disabled={error ||
    !name ||
    (rows.length && (!allValid || displayColumn == null))}
  size="M"
>
  <Input
    thin
    label="Table Name"
    on:input={checkValid}
    bind:value={name}
    {error}
  />
  <TableDataImport
    {promptUpload}
    bind:rows
    bind:schema
    bind:allValid
    bind:displayColumn
  />
</ModalContent>
