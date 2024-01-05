<script>
  import BlockComponent from "components/BlockComponent.svelte"
  import Placeholder from "components/app/Placeholder.svelte"
  import { getContext } from "svelte"

  export let dataSource
  export let actionType
  export let size
  export let disabled
  export let fields
  export let title
  export let description
  export let buttons
  export let buttonPosition = "bottom"
  export let schema

  const FieldTypeToComponentMap = {
    string: "stringfield",
    number: "numberfield",
    bigint: "bigintfield",
    options: "optionsfield",
    array: "multifieldselect",
    boolean: "booleanfield",
    longform: "longformfield",
    datetime: "datetimefield",
    attachment: "attachmentfield",
    link: "relationshipfield",
    json: "jsonfield",
    barcodeqr: "codescanner",
    bb_reference: "bbreferencefield",
  }
  const context = getContext("context")

  let formId

  $: renderHeader = buttons || title

  const getComponentForField = field => {
    const fieldSchemaName = field.field || field.name
    if (!fieldSchemaName || !schema?.[fieldSchemaName]) {
      return null
    }
    const type = schema[fieldSchemaName].type
    return FieldTypeToComponentMap[type]
  }

  const getPropsForField = field => {
    let fieldProps = field._component
      ? {
          ...field,
        }
      : {
          field: field.name,
          label: field.name,
          placeholder: field.name,
          _instanceName: field.name,
        }
    return fieldProps
  }
</script>

{#if fields?.length}
  <BlockComponent
    type="form"
    props={{
      actionType: actionType === "Create" ? "Create" : "Update",
      dataSource,
      size,
      disabled,
      readonly: !disabled && actionType === "View",
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
            direction: "column",
            gap: "S",
          }}
          order={0}
        >
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
            {#if buttonPosition == "top"}
              <BlockComponent
                type="buttongroup"
                props={{
                  buttons,
                }}
                order={0}
              />
            {/if}
          </BlockComponent>
        </BlockComponent>
      {/if}
      {#if description}
        <BlockComponent type="text" props={{ text: description }} order={1} />
      {/if}
      {#key fields}
        <BlockComponent type="container" order={2}>
          <div class="form-block fields" class:mobile={$context.device.mobile}>
            {#each fields as field, idx}
              {#if getComponentForField(field) && field.active}
                <BlockComponent
                  type={getComponentForField(field)}
                  props={getPropsForField(field)}
                  order={idx}
                  interactive
                  name={field?.field}
                />
              {/if}
            {/each}
          </div>
        </BlockComponent>
      {/key}
    </BlockComponent>
    {#if buttonPosition === "bottom"}
      <BlockComponent
        type="buttongroup"
        props={{
          buttons,
        }}
        styles={{
          normal: {
            "margin-top": "16",
          },
        }}
        order={3}
      />
    {/if}
  </BlockComponent>
{:else}
  <Placeholder
    text="Choose your table and add some fields to your form to get started"
  />
{/if}

<style>
  .fields {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px 16px;
  }
  .fields.mobile :global(.spectrum-Form-item) {
    grid-column: span 6 !important;
  }
</style>
