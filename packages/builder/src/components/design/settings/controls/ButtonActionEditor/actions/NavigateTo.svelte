<script>
  import { screenStore } from "@/stores/builder"
  import { onMount } from "svelte"
  import { Label, Select, Checkbox } from "@budibase/bbui"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import DrawerBindableCombobox from "@/components/common/bindings/DrawerBindableCombobox.svelte"
  import DrawerBindableCheckbox from "@/components/common/bindings/DrawerBindableCheckbox.svelte"

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
    <DrawerBindableCheckbox
      text="Open screen in modal"
      value={parameters.peek}
      on:change={event => (parameters.peek = event.detail)}
      {bindings}
    />
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
