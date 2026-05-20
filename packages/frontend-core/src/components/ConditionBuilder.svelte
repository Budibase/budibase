<script>
  import {
    FieldType,
  } from "@budibase/types"
  import { Constants } from "@budibase/frontend-core"
  import CoreFilterBuilder from "./CoreFilterBuilder.svelte"
  import ConditionField from "./ConditionField.svelte"
  import { Select } from "@budibase/bbui"

  const { FilterValueType } = Constants

  export let schemaFields
  export let filters
  export let datasource
  export let bindings
  export let panel
  export let allowOnEmpty = true
  export let docsURL = undefined
  export let toReadable = undefined
  export let toRuntime = undefined
  export let evaluationContext = {}

  const conditionValueTypeOptions = [
    { label: "Text", value: FieldType.STRING },
    { label: "Number", value: FieldType.NUMBER },
    { label: "Date", value: FieldType.DATETIME },
    { label: "Boolean", value: FieldType.BOOLEAN },
  ]

  const getConditionValueType = filter => {
    if (
      [
        FieldType.STRING,
        FieldType.NUMBER,
        FieldType.DATETIME,
        FieldType.BOOLEAN,
      ].includes(filter.type)
    ) {
      return filter.type
    }
    return FieldType.STRING
  }
</script>

<CoreFilterBuilder
  {filters}
  {schemaFields}
  {datasource}
  {bindings}
  {panel}
  allowBindings={true}
  {allowOnEmpty}
  {docsURL}
  {toReadable}
  {toRuntime}
  {evaluationContext}
  prefix="Run branch when matching"
  filterTypeLabel="condition"
  drawerTitle="Edit binding"
  bindingValueType={FilterValueType.VALUE}
  useConditionValueControls={true}
  on:change
>
  <div slot="field-column" let:filter let:onUpdate>
    <ConditionField
      placeholder="Value"
      {filter}
      drawerTitle="Edit Binding"
      {bindings}
      {panel}
      {toReadable}
      {toRuntime}
      {evaluationContext}
      on:change={e => {
        const updated = {
          ...filter,
          field: e.detail.field,
        }
        onUpdate(updated)
      }}
    />
  </div>
  <div
    slot="extra-column"
    let:filter
    let:onUpdate
    let:sanitizeOperator
    let:sanitizeValue
  >
    <Select
      value={getConditionValueType(filter)}
      options={conditionValueTypeOptions}
      on:change={e => {
        const previousType = filter.type
        const updated = {
          ...filter,
          value: null,
          valueType: FilterValueType.VALUE,
          type: e.detail,
        }
        sanitizeOperator(updated)
        sanitizeValue(updated, previousType)
        onUpdate(updated)
      }}
      placeholder={false}
      popoverAutoWidth
    />
  </div>
</CoreFilterBuilder>
