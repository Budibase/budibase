<svelte:options runes={true} />

<script>
  import { InternalRenderer } from "@budibase/bbui"

  let { value } = $props()
</script>

<div style="display: flex; ">
  {value}
  <div style="margin-left: 1.5rem;">
    <InternalRenderer {value} />
  </div>
</div>

<style>
</style>
