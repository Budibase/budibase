<script>
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

  let formId
  let dataProviderId

  $: enrichedFilter = enrichFilter(filter, searchColumns, formId)

  // Enrich the default filter with the specified search fields
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
        {#if title}
          <div class="title">
            <Heading>{title}</Heading>
          </div>
        {/if}
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
  .title {
    flex: 1 1 auto;
  }
</style>
