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
  export let limit
  export let showTitleButton
  export let titleButtonText
  export let titleButtonOnClick
  export let cardTitle
  export let cardSubtitle
  export let cardDescription
  export let cardImageURL
  export let cardHorizontal
  export let showCardButton
  export let cardButtonText
  export let cardButtonOnClick

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
  $: cardWidth = cardHorizontal ? 420 : 300

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
    return enrichedColumns.slice(0, 3)
  }

  // Load the datasource schema on mount so we can determine column types
  onMount(async () => {
    if (dataSource) {
      schema = await API.fetchDatasourceSchema(dataSource)
    }
  })
</script>

<Block>
  <div class="card-list" use:styleable={$component.styles}>
    <BlockComponent type="form" bind:id={formId} props={{ dataSource }}>
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
                  onClick: titleButtonOnClick,
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
          limit,
        }}
      >
        <BlockComponent
          type="repeater"
          context="repeater"
          props={{
            dataProvider: `{{ literal [${dataProviderId}] }}`,
            direction: "row",
            hAlign: "stretch",
            vAlign: "top",
            gap: "M",
            noRowsMessage: "No rows found",
          }}
          styles={{
            display: "grid",
            "grid-template-columns": `repeat(auto-fill, minmax(${cardWidth}px, 1fr))`,
          }}
        >
          <BlockComponent
            type="spectrumcard"
            props={{
              title: cardTitle,
              subtitle: cardSubtitle,
              description: cardDescription,
              imageURL: cardImageURL,
              horizontal: cardHorizontal,
              showButton: showCardButton,
              buttonText: cardButtonText,
              buttonOnClick: cardButtonOnClick,
            }}
            styles={{
              width: "auto",
            }}
          />
        </BlockComponent>
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
