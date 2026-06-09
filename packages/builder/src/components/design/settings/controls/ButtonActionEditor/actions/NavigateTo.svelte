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

  const screenTargetOptions = [
    { label: "Current tab", value: "self" },
    { label: "New tab", value: "newTab" },
    { label: "Modal", value: "modal" },
  ]

  // Derived for display only - never written back on load, so existing
  // actions keep their behaviour unless the user actively changes it.
  $: screenTarget = getScreenTarget(parameters)

  const getScreenTarget = params => {
    if (params.peek) {
      return "modal"
    }
    if (params.screenNewTab) {
      return "newTab"
    }
    return "self"
  }

  const setScreenTarget = value => {
    parameters.peek = value === "modal"
    parameters.screenNewTab = value === "newTab"
  }

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
    <Label small>Open in</Label>
    <Select
      placeholder={null}
      value={screenTarget}
      options={screenTargetOptions}
      on:change={e => setScreenTarget(e.detail)}
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
    <div></div>
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
