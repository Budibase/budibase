<script>
  import { store } from "builderStore/"
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
        Add
      </button>

      <button
        class:selected={selected === PROPERTIES_TAB}
        on:click={() => selectTab(PROPERTIES_TAB)}>
        Edit
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
  {/if}

</div>

<style>
  .root {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    border-left: solid 1px #e8e8ef;
  }

  .switcher {
    display: flex;
    justify-content: space-between;
    margin: 20px;
  }

  .switcher > button {
    text-rendering: optimizeLegibility;
    display: inline-block;
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    font-size: 14px;
    text-transform: uppercase;
    background: rgba(0, 0, 0, 0);
    font-weight: 500;
    color: var(--secondary40);
    margin-right: 20px;
    letter-spacing: 1px;
  }

  .switcher > .selected {
    color: var(--secondary100);
    font-weight: 600;
  }
</style>
