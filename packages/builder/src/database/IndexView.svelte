<script>
  import Textbox from "../common/Textbox.svelte"
  import CodeArea from "../common/CodeArea.svelte"
  import Button from "../common/Button.svelte"
  import Dropdown from "../common/Dropdown.svelte"
  import { store } from "../builderStore"
  import { filter, some, map } from "lodash/fp"
  import { hierarchy as hierarchyFunctions, common } from "../../../core/src"

  const pipe = common.$

  const SNIPPET_EDITORS = {
    MAP: "Map",
    FILTER: "Filter",
    SHARD: "Shard Name",
  }

  let index
  let indexableRecords = []
  let currentSnippetEditor = SNIPPET_EDITORS.MAP

  store.subscribe($store => {
    index = $store.currentNode
    indexableRecords = pipe(
      $store.hierarchy,
      [
        hierarchyFunctions.getFlattenedHierarchy,
        filter(hierarchyFunctions.isDecendant(index.parent())),
        filter(hierarchyFunctions.isRecord),
        map(n => ({
          node: n,
          isallowed: some(id => n.nodeId === id)(index.allowedRecordNodeIds),
        })),
      ]
    )
  })

  const toggleAllowedRecord = record => {
    if (record.isallowed) {
      index.allowedRecordNodeIds = filter(id => id !== record.node.nodeId)(
        index.allowedRecordNodeIds
      )
    } else {
      index.allowedRecordNodeIds.push(record.node.nodeId)
    }
  }
</script>

<h3 class="budibase__title--3">
  <i class="ri-eye-line" />
  Create / Edit View
</h3>
<form class="uk-form-stacked root">
  <h4 class="budibase__label--big">Settings</h4>
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
        type="checkbox"
        checked={rec.isallowed}
        on:change={() => toggleAllowedRecord(rec)} />
      <span>{rec.node.name}</span>
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

  .index-label {
    color: #333;
    font-size: 0.875rem;
  }

  .snippet-selector__heading {
    margin-right: 20px;
    opacity: 0.7;
  }

  .highlighted {
    opacity: 1;
  }
</style>
