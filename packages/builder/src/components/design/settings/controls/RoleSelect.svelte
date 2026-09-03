<script lang="ts">
  import { Select } from "@budibase/bbui"
  import { Constants } from "@budibase/frontend-core"
  import { roles } from "@/stores/builder"

  export let value: string
  export let error: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let autoWidth: boolean = false
  export let allowPublic: boolean = true
  export let onChange: (value: string | undefined) => void = () => {}

  $: roleOptions = allowPublic
    ? $roles
    : $roles.filter(role => role._id !== Constants.Roles.PUBLIC)
</script>

<Select
  bind:value
  on:change={r => onChange(r.detail)}
  options={roleOptions}
  getOptionLabel={role => role.uiMetadata?.displayName}
  getOptionValue={role => role._id}
  getOptionColour={role => role.uiMetadata?.color}
  {placeholder}
  {error}
  {autoWidth}
/>
