<script>
  import { getContext } from "svelte"
  import InnerFormBlock from "./InnerFormBlock.svelte"
  import { Utils } from "@budibase/frontend-core"
  import FormBlockWrapper from "./FormBlockWrapper.svelte"
  import { get } from "svelte/store"

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
  export let buttonsCollapsed
  export let buttonsCollapsedText

  // Legacy
  export let showDeleteButton
  export let showSaveButton
  export let saveButtonLabel
  export let deleteButtonLabel

  const { fetchDatasourceSchema, generateGoldenSample } = getContext("sdk")
  const component = getContext("component")
  const context = getContext("context")

  let schema

  $: fetchSchema(dataSource)
  $: id = $component.id
  $: formattedFields = convertOldFieldFormat(fields)
  $: fieldsOrDefault = getDefaultFields(formattedFields, schema)
  $: buttonsOrDefault =
    buttons ||
    Utils.buildFormBlockButtonConfig({
      _id: id,
      showDeleteButton,
      showSaveButton,
      saveButtonLabel,
      deleteButtonLabel,
      notificationOverride,
      actionType,
      actionUrl,
      dataSource,
    })

  // Provide additional data context for live binding eval
  export const getAdditionalDataContext = () => {
    const id = get(component).id
    const rows = get(context)[`${id}-provider`]?.rows || []
    const goldenRow = generateGoldenSample(rows)
    return {
      [`${id}-repeater`]: goldenRow,
    }
  }

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

  const fetchSchema = async () => {
    schema = (await fetchDatasourceSchema(dataSource)) || {}
  }
</script>

<FormBlockWrapper {actionType} {dataSource} {rowId} {noRowsMessage}>
  <InnerFormBlock
    {dataSource}
    {actionUrl}
    {actionType}
    {size}
    {disabled}
    fields={fieldsOrDefault}
    {title}
    {description}
    {schema}
    {notificationOverride}
    buttons={buttonsOrDefault}
    buttonPosition={buttons ? buttonPosition : "top"}
    {buttonsCollapsed}
    {buttonsCollapsedText}
  />
</FormBlockWrapper>
