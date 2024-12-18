<script>
  import { Select, Label, Checkbox } from "@budibase/bbui"
  import { onMount } from "svelte"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []

  const types = [
    {
      label: "Success",
      value: "success",
    },
    {
      label: "Warning",
      value: "warning",
    },
    {
      label: "Error",
      value: "error",
    },
    {
      label: "Info",
      value: "info",
    },
  ]

  const MAX_DURATION = 120000 // Maximum duration in milliseconds (2 minutes)

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "success"
    }
    if (parameters.autoDismiss == null) {
      parameters.autoDismiss = true
    }
  })

  function handleDurationChange(event) {
    let newDuration = event.detail
    if (newDuration > MAX_DURATION) {
      newDuration = MAX_DURATION
    }
    parameters.duration = newDuration
  }
</script>

<div class="root">
  <Label>Type</Label>
  <Select bind:value={parameters.type} options={types} placeholder={null} />
  <Label>Message</Label>
  <DrawerBindableInput
    title="Message"
    {bindings}
    value={parameters.message}
    on:change={e => (parameters.message = e.detail)}
  />
  <Label />
  <Checkbox text="Auto dismiss" bind:value={parameters.autoDismiss} />
  {#if parameters.autoDismiss}
    <Label>Duration (ms)</Label>
    <DrawerBindableInput
      title="Duration"
      {bindings}
      value={parameters.duration}
      placeholder="3000"
      on:change={handleDurationChange}
    />
  {/if}
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
