<script>
  import { getContext } from "svelte"
  import Block from "components/Block.svelte"
  import BlockComponent from "components/BlockComponent.svelte"
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

  const { fetchDatasourceSchema } = getContext("sdk")

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
    <BlockComponent
      type="form"
      bind:id={formId}
      props={{
        dataSource,
        disableValidation: true,
        editAutoColumns: true,
        size,
      }}
    >
      {#if title || enrichedSearchColumns?.length || showTitleButton}
        <BlockComponent
          type="container"
          props={{
            direction: "row",
            hAlign: "stretch",
            vAlign: "middle",
            gap: "M",
            wrap: true,
          }}
          styles={{
            normal: {
              "margin-bottom": "20px",
            },
          }}
          order={0}
        >
          <BlockComponent
            type="heading"
            props={{
              text: title,
            }}
            order={0}
          />
          <BlockComponent
            type="container"
            props={{
              direction: "row",
              hAlign: "left",
              vAlign: "center",
              gap: "M",
              wrap: true,
            }}
            order={1}
          >
            {#if enrichedSearchColumns?.length}
              {#each enrichedSearchColumns as column, idx}
                <BlockComponent
                  type={column.componentType}
                  props={{
                    field: column.name,
                    placeholder: column.name,
                    text: column.name,
                    autoWidth: true,
                  }}
                  styles={{
                    normal: {
                      width: "192px",
                    },
                  }}
                  order={idx}
                />
              {/each}
            {/if}
            {#if showTitleButton}
              <BlockComponent
                type="button"
                props={{
                  onClick: titleButtonAction,
                  text: titleButtonText,
                  type: "cta",
                }}
                order={enrichedSearchColumns?.length ?? 0}
              />
            {/if}
          </BlockComponent>
        </BlockComponent>
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
        order={1}
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
  </Block>
{/if}
