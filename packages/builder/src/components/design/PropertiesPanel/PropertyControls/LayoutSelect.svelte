<script>
  import { store } from "builderStore"
  import { Select } from "@budibase/bbui"

  export let value
</script>

<Select
  bind:value
  on:change
  options={$store.layouts}
<<<<<<< HEAD
  getOptionLabel={(layout) => layout.name}
  getOptionValue={(layout) => layout._id}
=======
  getOptionLabel={layout => layout.name}
  getOptionValue={layout => layout._id}
>>>>>>> 900637c221e4034babd21d69dcaa71b360a2adb2
/>
