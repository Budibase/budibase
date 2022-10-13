<script>
  import { getContext } from "svelte"
  import BlockComponent from "../../BlockComponent.svelte"
  import Block from "../../Block.svelte"
  import Placeholder from "../Placeholder.svelte"
  import { makePropSafe as safe } from "@budibase/string-templates"

  export let actionType
  export let dataSource
  export let size
  export let disabled
  export let fields
  export let labelPosition
  export let title
  export let showSaveButton
  export let showDeleteButton
  export let rowId
  export let actionUrl

  const { fetchDatasourceSchema } = getContext("sdk")
  const FieldTypeToComponentMap = {
    string: "stringfield",
    number: "numberfield",
    options: "optionsfield",
    array: "multifieldselect",
    boolean: "booleanfield",
    longform: "longformfield",
    datetime: "datetimefield",
    attachment: "attachmentfield",
    link: "relationshipfield",
    json: "jsonfield",
    barcodeqr: "codescanner",
  }

  let schema
  let formId
  let providerId
  let repeaterId

  $: fetchSchema(dataSource)
  $: onSave = [
    {
      "##eventHandlerType": "Save Row",
      parameters: {
        providerId: formId,
        tableId: dataSource?.tableId,
      },
    },
    {
      "##eventHandlerType": "Close Screen Modal",
    },
    {
      "##eventHandlerType": "Navigate To",
      parameters: {
        url: actionUrl,
      },
    },
  ]
  $: onDelete = [
    {
      "##eventHandlerType": "Delete Row",
      parameters: {
        confirm: true,
        tableId: dataSource?.tableId,
        rowId: `{{ ${safe(repeaterId)}.${safe("_id")} }}`,
        revId: `{{ ${safe(repeaterId)}.${safe("_rev")} }}`,
      },
    },
    {
      "##eventHandlerType": "Close Screen Modal",
    },
    {
      "##eventHandlerType": "Navigate To",
      parameters: {
        url: actionUrl,
      },
    },
  ]
  $: filter = [
    {
      field: "_id",
      operator: "equal",
      type: "string",
      value: !rowId ? `{{ ${safe("url")}.${safe("id")} }}` : rowId,
      valueType: "Binding",
    },
  ]
  // If we're using an "update" form, use the real data provider. If we're
  // using a create form, we just want a fake array so that our repeater
  // will actually render the form, but data doesn't matter.
  $: dataProvider =
    actionType !== "Create"
      ? `{{ literal ${safe(providerId)} }}`
      : { rows: [{}] }
  $: renderDeleteButton = showDeleteButton && actionType === "Update"
  $: renderSaveButton = showSaveButton && actionType !== "View"
  $: renderButtons = renderDeleteButton || renderSaveButton
  $: renderHeader = renderButtons || title

  const fetchSchema = async () => {
    schema = (await fetchDatasourceSchema(dataSource)) || {}
  }

  const getComponentForField = field => {
    if (!field || !schema?.[field]) {
      return null
    }
    const type = schema[field].type
    return FieldTypeToComponentMap[type]
  }
</script>

<Block>
  {#if fields?.length}
    <BlockComponent
      type="dataprovider"
      context="provider"
      bind:id={providerId}
      props={{
        dataSource,
        filter,
        limit: 1,
        paginate: false,
      }}
    >
      <BlockComponent
        type="repeater"
        context="repeater"
        bind:id={repeaterId}
        props={{
          dataProvider,
          noRowsMessage: "We couldn't find a row to display",
          direction: "column",
          hAlign: "center",
        }}
      >
        <BlockComponent
          type="form"
          props={{
            actionType: actionType === "Create" ? "Create" : "Update",
            dataSource,
            size,
            disabled: disabled || actionType === "View",
          }}
          styles={{
            normal: {
              width: "600px",
            },
          }}
          context="form"
          bind:id={formId}
        >
          <BlockComponent
            type="container"
            props={{
              direction: "column",
              hAlign: "stretch",
              vAlign: "top",
              gap: "M",
            }}
          >
            {#if renderHeader}
              <BlockComponent
                type="container"
                props={{
                  direction: "row",
                  hAlign: "stretch",
                  vAlign: "center",
                  gap: "M",
                  wrap: true,
                }}
                order={0}
              >
                <BlockComponent
                  type="heading"
                  props={{ text: title || "" }}
                  order={0}
                />
                {#if renderButtons}
                  <BlockComponent
                    type="container"
                    props={{
                      direction: "row",
                      hAlign: "stretch",
                      vAlign: "center",
                      gap: "M",
                      wrap: true,
                    }}
                    order={1}
                  >
                    {#if renderDeleteButton}
                      <BlockComponent
                        type="button"
                        props={{
                          text: "Delete",
                          onClick: onDelete,
                          quiet: true,
                          type: "secondary",
                        }}
                        order={0}
                      />
                    {/if}
                    {#if renderSaveButton}
                      <BlockComponent
                        type="button"
                        props={{
                          text: "Save",
                          onClick: onSave,
                          type: "cta",
                        }}
                        order={1}
                      />
                    {/if}
                  </BlockComponent>
                {/if}
              </BlockComponent>
            {/if}
            <BlockComponent
              type="fieldgroup"
              props={{ labelPosition }}
              order={1}
            >
              {#each fields as field, idx}
                {#if getComponentForField(field)}
                  <BlockComponent
                    type={getComponentForField(field)}
                    props={{
                      field,
                      label: field,
                      placeholder: field,
                      disabled,
                    }}
                    order={idx}
                  />
                {/if}
              {/each}
            </BlockComponent>
          </BlockComponent>
        </BlockComponent>
      </BlockComponent>
    </BlockComponent>
  {:else}
    <Placeholder
      text="Choose your table and add some fields to your form to get started"
    />
  {/if}
</Block>
