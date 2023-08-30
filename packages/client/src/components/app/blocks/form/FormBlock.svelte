<script>
  import { getContext } from "svelte"
  import BlockComponent from "components/BlockComponent.svelte"
  import Block from "components/Block.svelte"
  import { makePropSafe as safe } from "@budibase/string-templates"
  import InnerFormBlock from "./InnerFormBlock.svelte"

  export let actionType
  export let dataSource
  export let size
  export let disabled
  export let fields
  export let labelPosition
  export let title
  export let showDeleteButton
  export let showSaveButton
  export let saveButtonLabel
  export let deleteButtonLabel
  export let rowId
  export let actionUrl
  export let noRowsMessage
  export let notificationOverride

  // Accommodate old config to ensure delete button does not reappear
  $: deleteLabel = showDeleteButton === false ? "" : deleteButtonLabel?.trim()
  $: saveLabel = showSaveButton === false ? "" : saveButtonLabel?.trim()

  const { fetchDatasourceSchema } = getContext("sdk")

  const convertOldFieldFormat = fields => {
    if (!fields) {
      return []
    }
    return fields.map(field => {
      if (typeof field === "string") {
        // existed but was a string
        return {
          name: field,
          active: true,
        }
      } else {
        // existed but had no state
        return {
          ...field,
          active: typeof field?.active != "boolean" ? true : field?.active,
        }
      }
    })
  }

  const getDefaultFields = (fields, schema) => {
    if (!schema) {
      return []
    }
    let defaultFields = []

    if (!fields || fields.length === 0) {
      Object.values(schema)
        .filter(field => !field.autocolumn)
        .forEach(field => {
          defaultFields.push({
            name: field.name,
            active: true,
          })
        })
    }
    return [...fields, ...defaultFields].filter(field => field.active)
  }

  let schema
  let providerId
  let repeaterId

  $: formattedFields = convertOldFieldFormat(fields)
  $: fieldsOrDefault = getDefaultFields(formattedFields, schema)
  $: fetchSchema(dataSource)
  $: dataProvider = `{{ literal ${safe(providerId)} }}`
  $: filter = [
    {
      field: "_id",
      operator: "equal",
      type: "string",
      value: !rowId ? `{{ ${safe("url")}.${safe("id")} }}` : rowId,
      valueType: "Binding",
    },
  ]
  // We could simply spread $$props into the inner form and append our
  // additions, but that would create svelte warnings about unused props and
  // make maintenance in future more confusing as we typically always have a
  // proper mapping of schema settings to component exports, without having to
  // search multiple files
  $: innerProps = {
    dataSource,
    actionUrl,
    actionType,
    size,
    disabled,
    fields: fieldsOrDefault,
    labelPosition,
    title,
    saveButtonLabel: saveLabel,
    deleteButtonLabel: deleteLabel,
    schema,
    repeaterId,
    notificationOverride,
  }
  const fetchSchema = async () => {
    schema = (await fetchDatasourceSchema(dataSource)) || {}
  }
</script>

<Block>
  {#if actionType === "Create"}
    <BlockComponent
      type="container"
      props={{
        direction: "column",
        hAlign: "left",
        vAlign: "stretch",
      }}
    >
      <InnerFormBlock {...innerProps} />
    </BlockComponent>
  {:else}
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
          noRowsMessage: noRowsMessage || "We couldn't find a row to display",
          direction: "column",
          hAlign: "center",
        }}
      >
        <InnerFormBlock {...innerProps} />
      </BlockComponent>
    </BlockComponent>
  {/if}
</Block>
