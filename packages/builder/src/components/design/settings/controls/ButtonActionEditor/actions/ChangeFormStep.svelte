<script>
  import { Select, Label } from "@budibase/bbui"
  import { selectedScreen, componentStore } from "@/stores/builder"
  import { getActionProviders } from "@/dataBinding"
  import { onMount } from "svelte"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []
  export let nested

  $: actionProviders = getActionProviders(
    $selectedScreen,
    $componentStore.selectedComponentId,
    "ChangeFormStep",
    { includeSelf: nested }
  )

  const typeOptions = [
    {
      label: "Next step",
      value: "next",
    },
    {
      label: "Previous step",
      value: "prev",
    },
    {
      label: "First step",
      value: "first",
    },
    {
      label: "Specific step",
      value: "specific",
    },
  ]

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "next"
    }
  })
</script>

<div class="root">
  <Label small>Form</Label>
  <Select
    placeholder={null}
    bind:value={parameters.componentId}
    options={actionProviders}
    getOptionLabel={x => x.readableBinding}
    getOptionValue={x => x.runtimeBinding}
  />
  <Label small>Step</Label>
  <Select bind:value={parameters.type} options={typeOptions} />
  {#if parameters.type === "specific"}
    <Label small>Number</Label>
    <DrawerBindableInput
      {bindings}
      value={parameters.number}
      on:change={e => (parameters.number = e.detail)}
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
