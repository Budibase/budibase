<script>
  import Textbox from "../common/Textbox.svelte"
  import CodeArea from "../common/CodeArea.svelte"
  import Button from "../common/Button.svelte"
  import Dropdown from "../common/Dropdown.svelte"
  import { store } from "../builderStore"
  import { filter, some, map, compose } from "lodash/fp"
  import { hierarchy as hierarchyFunctions, common } from "../../../core/src"
  import ErrorsBox from "../common/ErrorsBox.svelte"
  
  const SNIPPET_EDITORS = {
    MAP: "Map",
    FILTER: "Filter",
    SHARD: "Shard Name",
  }

  let index
  let indexableRecords = []
  let currentSnippetEditor = SNIPPET_EDITORS.MAP

  const indexableRecordsFromIndex = compose(
    map(node => ({
      node,
      isallowed: index.allowedRecordNodeIds.some(id => node.nodeId === id),
    })),
    filter(hierarchyFunctions.isRecord),
    filter(hierarchyFunctions.isDecendant($store.currentNode.parent())),
    hierarchyFunctions.getFlattenedHierarchy
  )

  store.subscribe($store => {
    index = $store.currentNode
    indexableRecords = indexableRecordsFromIndex($store.hierarchy)
  })

  const toggleAllowedRecord = record => {
    if (record.isallowed) {
      index.allowedRecordNodeIds = index.allowedRecordNodeIds.filter(
        id => id !== record.node.nodeId
      )
    } else {
      index.allowedRecordNodeIds.push(record.node.nodeId)
    }
  }
</script>

<heading>
  <i class="ri-eye-line button--toggled" />
  <h3 class="budibase__title--3">Create / Edit View</h3>
</heading>
<form class="uk-form-stacked root">
  <h4 class="budibase__label--big">Settings</h4>
  {#if $store.errors && $store.errors.length > 0}
    <ErrorsBox errors={$store.errors} />
  {/if}
  <div class="uk-grid-small" uk-grid>
    <div class="uk-width-1-2@s">
      <Textbox bind:text={index.name} label="Name" />
    </div>
    <div class="uk-width-1-2@s">
      <Dropdown
        label="View Type"
        bind:selected={index.indexType}
        options={['ancestor', 'reference']} />
    </div>
  </div>

  <div class="allowed-records">
    <div class="budibase__label--big">
      Which models would you like to add to this view?
    </div>
    {#each indexableRecords as rec}
      <input
        class="uk-checkbox"
        type="checkbox"
        checked={rec.isallowed}
        on:change={() => toggleAllowedRecord(rec)} />
      <span class="checkbox-model-label">{rec.node.name}</span>
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
    <CodeArea bind:text={index.map} label="Map" />
  {:else if currentSnippetEditor === SNIPPET_EDITORS.FILTER}
    <CodeArea bind:text={index.filter} label="Filter" />
  {:else if currentSnippetEditor === SNIPPET_EDITORS.SHARD}
    <CodeArea bind:text={index.getShardName} label="Shard Name" />
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
    display: flex;
    align-items: center;
  }
</style>
