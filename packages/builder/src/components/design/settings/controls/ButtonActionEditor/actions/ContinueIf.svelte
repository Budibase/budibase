<script>
  import { Select, Body } from "@budibase/bbui"
  import { onMount } from "svelte"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings

  const typeOptions = [
    {
      label: "Continue if",
      value: "continue",
    },
    {
      label: "Stop if",
      value: "stop",
    },
  ]
  const operatorOptions = [
    {
      label: "Equals",
      value: "equal",
    },
    {
      label: "Not equals",
      value: "notEqual",
    },
  ]

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "continue"
    }
    if (!parameters.operator) {
      parameters.operator = "equal"
    }
  })
</script>

<div class="root">
  <Body size="S">
    Configure a condition to be evaluated which can stop further actions from
    being executed.
  </Body>
  <Select
    bind:value={parameters.type}
    options={typeOptions}
    placeholder={null}
  />
  <DrawerBindableInput
    placeholder="Value"
    value={parameters.value}
    on:change={e => (parameters.value = e.detail)}
    {bindings}
  />
  <Select
    bind:value={parameters.operator}
    options={operatorOptions}
    placeholder={null}
  />
  <DrawerBindableInput
    placeholder="Reference value"
    bind:value={parameters.referenceValue}
    on:change={e => (parameters.referenceValue = e.detail)}
    {bindings}
  />
</div>

<style>
  .root {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    justify-content: flex-start;
    align-items: stretch;
    max-width: 400px;
    margin: 0 auto;
  }
</style>
