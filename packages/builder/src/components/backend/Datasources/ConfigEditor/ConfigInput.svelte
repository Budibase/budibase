<script lang="ts">
  import ObjectField from "./fields/Object.svelte"
  import BooleanField from "./fields/Boolean.svelte"
  import LongFormField from "./fields/LongForm.svelte"
  import FieldGroupField from "./fields/FieldGroup.svelte"
  import StringField from "./fields/String.svelte"
  import SelectField from "./fields/Select.svelte"
  import { DatasourceFieldType } from "@budibase/types"

  export let type: `${DatasourceFieldType}`
  export let value: any
  export let error: string | null
  export let name: string
  export let config: any = undefined
  export let placeholder: string | undefined = undefined

  // don't pass "number" type as it stops those options from being configurable
  // with an environment variable
  $: filteredType =
    type === DatasourceFieldType.NUMBER ? DatasourceFieldType.STRING : type

  const selectComponent = (type: `${DatasourceFieldType}`) => {
    if (type === "object") {
      return ObjectField
    } else if (type === "boolean") {
      return BooleanField
    } else if (type === "longForm") {
      return LongFormField
    } else if (type === "fieldGroup") {
      return FieldGroupField
    } else if (type === "select") {
      return SelectField
    } else {
      return StringField
    }
  }

  $: component = selectComponent(filteredType)
</script>

<svelte:component
  this={component}
  type={filteredType}
  {value}
  {error}
  {name}
  {config}
  {placeholder}
  on:blur
  on:change
  on:nestedFieldBlur
/>
