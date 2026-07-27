<script lang="ts">
  import { Select } from "@budibase/bbui"
  import { roles } from "@/stores/builder"
  import { createEventDispatcher } from "svelte"

  export let value: string
  export let error: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let autoWidth: boolean = false

  const dispatch = createEventDispatcher<{ change: string | undefined }>()
</script>

<Select
  bind:value
  on:change={r => dispatch("change", r.detail)}
  options={$roles}
  getOptionLabel={role => role.uiMetadata?.displayName}
  getOptionValue={role => role._id}
  getOptionColour={role => role.uiMetadata?.color}
  {placeholder}
  {error}
  {autoWidth}
/>
