<script lang="ts">
  import ObjectField from "./fields/Object.svelte"
  import BooleanField from "./fields/Boolean.svelte"
  import LongFormField from "./fields/LongForm.svelte"
  import FieldGroupField from "./fields/FieldGroup.svelte"
  import StringField from "./fields/String.svelte"
  import SelectField from "./fields/Select.svelte"

  type InputType =
    | "string"
    | "boolean"
    | "object"
    | "longForm"
    | "fieldGroup"
    | "select"

  export let type: InputType
  export let value: any
  export let error: string | null
  export let name: string
  export let config: any = undefined
  export let placeholder: string | undefined = undefined

  const selectComponent = (type: InputType) => {
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

  $: component = selectComponent(type)
</script>

<svelte:component
  this={component}
  {type}
  {value}
  {error}
  {name}
  {config}
  {placeholder}
  on:blur
  on:change
/>
