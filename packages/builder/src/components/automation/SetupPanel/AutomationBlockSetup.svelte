<script>
  import TableSelector from "./TableSelector.svelte"
  import RowSelector from "./RowSelector.svelte"
  import SchemaSetup from "./SchemaSetup.svelte"
  import { Button, Input, Select, Label } from "@budibase/bbui"
  import { automationStore } from "builderStore"
  import WebhookDisplay from "../Shared/WebhookDisplay.svelte"
  import BindableInput from "../../common/BindableInput.svelte"

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

<div class="block-label">{block.name}</div>
{#each inputs as [key, value]}
  <div class="block-field">
    <Label extraSmall grey>{value.title}</Label>
    {#if value.type === 'string' && value.enum}
      <Select bind:value={block.inputs[key]} extraThin secondary>
        <option value="">Choose an option</option>
        {#each value.enum as option, idx}
          <option value={option}>
            {value.pretty ? value.pretty[idx] : option}
          </option>
        {/each}
      </Select>
    {:else if value.customType === 'password'}
      <Input type="password" extraThin bind:value={block.inputs[key]} />
    {:else if value.customType === 'email'}
      <BindableInput
        type={'email'}
        extraThin
        bind:value={block.inputs[key]}
        {bindings} />
    {:else if value.customType === 'table'}
      <TableSelector bind:value={block.inputs[key]} />
    {:else if value.customType === 'row'}
      <RowSelector bind:value={block.inputs[key]} {bindings} />
    {:else if value.customType === 'webhookUrl'}
      <WebhookDisplay value={block.inputs[key]} />
    {:else if value.customType === 'triggerSchema'}
      <SchemaSetup bind:value={block.inputs[key]} />
    {:else if value.type === 'string' || value.type === 'number'}
      <BindableInput
        type={value.customType}
        extraThin
        bind:value={block.inputs[key]}
        {bindings} />
    {/if}
  </div>
{/each}
{#if stepId === 'WEBHOOK'}
  <Button wide secondary on:click={() => webhookModal.show()}>
    Set Up Webhook
  </Button>
{/if}

<style>
  .block-field {
    display: grid;
  }

  .block-label {
    font-weight: 500;
    font-size: var(--font-size-xs);
    color: var(--grey-7);
  }

  textarea {
    min-height: 150px;
    font-family: inherit;
    padding: 12px;
    margin-top: 8px;
  }
</style>
