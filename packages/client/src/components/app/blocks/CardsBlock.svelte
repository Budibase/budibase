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
  export let limit
  export let showTitleButton
  export let titleButtonText
  export let titleButtonURL
  export let titleButtonPeek
  export let cardTitle
  export let cardSubtitle
  export let cardDescription
  export let cardImageURL
  export let linkCardTitle
  export let cardURL
  export let cardPeek
  export let cardHorizontal
  export let showCardButton
  export let cardButtonText
  export let cardButtonOnClick
  export let linkColumn
  export let noRowsMessage

  const { fetchDatasourceSchema } = getContext("sdk")

  let formId
  let dataProviderId
  let repeaterId
  let schema
  let enrichedSearchColumns
  let schemaLoaded = false

  $: fetchSchema(dataSource)
  $: enrichSearchColumns(searchColumns, schema).then(
    val => (enrichedSearchColumns = val)
  )
  $: enrichedFilter = enrichFilter(filter, enrichedSearchColumns, formId)
  $: cardWidth = cardHorizontal ? 420 : 300
  $: fullCardURL = buildFullCardUrl(
    linkCardTitle,
    cardURL,
    repeaterId,
    linkColumn
  )
  $: titleButtonAction = [
    {
      "##eventHandlerType": "Navigate To",
      parameters: {
        peek: titleButtonPeek,
        url: titleButtonURL,
      },
    },
  ]

  // Builds a full details page URL for the card title
  const buildFullCardUrl = (link, url, repeaterId, linkColumn) => {
    if (!link || !url || !repeaterId) {
      return null
    }
    const col = linkColumn || "_id"
    const split = url.split("/:")
    return `${split[0]}/{{ ${safe(repeaterId)}.${safe(col)} }}`
  }

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
      props={{ dataSource, disableValidation: true }}
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
              vAlign: "middle",
              gap: "M",
              wrap: true,
            }}
            order={1}
          >
            {#if enrichedSearchColumns?.length}
              {#each enrichedSearchColumns as column, idx (column.name)}
                <BlockComponent
                  type={column.componentType}
                  props={{
                    field: column.name,
                    placeholder: column.name,
                    text: column.name,
                    autoWidth: true,
                  }}
                  order={idx}
                  styles={{
                    normal: {
                      width: "192px",
                    },
                  }}
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
          limit,
        }}
        order={1}
      >
        <BlockComponent
          type="repeater"
          bind:id={repeaterId}
          context="repeater"
          props={{
            dataProvider: `{{ literal ${safe(dataProviderId)} }}`,
            direction: "row",
            hAlign: "stretch",
            vAlign: "top",
            gap: "M",
            noRowsMessage: noRowsMessage || "No rows found",
          }}
          styles={{
            custom: `display: grid;\ngrid-template-columns: repeat(auto-fill, minmax(min(${cardWidth}px, 100%), 1fr));`,
          }}
          order={0}
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
              linkURL: fullCardURL,
              linkPeek: cardPeek,
            }}
            styles={{
              normal: {
                width: "auto",
              },
            }}
            order={0}
          />
        </BlockComponent>
      </BlockComponent>
    </BlockComponent>
  </Block>
{/if}
