<script>
  import ModelSelector from "./ParamInputs/ModelSelector.svelte"
  import RecordSelector from "./ParamInputs/RecordSelector.svelte"
  import { Input, TextArea, Select, Label } from "@budibase/bbui"

  export let block
  $: inputs = Object.entries(block.schema?.inputs?.properties || {})
</script>

<div class="container">
  <div class="block-label">{block.name}</div>
  {#each inputs as [key, value]}
    <div class="bb-margin-xl block-field">
      <div class="field-label">{value.title}</div>
      {#if value.type === 'string' && value.enum?.length}
        <Select bind:value={block.inputs[key]} thin secondary>
          <option value="">Choose an option</option>
          {#each value.enum as option}
            <option value={option}>{option}</option>
          {/each}
        </Select>
      {:else if value.customType === 'password'}
        <Input type="password" thin bind:value={block.inputs[key]} />
      {:else if value.type === 'number'}
        <Input type="number" thin bind:value={block.inputs[key]} />
      {:else if value.customType === 'longText'}
        <TextArea type="text" thin bind:value={block.inputs[key]} />
      {:else if value.customType === 'model'}
        <ModelSelector bind:value={block.inputs[key]} />
      {:else if value.customType === 'record'}
        <RecordSelector bind:value={block.inputs[key]} />
      {:else if value.type === 'string'}
        <Input type="text" thin bind:value={block.inputs[key]} />
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
