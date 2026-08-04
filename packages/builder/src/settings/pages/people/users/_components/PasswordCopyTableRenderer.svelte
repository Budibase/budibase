<svelte:options runes={true} />

<script lang="ts">
  import { InternalRenderer } from "@budibase/bbui"

  interface Props {
    value: string
  }

  let { value }: Props = $props()
</script>

<div style="display: flex; ">
  {value}
  <div style="margin-left: 1.5rem;">
    <InternalRenderer {value} />
  </div>
</div>

<style>
</style>
