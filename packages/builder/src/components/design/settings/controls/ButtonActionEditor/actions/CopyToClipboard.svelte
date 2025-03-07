<script>
  import { Label, Checkbox } from "@budibase/bbui"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []
</script>

<div class="root">
  <Label>Text to copy</Label>
  <DrawerBindableInput
    title="Text to copy"
    {bindings}
    value={parameters.textToCopy}
    on:change={e => (parameters.textToCopy = e.detail)}
  />
  <Label />
  <Checkbox text="Show notification" bind:value={parameters.showNotification} />
  {#if parameters.showNotification}
    <Label>Notification message</Label>
    <DrawerBindableInput
      title="Notification message"
      {bindings}
      value={parameters.notificationMessage}
      placeholder="Copied to clipboard"
      on:change={e => (parameters.notificationMessage = e.detail)}
    />
  {/if}
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 120px 1fr;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
  }
</style>
