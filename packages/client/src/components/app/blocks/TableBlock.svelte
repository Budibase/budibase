<script>
  import { getContext } from "svelte"
  import { generate } from "shortid"
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
  export let rowCount
  export let quiet
  export let compact
  export let size
  export let allowSelectRows
  export let clickBehaviour
  export let onClick
  export let showTitleButton
  export let titleButtonText
  export let titleButtonClickBehaviour
  export let onClickTitleButton

  const { fetchDatasourceSchema, API } = getContext("sdk")
  const stateKey = `ID_${generate()}`

  let formId
  let dataProviderId
  let detailsFormBlockId
  let detailsSidePanelId
  let newRowSidePanelId
  let schema
  let primaryDisplay

  $: fetchSchema(dataSource)
  $: enrichedSearchColumns = enrichSearchColumns(searchColumns, schema)
  $: enrichedFilter = enrichFilter(filter, enrichedSearchColumns, formId)
  $: editTitle = getEditTitle(detailsFormBlockId, primaryDisplay)
  $: normalFields = getNormalFields(schema)
  $: rowClickActions =
    clickBehaviour === "actions" || dataSource?.type !== "table"
      ? onClick
      : [
          {
            id: 0,
            "##eventHandlerType": "Update State",
            parameters: {
              key: stateKey,
              type: "set",
              persist: false,
              value: `{{ ${safe("eventContext")}.${safe("row")}._id }}`,
            },
          },
          {
            id: 1,
            "##eventHandlerType": "Open Side Panel",
            parameters: {
              id: detailsSidePanelId,
            },
          },
        ]
  $: buttonClickActions =
    titleButtonClickBehaviour === "actions" || dataSource?.type !== "table"
      ? onClickTitleButton
      : [
          {
            id: 0,
            "##eventHandlerType": "Open Side Panel",
            parameters: {
              id: newRowSidePanelId,
            },
          },
        ]

  // Load the datasource schema so we can determine column types
  const fetchSchema = async dataSource => {
    if (dataSource?.type === "table") {
      const definition = await API.fetchTableDefinition(dataSource?.tableId)
      schema = definition.schema
      primaryDisplay = definition.primaryDisplay
    } else if (dataSource) {
      schema = await fetchDatasourceSchema(dataSource, {
        enrichRelationships: true,
      })
    }
  }

  const getNormalFields = schema => {
    if (!schema) {
      return []
    }
    return Object.entries(schema)
      .filter(entry => {
        return !entry[1].autocolumn
      })
      .map(entry => entry[0])
  }

  const getEditTitle = (detailsFormBlockId, primaryDisplay) => {
    if (!primaryDisplay || !detailsFormBlockId) {
      return "Edit"
    }
    const prefix = safe(detailsFormBlockId + "-repeater")
    const binding = `${prefix}.${safe(primaryDisplay)}`
    return `{{#if ${binding}}}{{${binding}}}{{else}}Details{{/if}}`
  }
</script>

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
                onClick: buttonClickActions,
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
        sortColumn: sortColumn || primaryDisplay,
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
          rowCount,
          quiet,
          compact,
          allowSelectRows,
          size,
          onClick: rowClickActions,
        }}
      />
    </BlockComponent>
    {#if clickBehaviour === "details"}
      <BlockComponent
        name="Details side panel"
        type="sidepanel"
        bind:id={detailsSidePanelId}
        context="details-side-panel"
        order={2}
      >
        <BlockComponent
          name="Details form block"
          type="formblock"
          bind:id={detailsFormBlockId}
          props={{
            dataSource,
            showSaveButton: true,
            showDeleteButton: true,
            actionType: "Update",
            rowId: `{{ ${safe("state")}.${safe(stateKey)} }}`,
            fields: normalFields,
            title: editTitle,
            labelPosition: "left",
          }}
        />
      </BlockComponent>
    {/if}
    {#if showTitleButton && titleButtonClickBehaviour === "new"}
      <BlockComponent
        name="New row side panel"
        type="sidepanel"
        bind:id={newRowSidePanelId}
        context="new-side-panel"
        order={3}
      >
        <BlockComponent
          name="New row form block"
          type="formblock"
          props={{
            dataSource,
            showSaveButton: true,
            showDeleteButton: false,
            actionType: "Create",
            fields: normalFields,
            title: "Create Row",
            labelPosition: "left",
          }}
        />
      </BlockComponent>
    {/if}
  </BlockComponent>
</Block>
