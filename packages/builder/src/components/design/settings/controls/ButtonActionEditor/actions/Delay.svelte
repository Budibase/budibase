<script>
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import { Label } from "@budibase/bbui"

  export let bindings = []
  export let parameters

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
  <Label>Delay (ms)</Label>
  <DrawerBindableInput
    title="Delay in milliseconds"
    {bindings}
    value={parameters.duration}
    placeholder="3000"
    on:change={handleDurationChange}
  />
</div>
