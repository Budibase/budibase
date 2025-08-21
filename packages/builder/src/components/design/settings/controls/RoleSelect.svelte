<script lang="ts">
  import { Select } from "@budibase/bbui"
  import { roles } from "@/stores/builder"

  export let value: string
  export let error: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let autoWidth: boolean = false
</script>

<Select
  bind:value
  on:change
  options={$roles}
  getOptionLabel={role => role.uiMetadata?.displayName}
  getOptionValue={role => role._id}
  getOptionColour={role => role.uiMetadata?.color}
  {placeholder}
  {error}
  {autoWidth}
/>
