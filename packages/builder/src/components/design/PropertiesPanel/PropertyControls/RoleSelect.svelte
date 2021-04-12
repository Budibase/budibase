<script>
  import { Select } from "@budibase/bbui"
  import { roles } from "stores/backend"

  export let value
</script>

<Select bind:value extraThin secondary on:change>
  <option value="">Choose an option</option>
  {#each $roles as role}
    <option value={role._id}>{role.name}</option>
  {/each}
</Select>
