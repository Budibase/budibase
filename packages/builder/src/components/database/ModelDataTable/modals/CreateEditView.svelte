<script>
  import Textbox from "components/common/Textbox.svelte"
  import CodeArea from "components/common/CodeArea.svelte"
  import Button from "components/common/Button.svelte"
  import Dropdown from "components/common/Dropdown.svelte"
  import { store } from "builderStore"
  import { filter, some, map, compose } from "lodash/fp"
  import {
    hierarchy as hierarchyFunctions,
    common,
  } from "../../../../../../core/src/"
  import ErrorsBox from "components/common/ErrorsBox.svelte"
  import ActionButton from "components/common/ActionButton.svelte"

  const SNIPPET_EDITORS = {
    MAP: "Map",
    FILTER: "Filter",
    SHARD: "Shard Name",
  }

  let view
  let indexableModels = []
  let currentSnippetEditor = SNIPPET_EDITORS.MAP

  const indexableModelsFromIndex = compose(
    map(node => ({
      node,
      isallowed:
        view.allowedModelNodeIds &&
        view.allowedModelNodeIds.some(id => node.nodeId === id),
    })),
    filter(hierarchyFunctions.isModel),
    filter(hierarchyFunctions.isDecendant($store.currentNode.parent())),
    hierarchyFunctions.getFlattenedHierarchy
  )

  store.subscribe($store => {
    view = $store.currentNode
    indexableModels = indexableModelsFromIndex($store.hierarchy)
  })

  const toggleAllowedModel = model => {
    if (model.isallowed) {
      view.allowedModelNodeIds = view.allowedModelNodeIds.filter(
        id => id !== model.node.nodeId
      )
    } else {
      view.allowedModelNodeIds.push(model.node.nodeId)
    }
  }
</script>

<heading>
  <i class="ri-eye-line button--toggled" />
  <h3 class="budibase__title--3">Create / Edit View</h3>
</heading>
<form on:submit|preventDefault class="uk-form-stacked root">
  <h4 class="budibase__label--big">Settings</h4>
  {#if $store.errors && $store.errors.length > 0}
    <ErrorsBox errors={$store.errors} />
  {/if}
  <div class="uk-grid-small" uk-grid>
    <div class="uk-width-1-2@s">
      <Textbox bind:text={view.name} label="Name" />
    </div>
    <div class="uk-width-1-2@s">
      <Dropdown
        label="View Type"
        bind:selected={view.indexType}
        options={['ancestor', 'reference']} />
    </div>
  </div>

  <div class="allowed-records">
    <div class="budibase__label--big">
      Which models would you like to add to this view?
    </div>
    {#each indexableModels as model}
      <input
        class="uk-checkbox"
        type="checkbox"
        checked={model.isallowed}
        on:change={() => toggleAllowedModel(model)} />
      <span class="checkbox-model-label">{model.node.name}</span>
    {/each}
  </div>

  <h4 class="budibase__label--big">Snippets</h4>
  {#each Object.values(SNIPPET_EDITORS) as snippetType}
    <span
      class="snippet-selector__heading hoverable"
      class:highlighted={currentSnippetEditor === snippetType}
      on:click={() => (currentSnippetEditor = snippetType)}>
      {snippetType}
    </span>
  {/each}
  {#if currentSnippetEditor === SNIPPET_EDITORS.MAP}
    <CodeArea bind:text={view.map} label="Map" />
  {:else if currentSnippetEditor === SNIPPET_EDITORS.FILTER}
    <CodeArea bind:text={view.filter} label="Filter" />
  {:else if currentSnippetEditor === SNIPPET_EDITORS.SHARD}
    <CodeArea bind:text={view.getShardName} label="Shard Name" />
  {/if}

  <ActionButton color="secondary" on:click={store.saveCurrentNode}>
    Save
  </ActionButton>

  {#if !$store.currentNodeIsNew}
    <ActionButton alert on:click={store.deleteCurrentNode}>Delete</ActionButton>
  {/if}

</form>

<style>
  .root {
    height: 100%;
    padding: 15px;
  }

  .allowed-records {
    margin: 20px 0px;
  }

  .allowed-records > span {
    margin-right: 30px;
  }

  .snippet-selector__heading {
    margin-right: 20px;
    opacity: 0.7;
  }

  .highlighted {
    opacity: 1;
  }

  .checkbox-model-label {
    text-transform: capitalize;
  }

  h3 {
    margin: 0 0 0 10px;
  }

  heading {
    padding: 20px 20px 0 20px;
    display: flex;
    align-items: center;
  }
</style>
