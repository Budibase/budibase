<script>
  import { backendUiStore, store } from "builderStore"
  import ComponentSelector from "./ParamInputs/ComponentSelector.svelte"
  import ModelSelector from "./ParamInputs/ModelSelector.svelte"
  import RecordSelector from "./ParamInputs/RecordSelector.svelte"
  import { Input, TextArea, Select } from "@budibase/bbui"

  export let workflowBlock

  let params

  $: workflowParams = workflowBlock.params
    ? Object.entries(workflowBlock.params)
    : []
</script>

<div class="container">
  {#each workflowParams as [parameter, type]}
    <div class="block-field">
      <label class="label">{parameter}</label>
      {#if Array.isArray(type)}
        <Select bind:value={workflowBlock.args[parameter]} thin secondary>
          {#each type as option}
            <option value={option}>{option}</option>
          {/each}
        </Select>
      {:else if type === 'component'}
        <ComponentSelector bind:value={workflowBlock.args[parameter]} />
      {:else if type === 'accessLevel'}
        <Select bind:value={workflowBlock.args[parameter]} thin secondary>
          <option value="ADMIN">Admin</option>
          <option value="POWER_USER">Power User</option>
        </Select>
      {:else if type === 'password'}
        <Input
          type="password"
          thin
          bind:value={workflowBlock.args[parameter]} />
      {:else if type === 'number'}
        <Input type="number" thin bind:value={workflowBlock.args[parameter]} />
      {:else if type === 'longText'}
        <TextArea type="text" thin bind:value={workflowBlock.args[parameter]} />
      {:else if type === 'model'}
        <ModelSelector bind:value={workflowBlock.args[parameter]} />
      {:else if type === 'record'}
        <RecordSelector value={workflowBlock.args[parameter]} />
      {:else if type === 'string'}
        <Input type="text" thin bind:value={workflowBlock.args[parameter]} />
      {/if}
    </div>
  {/each}
</div>

<style>
  .container {
    margin-top: -20px;
  }

  .block-field {
    display: grid;
  }

  label {
    font-size: 14px;
    font-family: sans-serif;
    font-weight: 500;
    color: var(--ink);
    margin-bottom: 12px;
    text-transform: capitalize;
    margin-top: 20px;
  }

  .selected-label {
    text-transform: capitalize;
    font-size: 14px;
    font-weight: 500;
  }

  textarea {
    min-height: 150px;
    font-family: inherit;
    padding: 12px;
    margin-top: 8px;
  }
</style>
