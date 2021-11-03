<script>
  import { onMount, getContext } from "svelte"
  import Block from "components/Block.svelte"
  import BlockComponent from "components/BlockComponent.svelte"
  import { Heading } from "@budibase/bbui"

  export let title
  export let dataSource
  export let searchColumns
  export let filter
  export let sortColumn
  export let sortOrder
  export let paginate
  export let tableColumns
  export let showAutoColumns
  export let rowCount
  export let quiet
  export let size

  const { API, styleable } = getContext("sdk")
  const context = getContext("context")
  const component = getContext("component")
  const schemaComponentMap = {
    string: "stringfield",
    options: "optionsfield",
    number: "numberfield",
    datetime: "datetimefield",
    boolean: "booleanfield",
  }

  let formId
  let dataProviderId
  let schema

  $: enrichedSearchColumns = enrichSearchColumns(searchColumns, schema)
  $: enrichedFilter = enrichFilter(filter, enrichedSearchColumns, formId)

  // Enrich the default filter with the specified search fields
  const enrichFilter = (filter, columns, formId) => {
    let enrichedFilter = [...(filter || [])]
    columns?.forEach(column => {
      enrichedFilter.push({
        field: column.name,
        operator: "equal",
        type: "string",
        valueType: "Binding",
        value: `{{ [${formId}].[${column.name}] }}`,
      })
    })
    return enrichedFilter
  }

  // Determine data types for search fields and only use those that are valid
  const enrichSearchColumns = (searchColumns, schema) => {
    let enrichedColumns = []
    searchColumns?.forEach(column => {
      const schemaType = schema?.[column]?.type
      const componentType = schemaComponentMap[schemaType]
      if (componentType) {
        enrichedColumns.push({
          name: column,
          componentType,
        })
      }
    })
    return enrichedColumns
  }

  // Load the datasource schema on mount so we can determine column types
  onMount(async () => {
    if (dataSource) {
      schema = await API.fetchDatasourceSchema(dataSource)
    }
  })
</script>

<Block>
  <div class={size} use:styleable={$component.styles}>
    <BlockComponent type="form" bind:id={formId} props={{ dataSource }}>
      {#if title || enrichedSearchColumns?.length}
        <div class="header">
          <div class="title">
            <Heading>{title || ""}</Heading>
          </div>
          {#if enrichedSearchColumns?.length}
            <div class="search" class:mobile={$context.device.mobile}>
              {#each enrichedSearchColumns as column}
                <BlockComponent
                  type={column.componentType}
                  props={{
                    field: column.name,
                    placeholder: column.name,
                    text: column.name,
                    autoWidth: true,
                  }}
                />
              {/each}
            </div>
          {/if}
        </div>
      {/if}
      <BlockComponent
        type="dataprovider"
        bind:id={dataProviderId}
        props={{
          dataSource,
          filter: enrichedFilter,
          sortColumn,
          sortOrder,
          paginate,
          limit: rowCount,
        }}
      >
        <BlockComponent
          type="table"
          props={{
            dataProvider: `{{ literal [${dataProviderId}] }}`,
            columns: tableColumns,
            showAutoColumns,
            rowCount,
            quiet,
            size,
          }}
        />
      </BlockComponent>
    </BlockComponent>
  </div>
</Block>

<style>
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .title {
    flex: 1 1 auto;
  }
  .search {
    flex: 0 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    max-width: 100%;
    flex-wrap: wrap;
  }
  .search:not(.mobile) :global(.spectrum-Form-itemField > .spectrum-Picker) {
    width: 200px;
  }
  .search :global(.spectrum-InputGroup .spectrum-InputGroup-input) {
    width: 100%;
  }
  .search :global(.spectrum-InputGroup) {
    min-width: 0;
  }
  .search.mobile {
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
    width: 100%;
  }
  .search.mobile :global(.component > *) {
    width: 100%;
  }
</style>
