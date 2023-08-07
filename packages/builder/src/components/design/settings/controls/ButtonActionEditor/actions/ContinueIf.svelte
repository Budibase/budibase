<script>
  import { Select, Body, Checkbox, Multiselect } from "@budibase/bbui"
  import { onMount } from "svelte"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
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
  const finalActionOptions = [
    "Execute Query",
    "Refresh Data Provider",
    "Navigate To",
    "Trigger Automation",
    "Close Screen Modal",
    "Show Notification",
    "Open Side Panel",
    "Close Side Panel",
    "Update Field Value",
    "Scroll To Field",
    "Change Form Step",
    "Clear Form",
  ]

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "continue"
    }
    if (!parameters.operator) {
      parameters.operator = "equal"
    }
    if (parameters.disableFinalActions) {
      parameters.allowFinalActions = false
      parameters.finalActions = null
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
  <Checkbox
    text="Allow final actions on halt"
    bind:value={parameters.allowFinalActions}
    on:change={() => (parameters.finalActions = null)}
    disabled={parameters.disableFinalActions}
  />
  {#if parameters.allowFinalActions}
    <Multiselect
      bind:value={parameters.finalActions}
      options={finalActionOptions}
      placeholder={null}
    />
  {/if}
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
