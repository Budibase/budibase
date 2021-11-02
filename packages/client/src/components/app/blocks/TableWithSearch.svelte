<script>
  import Block from "./Block.svelte"
  import BlockComponent from "./BlockComponent.svelte"

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

  let formId
  let dataProviderId

  $: enrichedFilter = enrichFilter(filter, searchColumns, formId)

  const enrichFilter = (filter, searchColumns, formId) => {
    let enrichedFilter = [...(filter || [])]
    searchColumns?.forEach(column => {
      enrichedFilter.push({
        field: column,
        operator: "equal",
        type: "string",
        valueType: "Binding",
        value: `{{ [${formId}].[${column}] }}`,
      })
    })
    return enrichedFilter
  }
</script>

<Block>
  <BlockComponent type="form" bind:id={formId} props={{ dataSource }}>
    {#if searchColumns?.length}
      <div class="search">
        {#each searchColumns as column}
          <BlockComponent
            type="stringfield"
            props={{
              field: column,
              placeholder: column,
              label: column,
            }}
          />
        {/each}
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
</Block>

<style>
  .search {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 20px;
    gap: 10px;
  }
</style>
