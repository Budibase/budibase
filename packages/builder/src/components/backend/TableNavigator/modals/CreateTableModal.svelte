<svelte:options runes={true} />

<script lang="ts">
  import { goto as gotoStore, url } from "@roxi/routify"
  import {
    DataEnvironmentMode,
    FieldType,
    TableSourceType,
    type Row,
    type Table,
    type TableSchema,
  } from "@budibase/types"
  import { notifications, Input, ModalContent } from "@budibase/bbui"
  import { API } from "@/api"
  import { tables, datasources, dataEnvironmentStore } from "@/stores/builder"
  import ProjectSelect from "@/components/common/ProjectSelect.svelte"
  import TableDataImport from "../TableDataImport.svelte"
  import { chunkRows, IMPORT_ROWS_PER_CHUNK } from "../utils"
  import {
    BUDIBASE_INTERNAL_DB_ID,
    BUDIBASE_DATASOURCE_TYPE,
  } from "@/constants/backend"
  import { get } from "svelte/store"
  import { SvelteSet } from "svelte/reactivity"

  interface Props {
    promptUpload?: boolean
    name?: string
    beforeSave?: () => Promise<void>
    afterSave?: (table: Table) => Promise<void>
    initialProjectIds?: string[]
  }

  let {
    promptUpload = false,
    name = $bindable(""),
    beforeSave = async () => {},
    initialProjectIds = [],
    afterSave = async (table: Table) => {
      notifications.success(`Table ${name} created successfully.`)

      const getCurrentUrl = get(url) as () => string
      const currentUrl = getCurrentUrl()
      const path = currentUrl.endsWith("data")
        ? `./table/${table._id}`
        : `../../table/${table._id}`
      goto(path)
    },
  }: Props = $props()

  const goto = $derived($gotoStore)
  const tableNames = $derived($tables.list.map(table => table.name))
  const selectedSource = $derived(
    $datasources.list.find(source => source._id === $datasources.selected)
  )

  const isSelectedInternal = $derived(
    selectedSource?.type === BUDIBASE_DATASOURCE_TYPE
  )
  const targetDatasourceId = $derived(
    isSelectedInternal
      ? selectedSource?._id || BUDIBASE_INTERNAL_DB_ID
      : BUDIBASE_INTERNAL_DB_ID
  )

  let error = $state("")

  let schema: TableSchema = $state({})
  let rows: Row[] = $state([])
  let allValid = $state(true)
  let displayColumn: string | null = $state(null)
  let projectIds = $derived([...initialProjectIds])

  const buildOptionConstraints = (schema: TableSchema, rows: Row[]) => {
    const updatedSchema: TableSchema = {}
    const optionColumns: Array<{ name: string; isArray: boolean }> = []

    for (const [name, field] of Object.entries(schema || {})) {
      updatedSchema[name] = { ...field }

      if (field?.type === FieldType.OPTIONS) {
        const constraints = { ...field.constraints }
        updatedSchema[name].constraints = {
          ...constraints,
          inclusion: Array.isArray(constraints.inclusion)
            ? [...constraints.inclusion]
            : [],
        }
        optionColumns.push({
          name,
          isArray: false,
        })
      } else if (field?.type === FieldType.ARRAY) {
        const constraints = { ...field.constraints }
        updatedSchema[name].constraints = {
          ...constraints,
          inclusion: Array.isArray(constraints.inclusion)
            ? [...constraints.inclusion]
            : [],
        }
        optionColumns.push({
          name,
          isArray: true,
        })
      }
    }

    if (!rows?.length || optionColumns.length === 0) {
      return updatedSchema
    }

    const inclusionMap = optionColumns.reduce<Record<string, SvelteSet<string>>>(
      (acc, { name }) => {
        acc[name] = new SvelteSet()
        return acc
      },
      {}
    )

    const addValue = (set: SvelteSet<string>, value: Row[string]) => {
      if (value === null || value === undefined || value === "") {
        return
      }
      set.add(String(value))
    }

    const parseJsonValue = (
      raw: string
    ): { ok: boolean; value?: Row[string] } => {
      try {
        return { ok: true, value: JSON.parse(raw) }
      } catch (_error) {
        return { ok: false }
      }
    }

    const parseArrayValue = (value: Row[string]): Row[string][] => {
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
          const parsed = parseJsonValue(trimmed)
          if (parsed.ok) {
            return Array.isArray(parsed.value) ? parsed.value : [parsed.value]
          }
          const fallback = parseJsonValue(trimmed.replace(/'/g, '"'))
          if (fallback.ok) {
            return Array.isArray(fallback.value)
              ? fallback.value
              : [fallback.value]
          }
          return [value]
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
      const field = updatedSchema[name]
      if (field.type === FieldType.OPTIONS || field.type === FieldType.ARRAY) {
        field.constraints.inclusion = Array.from(inclusionMap[name]).sort()
      }
    }

    return updatedSchema
  }

  function checkValid(evt: Event) {
    const tableName = (evt.target as HTMLInputElement).value
    if (tableNames.includes(tableName)) {
      error = `Table with name ${tableName} already exists. Please choose another name.`
      return
    }
    error = ""
  }

  async function saveTable() {
    const schemaForSave = buildOptionConstraints(schema, rows)
    let newTable: Table = {
      name,
      schema: { ...schemaForSave },
      type: "table",
      sourceId: targetDatasourceId,
      sourceType: TableSourceType.INTERNAL,
      projectIds: projectIds.length ? projectIds : undefined,
    }

    // Only set primary display if defined
    if (displayColumn && displayColumn.length) {
      newTable.primaryDisplay = displayColumn
    }

    let table: Table
    try {
      await beforeSave()
      if (rows.length > IMPORT_ROWS_PER_CHUNK) {
        table = await tables.save(newTable)
        const chunks = chunkRows(rows, IMPORT_ROWS_PER_CHUNK)
        for (const chunk of chunks) {
          await API.importTableData(table._id!, chunk)
        }
      } else {
        const tableWithRows = {
          ...newTable,
          rows,
        }
        table = await tables.save(tableWithRows)
      }
      dataEnvironmentStore.setMode(DataEnvironmentMode.DEVELOPMENT)
      await datasources.fetch()
      await afterSave(table)
    } catch (e) {
      notifications.error(
        e instanceof Error ? e.message : "Error creating table"
      )
      // reload in case the table was created
      await tables.fetch()
    }
  }
</script>

<ModalContent
  title="Create Table"
  confirmText="Create"
  onConfirm={saveTable}
  disabled={!!error ||
    !name ||
    (rows.length > 0 && (!allValid || displayColumn == null))}
  size="M"
>
  <Input label="Table Name" on:input={checkValid} bind:value={name} {error} />
  <ProjectSelect bind:value={projectIds} />
  <TableDataImport
    {promptUpload}
    bind:rows
    bind:schema
    bind:allValid
    bind:displayColumn
  />
</ModalContent>
