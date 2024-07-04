<script>
import { Select } from "@budibase/bbui"
import { layoutStore } from "stores/builder"

export let value
</script>

<Select
  bind:value
  on:change
  options={$layoutStore.layouts}
  getOptionLabel={layout => layout.name}
  getOptionValue={layout => layout._id}
/>
