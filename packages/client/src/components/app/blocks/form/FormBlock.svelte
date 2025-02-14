<script lang="ts">
  import { getContext } from "svelte"
  import InnerFormBlock from "./InnerFormBlock.svelte"
  import { Utils } from "@budibase/frontend-core"
  import FormBlockWrapper from "./FormBlockWrapper.svelte"
  import { get } from "svelte/store"
  import { TableSchema } from "@budibase/types"

  type Field = { name: string; active: boolean }

  export let actionType: string
  export let dataSource: { resourceId: string }
  export let size: string
  export let disabled: boolean
  export let fields: (Field | string)[]
  export let buttons: {
    "##eventHandlerType": string
    parameters: Record<string, string>
  }[]
  export let buttonPosition: "top" | "bottom"
  export let title: string
  export let description: string
  export let rowId: string
  export let actionUrl: string
  export let noRowsMessage: string
  export let notificationOverride: boolean
  export let buttonsCollapsed: boolean
  export let buttonsCollapsedText: string

  // Legacy
  export let showDeleteButton: boolean
  export let showSaveButton: boolean
  export let saveButtonLabel: string
  export let deleteButtonLabel: string

  const { fetchDatasourceSchema, generateGoldenSample } = getContext("sdk")
  const component = getContext("component")
  const context = getContext("context")

  let schema: TableSchema

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

  const convertOldFieldFormat = (fields: (Field | string)[]): Field[] => {
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

  const getDefaultFields = (fields: Field[], schema: TableSchema) => {
    if (!schema) {
      return []
    }
    let defaultFields: Field[] = []

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

  const fetchSchema = async (datasource: { resourceId: string }) => {
    schema = (await fetchDatasourceSchema(datasource)) || {}
  }
</script>

<FormBlockWrapper {actionType} {dataSource} {rowId} {noRowsMessage}>
  <InnerFormBlock
    {dataSource}
    {actionType}
    {size}
    {disabled}
    fields={fieldsOrDefault}
    {title}
    {description}
    {schema}
    buttons={buttonsOrDefault}
    buttonPosition={buttons ? buttonPosition : "top"}
    {buttonsCollapsed}
    {buttonsCollapsedText}
  />
</FormBlockWrapper>
