<script>
  import { Select } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"

  export let value
</script>

<Select bind:value extraThin secondary on:change>
  <option value="">Choose an option</option>
  {#each $backendUiStore.roles as role}
    <option value={role._id}>{role.name}</option>
  {/each}
</Select>
