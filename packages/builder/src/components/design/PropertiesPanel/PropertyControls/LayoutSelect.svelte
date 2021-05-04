<script>
  import { store } from "builderStore"
  import { Select } from "@budibase/bbui"

  export let value
</script>

<Select
  bind:value
  on:change
  options={$store.layouts}
  getOptionLabel={layout => layout.name}
  getOptionValue={layout => layout._id}
/>
