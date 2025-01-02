<script>
  import { Body, Label } from "@budibase/bbui"
  import { onMount } from "svelte"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings

  onMount(() => {
    if (!parameters.confirm) {
      parameters.confirm = true
    }
  })
</script>

<div class="root">
  <Body size="S">Enter the message you wish to display to the user.</Body>
  <div class="params">
    <Label small>Title</Label>
    <DrawerBindableInput
      placeholder="Prompt User"
      value={parameters.customTitleText}
      on:change={e => (parameters.customTitleText = e.detail)}
      {bindings}
    />
    <Label small>Message</Label>
    <DrawerBindableInput
      placeholder="Are you sure you want to continue?"
      value={parameters.confirmText}
      on:change={e => (parameters.confirmText = e.detail)}
      {bindings}
    />

    <Label small>Confirm Text</Label>
    <DrawerBindableInput
      placeholder="Confirm"
      value={parameters.confirmButtonText}
      on:change={e => (parameters.confirmButtonText = e.detail)}
      {bindings}
    />

    <Label small>Cancel Text</Label>
    <DrawerBindableInput
      placeholder="Cancel"
      value={parameters.cancelButtonText}
      on:change={e => (parameters.cancelButtonText = e.detail)}
      {bindings}
    />
  </div>
</div>

<style>
  .root {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xl);
  }

  .root :global(p) {
    line-height: 1.5;
  }

  .params {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr;
    align-items: center;
  }
</style>
