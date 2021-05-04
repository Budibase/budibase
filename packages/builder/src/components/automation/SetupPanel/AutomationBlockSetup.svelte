<script>
  import TableSelector from "./TableSelector.svelte"
  import RowSelector from "./RowSelector.svelte"
  import QuerySelector from "./QuerySelector.svelte"
  import SchemaSetup from "./SchemaSetup.svelte"
  import QueryParamSelector from "./QueryParamSelector.svelte"
  import { Button, Input, Select, Label } from "@budibase/bbui"
  import { automationStore } from "builderStore"
  import WebhookDisplay from "../Shared/WebhookDisplay.svelte"
  import DrawerBindableInput from "../../common/DrawerBindableInput.svelte"
  import AutomationBindingPanel from "./AutomationBindingPanel.svelte"
  import Editor from "components/integration/QueryEditor.svelte"
  import CodeEditorModal from "./CodeEditorModal.svelte"

  export let block
  export let webhookModal
  $: inputs = Object.entries(block.schema?.inputs?.properties || {})
  $: stepId = block.stepId
  $: bindings = getAvailableBindings(
    block,
    $automationStore.selectedAutomation?.automation?.definition
  )

  function getAvailableBindings(block, automation) {
    if (!block || !automation) {
      return []
    }

    // Find previous steps to the selected one
    let allSteps = [...automation.steps]
    if (automation.trigger) {
      allSteps = [automation.trigger, ...allSteps]
    }
    const blockIdx = allSteps.findIndex(step => step.id === block.id)

    // Extract all outputs from all previous steps as available bindings
    let bindings = []
    for (let idx = 0; idx < blockIdx; idx++) {
      const outputs = Object.entries(
        allSteps[idx].schema?.outputs?.properties ?? {}
      )
      bindings = bindings.concat(
        outputs.map(([name, value]) => ({
          label: name,
          type: value.type,
          description: value.description,
          category: idx === 0 ? "Trigger outputs" : `Step ${idx} outputs`,
          path: idx === 0 ? `trigger.${name}` : `steps.${idx}.${name}`,
        }))
      )
    }
    return bindings
  }
</script>

<div class="fields">
  <div class="block-label">{block.name}</div>
  {#each inputs as [key, value]}
    <div class="block-field">
      <Label>{value.title}</Label>
      {#if value.type === "string" && value.enum}
        <Select
          bind:value={block.inputs[key]}
          options={value.enum}
          getOptionLabel={(x, idx) => (value.pretty ? value.pretty[idx] : x)}
        />
      {:else if value.customType === "password"}
        <Input type="password" bind:value={block.inputs[key]} />
      {:else if value.customType === "email"}
        <DrawerBindableInput
          panel={AutomationBindingPanel}
          type={"email"}
          value={block.inputs[key]}
          on:change={e => (block.inputs[key] = e.detail)}
          {bindings}
        />
      {:else if value.customType === "table"}
        <TableSelector bind:value={block.inputs[key]} />
      {:else if value.customType === "row"}
        <RowSelector bind:value={block.inputs[key]} {bindings} />
      {:else if value.customType === "webhookUrl"}
        <WebhookDisplay value={block.inputs[key]} />
      {:else if value.customType === "triggerSchema"}
        <SchemaSetup bind:value={block.inputs[key]} />
      {:else if value.type === "string" || value.type === "number"}
        <DrawerBindableInput
          panel={AutomationBindingPanel}
          type={value.customType}
          value={block.inputs[key]}
          on:change={e => (block.inputs[key] = e.detail)}
          {bindings}
        />
      {/if}
    </div>
  {/each}
</div>
{#if stepId === "WEBHOOK"}
  <Button secondary on:click={() => webhookModal.show()}>Set Up Webhook</Button>
{/if}

<style>
  .fields {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-s);
  }

  .block-field {
    display: grid;
  }

  .block-label {
    font-weight: 500;
    font-size: var(--font-size-s);
    color: var(--grey-7);
  }
</style>
