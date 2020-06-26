<script>
  import { backendUiStore, store } from "builderStore"
  import ComponentSelector from "./ParamInputs/ComponentSelector.svelte"
  import ModelSelector from "./ParamInputs/ModelSelector.svelte"
  import RecordSelector from "./ParamInputs/RecordSelector.svelte"

  export let workflowBlock

  let params

  $: workflowParams = workflowBlock.params
    ? Object.entries(workflowBlock.params)
    : []
</script>

<label class="selected-label">{workflowBlock.type}: {workflowBlock.name}</label>
{#each workflowParams as [parameter, type]}
  <div class="block-field">
    <label class="label">{parameter}</label>
    {#if Array.isArray(type)}
      <select class="budibase_input" bind:value={workflowBlock.args[parameter]}>
        {#each type as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    {:else if type === 'component'}
      <ComponentSelector bind:value={workflowBlock.args[parameter]} />
    {:else if type === 'accessLevel'}
      <select class="budibase_input" bind:value={workflowBlock.args[parameter]}>
        <option value="ADMIN">Admin</option>
        <option value="POWER_USER">Power User</option>
      </select>
    {:else if type === 'password'}
      <input
        type="password"
        class="budibase_input"
        bind:value={workflowBlock.args[parameter]} />
    {:else if type === 'number'}
      <input
        type="number"
        class="budibase_input"
        bind:value={workflowBlock.args[parameter]} />
    {:else if type === 'longText'}
      <textarea
        type="text"
        class="budibase_input"
        bind:value={workflowBlock.args[parameter]} />
    {:else if type === 'model'}
      <ModelSelector bind:value={workflowBlock.args[parameter]} />
    {:else if type === 'record'}
      <RecordSelector bind:value={workflowBlock.args[parameter]} />
    {:else if type === 'string'}
      <input
        type="text"
        class="budibase_input"
        bind:value={workflowBlock.args[parameter]} />
    {/if}
  </div>
{/each}

<style>
  .block-field {
    display: grid;
  }
  .budibase_input {
    height: 36px;
    border-radius: 5px;
    background-color: var(--grey-2);
    border: 1px solid var(--grey-2);
    text-align: left;
    color: var(--ink);
    font-size: 14px;
    padding-left: 12px;
    margin-top: 8px;
  }

  label {
    text-transform: capitalize;
    font-size: 14px;
    font-weight: 500;
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
