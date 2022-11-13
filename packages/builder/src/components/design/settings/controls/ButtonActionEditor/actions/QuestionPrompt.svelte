<script>
  import { Body, Label, Input } from "@budibase/bbui"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { onMount } from "svelte"

  export let parameters

  onMount(() => {
    if (!parameters.confirm) {
      parameters.confirm = true
    }
  })
</script>

<div class="root">
  <Body size="S">Enter the message you wish to display to the user.</Body>
  <div class="params">
    <Label small>Message</Label>
    <Input
      placeholder="Are you sure you want to continue?"
      bind:value={parameters.confirmText}
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
