<script>
  import ObjectField from "./fields/Object.svelte"
  import BooleanField from "./fields/Boolean.svelte"
  import LongFormField from "./fields/LongForm.svelte"
  import FieldGroupField from "./fields/FieldGroup.svelte"
  import StringField from "./fields/String.svelte"

  export let type
  export let value
  export let error
  export let name
  export let showModal = () => {}

  const selectComponent = type => {
    if (type === "object") {
      return ObjectField
    } else if (type === "boolean") {
      return BooleanField
    } else if (type === "longForm") {
      return LongFormField
    } else if (type === "fieldGroup") {
      return FieldGroupField
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
  {showModal}
  on:blur
  on:change
/>
