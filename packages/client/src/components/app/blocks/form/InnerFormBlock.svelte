<script>
  import BlockComponent from "components/BlockComponent.svelte"
  import Placeholder from "components/app/Placeholder.svelte"
  import { makePropSafe as safe } from "@budibase/string-templates"

  export let dataSource
  export let actionUrl
  export let actionType
  export let size
  export let disabled
  export let fields
  export let labelPosition
  export let title
  export let showSaveButton
  export let showDeleteButton
  export let schema
  export let repeaterId

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

  let formId

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
      "##eventHandlerType": "Close Side Panel",
    },
    // Clear a create form once submitted
    ...(actionType !== "Create"
      ? []
      : [
          {
            "##eventHandlerType": "Clear Form",
            parameters: {
              componentId: formId,
            },
          },
        ]),
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
      "##eventHandlerType": "Close Side Panel",
    },
    {
      "##eventHandlerType": "Navigate To",
      parameters: {
        url: actionUrl,
      },
    },
  ]

  $: renderDeleteButton = showDeleteButton && actionType === "Update"
  $: renderSaveButton = showSaveButton && actionType !== "View"
  $: renderButtons = renderDeleteButton || renderSaveButton
  $: renderHeader = renderButtons || title

  const getComponentForField = field => {
    if (!field || !schema?.[field]) {
      return null
    }
    const type = schema[field].type
    return FieldTypeToComponentMap[type]
  }
</script>

{#if fields?.length}
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
        "margin-left": "auto",
        "margin-right": "auto",
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
      <BlockComponent type="fieldgroup" props={{ labelPosition }} order={1}>
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
{:else}
  <Placeholder
    text="Choose your table and add some fields to your form to get started"
  />
{/if}
