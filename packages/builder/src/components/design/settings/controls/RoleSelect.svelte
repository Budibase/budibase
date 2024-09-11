<script>
  import { Select } from "@budibase/bbui"
  import { roles } from "stores/builder"
  import { RoleUtils } from "@budibase/frontend-core"

  export let value
  export let error
  export let placeholder = null
</script>

<Select
  bind:value
  on:change
  options={$roles}
  getOptionLabel={role => role.name}
  getOptionValue={role => role._id}
  getOptionColour={role =>
    role.color || "var(--spectrum-global-color-static-magenta-400)"}
  {placeholder}
  {error}
/>
