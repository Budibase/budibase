<script lang="ts">
  import type {
    DataFetchDatasource,
    FieldSchema,
    GroupUserDatasource,
    SortOrder,
    TableSchema,
    UISearchFilter,
    UserDatasource,
  } from "@budibase/types"
  import { fetchData, QueryUtils, stringifyRow } from "@budibase/frontend-core"
  import { getContext } from "svelte"

  type ProviderDatasource = Exclude<
    DataFetchDatasource,
    UserDatasource | GroupUserDatasource
  >
  type ChosenColumns = Array<{ name: string; displayName?: string }> | undefined
  type Schema = { [key: string]: FieldSchema & { displayName: string } }

  export let datasource: ProviderDatasource
  export let filter: UISearchFilter | undefined = undefined
  export let sortColumn: string | undefined = undefined
  export let sortOrder: SortOrder | undefined = undefined
  export let columns: ChosenColumns = undefined
  export let limit: number = 20

  const component = getContext("component")
  const { styleable, API } = getContext("sdk")

  $: query = QueryUtils.buildQuery(filter)
  $: fetch = createFetch(datasource)
  $: fetch.update({
    query,
    sortColumn,
    sortOrder,
    limit,
  })
  $: schema = sanitizeSchema($fetch.schema, columns)
  $: columnCount = Object.keys(schema).length
  $: rowCount = $fetch.rows?.length || 0
  $: stringifiedRows = ($fetch?.rows || []).map(row =>
    stringifyRow(row, schema)
  )

  const createFetch = (datasource: ProviderDatasource) => {
    return fetchData({
      API,
      datasource,
      options: {
        query,
        sortColumn,
        sortOrder,
        limit,
        paginate: false,
      },
    })
  }

  const sanitizeSchema = (
    schema: TableSchema | null,
    columns: ChosenColumns
  ): Schema => {
    if (!schema) {
      return {}
    }
    let sanitized: Schema = {}

    // Clean out hidden fields and ensure we have
    Object.entries(schema).forEach(([field, fieldSchema]) => {
      if (fieldSchema.visible !== false) {
        sanitized[field] = {
          ...fieldSchema,
          displayName: field,
        }
      }
    })

    // Clean out unselected columns.
    // Default to first 3 columns if none specified, as we are width contrained.
    if (!columns?.length) {
      columns = Object.values(sanitized).slice(0, 3)
    }
    let pruned: Schema = {}
    for (let col of columns) {
      if (sanitized[col.name]) {
        pruned[col.name] = {
          ...sanitized[col.name],
          displayName: col.displayName || sanitized[col.name].displayName,
        }
      }
    }
    sanitized = pruned

    return sanitized
  }
</script>

<div class="vars" style="--cols:{columnCount}; --rows:{rowCount};">
  <div class="table" class:valid={!!schema} use:styleable={$component.styles}>
    {#if schema}
      {#each Object.keys(schema) as col}
        <div class="cell header">{schema[col].displayName}</div>
      {/each}
      {#each stringifiedRows as row}
        {#each Object.keys(schema) as col}
          <div class="cell">{row[col]}</div>
        {/each}
      {/each}
    {/if}
  </div>
</div>

<style>
  .vars {
    display: contents;
    --border-color: var(--spectrum-global-color-gray-300);
  }
  .table {
    display: grid;
    grid-template-columns: repeat(var(--cols), minmax(40px, auto));
    grid-template-rows: repeat(var(--rows), max-content);
    overflow: hidden;
    background: var(--spectrum-global-color-gray-50);
  }
  .table.valid {
    border-left: 1px solid var(--border-color);
    border-top: 1px solid var(--border-color);
  }
  .cell {
    border-right: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    padding: var(--spacing-xs) var(--spacing-s);
    overflow: hidden;
    word-break: break-word;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
  .cell.header {
    font-weight: 600;
  }
</style>
