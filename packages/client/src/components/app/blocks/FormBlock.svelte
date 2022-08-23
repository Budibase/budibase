<script>
  import { getContext } from "svelte"
  import BlockComponent from "../../BlockComponent.svelte"
  import Block from "../../Block.svelte"
  import { Layout } from "@budibase/bbui"
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

  const { styleable, fetchDatasourceSchema, builderStore } = getContext("sdk")
  const component = getContext("component")
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
      value: rowId,
      valueType: "binding",
    },
  ]
  // If we're using an "update" form, use the real data provider. If we're
  // using a create form, we just want a fake array so that our repeater
  // will actually render the form, but data doesn't matter.
  $: dataProvider =
    actionType === "Update"
      ? `{{ literal ${safe(providerId)} }}`
      : { rows: [{}] }

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
  <div use:styleable={$component.styles}>
    {#if fields?.length}
      <BlockComponent
        type="dataprovider"
        context="provider"
        bind:id={providerId}
        props={{
          dataSource,
          filter,
          limit: rowId ? 1 : $builderStore.inBuilder ? 1 : 0,
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
          }}
        >
          <BlockComponent
            type="form"
            props={{
              actionType,
              dataSource,
              size,
              disabled: disabled || actionType === "View",
            }}
            context="form"
            bind:id={formId}
          >
            <Layout noPadding gap="M">
              <div class="title" class:with-text={!!title}>
                <BlockComponent type="heading" props={{ text: title || "" }} />
                <div class="buttons">
                  {#if showDeleteButton && actionType === "Update"}
                    <BlockComponent
                      type="button"
                      props={{
                        text: "Delete",
                        onClick: onDelete,
                        quiet: true,
                        type: "secondary",
                      }}
                    />
                  {/if}
                  {#if showSaveButton && actionType !== "View"}
                    <BlockComponent
                      type="button"
                      props={{
                        text: "Save",
                        onClick: onSave,
                        type: "cta",
                      }}
                    />
                  {/if}
                </div>
              </div>
              <BlockComponent type="fieldgroup" props={{ labelPosition }}>
                {#each fields as field}
                  {#if getComponentForField(field)}
                    <BlockComponent
                      type={getComponentForField(field)}
                      props={{
                        field,
                        label: field,
                        placeholder: field,
                        disabled,
                      }}
                    />
                  {/if}
                {/each}
              </BlockComponent>
            </Layout>
          </BlockComponent>
        </BlockComponent>
      </BlockComponent>
    {:else}
      <Placeholder
        text="Choose your table and add some fields to your form to get started"
      />
    {/if}
  </div>
</Block>

<style>
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
    order: 2;
  }
  .title.with-text {
    order: 0;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>
