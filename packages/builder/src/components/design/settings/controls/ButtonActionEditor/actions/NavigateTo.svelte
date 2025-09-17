<script>
  import { screenStore } from "@/stores/builder"
  import { onMount } from "svelte"
  import { Label, Checkbox, Select } from "@budibase/bbui"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import DrawerBindableCombobox from "@/components/common/bindings/DrawerBindableCombobox.svelte"

  export let parameters
  export let bindings = []

  $: urlOptions = screenStore.routes

  const typeOptions = [
    {
      label: "Screen",
      value: "screen",
    },
    {
      label: "URL",
      value: "url",
    },
  ]

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "screen"
    }
  })
</script>

<div class="root">
  <Label small>Destination</Label>
  <Select
    placeholder={null}
    bind:value={parameters.type}
    options={typeOptions}
    on:change={() => (parameters.url = "")}
  />
  {#if parameters.type === "screen"}
    <DrawerBindableCombobox
      title="Destination"
      placeholder="/screen"
      value={parameters.url}
      on:change={value => {
        parameters.url = value.detail ? value.detail.trim() : value.detail
      }}
      {bindings}
      options={$urlOptions}
      appendBindingsAsOptions={false}
    />
    <div />
    <Checkbox text="Open screen in modal" bind:value={parameters.peek} />
    {#if parameters.peek}
      <DrawerBindableInput
        title="Full screen button text"
        placeholder="Full screen"
        value={parameters.fullscreenText}
        on:change={value => {
          parameters.fullscreenText = value.detail
            ? value.detail.trim()
            : value.detail
        }}
        {bindings}
      />
      <DrawerBindableInput
        title="Close button text"
        placeholder="Close"
        value={parameters.closeText}
        on:change={value => {
          parameters.closeText = value.detail
            ? value.detail.trim()
            : value.detail
        }}
        {bindings}
      />
    {/if}
  {:else}
    <DrawerBindableInput
      title="Destination"
      placeholder="/url"
      value={parameters.url}
      on:change={value => {
        parameters.url = value.detail ? value.detail.trim() : value.detail
      }}
      {bindings}
    />
    <div />
    <Checkbox text="New Tab" bind:value={parameters.externalNewTab} />
  {/if}
</div>

<style>
  .root {
    display: grid;
    align-items: center;
    gap: var(--spacing-m);
    grid-template-columns: auto;
    max-width: 400px;
    margin: 0 auto;
  }
</style>
