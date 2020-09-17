<script>
  import ModelSelector from "./ParamInputs/ModelSelector.svelte"
  import RecordSelector from "./ParamInputs/RecordSelector.svelte"
  import { Input, TextArea, Select, Label } from "@budibase/bbui"
  import { workflowStore } from "builderStore"
  import BindableInput from "../../userInterface/BindableInput.svelte"

  export let block
  $: inputs = Object.entries(block.schema?.inputs?.properties || {})
  $: bindings = getAvailableBindings(
    block,
    $workflowStore.selectedWorkflow?.workflow?.definition
  )

  function getAvailableBindings(block, workflow) {
    if (!block || !workflow) {
      return []
    }

    // Find previous steps to the selected one
    let allSteps = [...workflow.steps]
    if (workflow.trigger) {
      allSteps = [workflow.trigger, ...allSteps]
    }
    const blockIdx = allSteps.findIndex(step => step.id === block.id)

    // Extract all outputs from all previous steps as available bindings
    let bindings = []
    for (let idx = 0; idx < blockIdx; idx++) {
      const outputs = Object.entries(allSteps[idx].schema?.outputs?.properties)
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

<div class="container">
  <div class="block-label">{block.name}</div>
  {#each inputs as [key, value]}
    <div class="bb-margin-xl block-field">
      <div class="field-label">{value.title}</div>
      {#if value.type === 'string' && value.enum}
        <Select bind:value={block.inputs[key]} thin secondary>
          <option value="">Choose an option</option>
          {#each value.enum as option, idx}
            <option value={option}>
              {value.pretty ? value.pretty[idx] : option}
            </option>
          {/each}
        </Select>
      {:else if value.customType === 'password'}
        <Input type="password" thin bind:value={block.inputs[key]} />
      {:else if value.customType === 'model'}
        <ModelSelector bind:value={block.inputs[key]} />
      {:else if value.customType === 'record'}
        <RecordSelector bind:value={block.inputs[key]} {bindings} />
      {:else if value.type === 'string' || value.type === 'number'}
        <BindableInput
          type={value.type}
          thin
          bind:value={block.inputs[key]}
          {bindings} />
      {/if}
    </div>
  {/each}
</div>

<style>
  .block-field {
    display: grid;
  }

  .field-label {
    color: var(--ink);
    margin-bottom: 12px;
    display: flex;
    font-size: 14px;
    font-weight: 500;
    font-family: sans-serif;
  }

  .block-label {
    font-weight: 500;
    font-size: 14px;
    color: var(--grey-7);
  }

  textarea {
    min-height: 150px;
    font-family: inherit;
    padding: 12px;
    margin-top: 8px;
  }
</style>
