<script>
  import { Select } from "@budibase/bbui"
  import { roles } from "@/stores/builder"

  export let value
  export let error
  export let placeholder = null
  export let autoWidth = false
</script>

<Select
  bind:value
  on:change
  options={$roles}
  getOptionLabel={role => role.uiMetadata.displayName}
  getOptionValue={role => role._id}
  getOptionColour={role => role.uiMetadata.color}
  {placeholder}
  {error}
  {autoWidth}
/>
