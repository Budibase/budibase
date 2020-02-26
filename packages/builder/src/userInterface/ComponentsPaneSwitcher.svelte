<script>
  import { store } from "../builderStore/"
  import ComponentPropertiesPanel from "./ComponentPropertiesPanel.svelte"
  import ComponentSelectionList from "./ComponentSelectionList.svelte"

  const PROPERTIES_TAB = "properties"
  const COMPONENT_SELECTION_TAB = "components"

  let selected = PROPERTIES_TAB

  const isSelected = tab => selected === tab

  const selectTab = tab => (selected = tab)

  const toggleTab = () =>
    (selected =
      selected === PROPERTIES_TAB ? COMPONENT_SELECTION_TAB : PROPERTIES_TAB)
</script>

<div class="root">
  {#if $store.currentFrontEndType === 'page' || $store.screens.length}
    <div class="switcher">

      <button
        class:selected={selected === COMPONENT_SELECTION_TAB}
        on:click={() => selectTab(COMPONENT_SELECTION_TAB)}>
        Components
      </button>

      <button
        class:selected={selected === PROPERTIES_TAB}
        on:click={() => selectTab(PROPERTIES_TAB)}>
        Properties
      </button>

    </div>

    <div class="panel">
      {#if selected === PROPERTIES_TAB}
        <ComponentPropertiesPanel {toggleTab} />
      {/if}

      {#if selected === COMPONENT_SELECTION_TAB}
        <ComponentSelectionList {toggleTab} />
      {/if}

    </div>
  {:else}
    <p>Please create a new screen</p>
  {/if}

</div>

<style>
  .root {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 2rem 0;
  }

  .switcher {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
    padding: 0 1.5rem;
  }

  .switcher > button {
    display: inline-block;
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    color: #999;
    background-color: rgba(0, 0, 0, 0);
  }

  .switcher > .selected {
    color: #333;
  }

  .panel {
    flex: 1 1 auto;
    height: 0px;
    overflow-y: auto;
    padding: 0 1.5rem 1.5rem 1.5rem;
  }
</style>
