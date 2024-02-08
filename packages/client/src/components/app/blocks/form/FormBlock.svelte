<script>
  import { getContext } from "svelte"
  import InnerFormBlock from "./InnerFormBlock.svelte"
  import { Utils } from "@budibase/frontend-core"
  import FormBlockWrapper from "./FormBlockWrapper.svelte"

  export let actionType
  export let dataSource
  export let size
  export let disabled
  export let fields
  export let buttons
  export let buttonPosition

  export let title
  export let description
  export let rowId
  export let actionUrl
  export let noRowsMessage
  export let notificationOverride

  // Legacy
  export let showDeleteButton
  export let showSaveButton
  export let saveButtonLabel
  export let deleteButtonLabel

  const { fetchDatasourceSchema } = getContext("sdk")
  const component = getContext("component")

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

  const getDefaultFields = (fields, schema, actionType) => {
    if (!schema || actionType === "Custom") {
      return fields || []
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

  $: formattedFields = convertOldFieldFormat(fields)
  $: fieldsOrDefault = getDefaultFields(formattedFields, schema, actionType)
  $: fetchSchema(dataSource)
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
    title,
    description,
    schema,
    notificationOverride,
    buttons:
      buttons ||
      Utils.buildFormBlockButtonConfig({
        _id: $component.id,
        showDeleteButton,
        showSaveButton,
        saveButtonLabel,
        deleteButtonLabel,
        notificationOverride,
        actionType,
        actionUrl,
        dataSource,
      }),
    buttonPosition: buttons ? buttonPosition : "top",
  }
  const fetchSchema = async () => {
    schema = (await fetchDatasourceSchema(dataSource)) || {}
  }
</script>

<FormBlockWrapper {actionType} {dataSource} {rowId} {noRowsMessage}>
  <InnerFormBlock {...innerProps} />
</FormBlockWrapper>
