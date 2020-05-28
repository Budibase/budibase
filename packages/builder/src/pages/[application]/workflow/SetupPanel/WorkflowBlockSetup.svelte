<script>
  import { backendUiStore, store } from "builderStore"

  export let workflowBlock

  let params

  $: workflowParams = workflowBlock.params
    ? Object.entries(workflowBlock.params)
    : []
  $: components = Object.values($store.components).filter(comp => comp.name)
  // $: workflowArgs = workflowBlock.args ? Object.keys(workflowBlock.args) : []
</script>

<label class="uk-form-label">
  {workflowBlock.type}: {workflowBlock.heading}
</label>
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
      {:else if type === 'number'}
        <input
          type="number"
          class="budibase__input"
          bind:value={workflowBlock.args[parameter]} />
      {:else if type === 'model'}
        <select
          class="budibase__input"
          bind:value={workflowBlock.args[parameter]}>
          {#each $backendUiStore.models as model}
            <option value={model._id}>{model.name}</option>
          {/each}
        </select>
      {:else if type === 'component'}
        <select class="budibase__input">
          {#each components as component}
            <option value={component.id}>{component.name}</option>
          {/each}
        </select>
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
</style>
