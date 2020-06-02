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

<label class="uk-form-label">{workflowBlock.type}: {workflowBlock.name}</label>
{#each workflowParams as [parameter, type]}
  <div class="uk-margin block-field">
    <label class="uk-form-label">{parameter}</label>
    <div class="uk-form-controls">
      {#if Array.isArray(type)}
        <select
          class="budibase__input"
          bind:value={workflowBlock.args[parameter]}>
          {#each type as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      {:else if type === 'component'}
        <ComponentSelector bind:value={workflowBlock.args[parameter]} />
      {:else if type === 'accessLevel'}
        <select
          class="budibase__input"
          bind:value={workflowBlock.args[parameter]}>
          <option value="ADMIN">Admin</option>
          <option value="POWER_USER">Power User</option>
        </select>
      {:else if type === 'password'}
        <input
          type="password"
          class="budibase__input"
          bind:value={workflowBlock.args[parameter]} />
      {:else if type === 'number'}
        <input
          type="number"
          class="budibase__input"
          bind:value={workflowBlock.args[parameter]} />
      {:else if type === 'longText'}
        <textarea
          type="text"
          class="budibase__input"
          bind:value={workflowBlock.args[parameter]} />
      {:else if type === 'model'}
        <ModelSelector bind:value={workflowBlock.args[parameter]} />
      {:else if type === 'record'}
        <RecordSelector bind:value={workflowBlock.args[parameter]} />
      {:else if type === 'string'}
        <input
          type="text"
          class="budibase__input"
          bind:value={workflowBlock.args[parameter]} />
      {/if}
    </div>
  </div>
{/each}

<style>
  .block-field {
    border-radius: 3px;
    background: var(--light-grey);
    padding: 20px;
  }

  label {
    text-transform: capitalize;
    font-size: 14px;
    font-weight: 500;
  }

  textarea {
    min-height: 150px;
    font-family: inherit;
    padding: 5px;
  }
</style>
