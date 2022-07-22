<script>
  import { getContext } from "svelte"
  import Block from "components/Block.svelte"
  import BlockComponent from "components/BlockComponent.svelte"
  import { Heading } from "@budibase/bbui"
  import { makePropSafe as safe } from "@budibase/string-templates"
  import { enrichSearchColumns, enrichFilter } from "utils/blocks.js"

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
  export let compact
  export let size
  export let allowSelectRows
  export let linkRows
  export let linkURL
  export let linkColumn
  export let linkPeek
  export let showTitleButton
  export let titleButtonText
  export let titleButtonURL
  export let titleButtonPeek

  const { fetchDatasourceSchema, styleable } = getContext("sdk")
  const context = getContext("context")
  const component = getContext("component")

  let formId
  let dataProviderId
  let schema
  let schemaLoaded = false

  $: fetchSchema(dataSource)
  $: enrichedSearchColumns = enrichSearchColumns(searchColumns, schema)
  $: enrichedFilter = enrichFilter(filter, enrichedSearchColumns, formId)
  $: titleButtonAction = [
    {
      "##eventHandlerType": "Navigate To",
      parameters: {
        peek: titleButtonPeek,
        url: titleButtonURL,
      },
    },
  ]

  // Load the datasource schema so we can determine column types
  const fetchSchema = async dataSource => {
    if (dataSource) {
      schema = await fetchDatasourceSchema(dataSource, {
        enrichRelationships: true,
      })
    }
    schemaLoaded = true
  }
</script>

{#if schemaLoaded}
  <Block>
    <div class={size} use:styleable={$component.styles}>
      <BlockComponent
        type="form"
        bind:id={formId}
        props={{ dataSource, disableValidation: true, editAutoColumns: true }}
      >
        {#if title || enrichedSearchColumns?.length || showTitleButton}
          <div class="header" class:mobile={$context.device.mobile}>
            <div class="title">
              <Heading>{title || ""}</Heading>
            </div>
            <div class="controls">
              {#if enrichedSearchColumns?.length}
                <div
                  class="search"
                  style="--cols:{enrichedSearchColumns?.length}"
                >
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
              {#if showTitleButton}
                <BlockComponent
                  type="button"
                  props={{
                    onClick: titleButtonAction,
                    text: titleButtonText,
                    type: "cta",
                  }}
                />
              {/if}
            </div>
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
            context="table"
            props={{
              dataProvider: `{{ literal ${safe(dataProviderId)} }}`,
              columns: tableColumns,
              showAutoColumns,
              rowCount,
              quiet,
              compact,
              allowSelectRows,
              size,
              linkRows,
              linkURL,
              linkColumn,
              linkPeek,
            }}
          />
        </BlockComponent>
      </BlockComponent>
    </div>
  </Block>
{/if}

<style>
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }

  .title {
    overflow: hidden;
  }
  .title :global(.spectrum-Heading) {
    flex: 1 1 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .controls {
    flex: 0 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
  }
  .controls :global(.spectrum-InputGroup .spectrum-InputGroup-input) {
    width: 100%;
  }

  .search {
    flex: 0 1 auto;
    gap: 10px;
    max-width: 100%;
    display: grid;
    grid-template-columns: repeat(var(--cols), minmax(120px, 200px));
  }
  .search :global(.spectrum-InputGroup) {
    min-width: 0;
  }

  /* Mobile styles */
  .mobile {
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  .mobile .controls {
    flex-direction: column-reverse;
    justify-content: flex-start;
    align-items: stretch;
  }
  .mobile .search {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
    width: 100%;
  }
</style>
