<script>
  import Textbox from "components/common/Textbox.svelte"
  import CodeArea from "components/common/CodeArea.svelte"
  import Button from "components/common/Button.svelte"
  import Dropdown from "components/common/Dropdown.svelte"
  import { store, backendUiStore } from "builderStore"
  import { filter, some, map, compose } from "lodash/fp"
  import ErrorsBox from "components/common/ErrorsBox.svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import api from "builderStore/api"

  const SNIPPET_EDITORS = {
    MAP: "Map",
    FILTER: "Filter",
    REDUCE: "Reduce",
  }

  const COUCHDB_FUNCTION = `function(doc) {

  }`

  export let onClosed
  export let view = {}

  let currentSnippetEditor = SNIPPET_EDITORS.MAP

  $: instanceId = $backendUiStore.selectedDatabase.id

  function deleteView() {}

  async function saveView() {
    const SAVE_VIEW_URL = `/api/${instanceId}/views`
    const response = await api.post(SAVE_VIEW_URL, view)
    backendUiStore.update(state => {
      state.views = [...state.views, response.view]
      return state
    })
    onClosed()
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
  {:else if currentSnippetEditor === SNIPPET_EDITORS.REDUCE}
    <CodeArea bind:text={view.reduce} label="Reduce" />
  {/if}

  <ActionButton color="secondary" on:click={saveView}>Save</ActionButton>
  <ActionButton alert on:click={deleteView}>Delete</ActionButton>
</form>

<style>
  .root {
    height: 100%;
    padding: 15px;
  }

  .snippet-selector__heading {
    margin-right: 20px;
    opacity: 0.7;
  }

  .highlighted {
    opacity: 1;
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
