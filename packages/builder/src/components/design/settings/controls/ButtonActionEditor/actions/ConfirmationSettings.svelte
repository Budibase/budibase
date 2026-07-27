<script>
  import { Checkbox, Label } from "@budibase/bbui"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []
  export let layout = "grid"

  $: isGrid = layout === "grid"
</script>

{#if isGrid}
  <br />
  <Checkbox text="Require confirmation" bind:value={parameters.confirm} />

  {#if parameters.confirm}
    <Label small>Title</Label>
    <DrawerBindableInput
      placeholder="Prompt User"
      value={parameters.customTitleText}
      on:change={e => (parameters.customTitleText = e.detail)}
      {bindings}
    />

    <Label small>Text</Label>
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
  {/if}
{:else}
  <Checkbox text="Require confirmation" bind:value={parameters.confirm} />

  {#if parameters.confirm}
    <div class="params">
      <DrawerBindableInput
        label="Title"
        placeholder="Prompt User"
        value={parameters.customTitleText}
        on:change={e => (parameters.customTitleText = e.detail)}
        {bindings}
      />
      <DrawerBindableInput
        label="Message"
        placeholder="Are you sure you want to continue?"
        value={parameters.confirmText}
        on:change={e => (parameters.confirmText = e.detail)}
        {bindings}
      />

      <DrawerBindableInput
        label="Confirm Text"
        placeholder="Confirm"
        value={parameters.confirmButtonText}
        on:change={e => (parameters.confirmButtonText = e.detail)}
        {bindings}
      />

      <DrawerBindableInput
        label="Cancel Text"
        placeholder="Cancel"
        value={parameters.cancelButtonText}
        on:change={e => (parameters.cancelButtonText = e.detail)}
        {bindings}
      />
    </div>
  {/if}
{/if}

<style>
  .params {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }
</style>
