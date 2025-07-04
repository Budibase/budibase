<script>
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import { Label } from "@budibase/bbui"

  export let bindings = []
  export let parameters

  // Default duration
  parameters.duration = 3000

  const MAX_DURATION = 120000

  function handleDurationChange(event) {
    let newDuration = event.detail
    if (newDuration > MAX_DURATION) {
      newDuration = MAX_DURATION
    }
    parameters.duration = newDuration
  }
</script>

<div class="root">
  <Label>Duration (ms)</Label>
  <DrawerBindableInput
    title="Delay in milliseconds"
    {bindings}
    value={parameters.duration}
    placeholder="3000"
    on:change={handleDurationChange}
  />
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
  }
</style>
