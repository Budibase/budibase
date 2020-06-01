<script>
  import { store, backendUiStore } from "builderStore"
  import ComponentsHierarchy from "components/userInterface/ComponentsHierarchy.svelte"
  import PageLayout from "components/userInterface/PageLayout.svelte"
  import PagesList from "components/userInterface/PagesList.svelte"
  import NewScreen from "components/userInterface/NewScreen.svelte"

  const newScreen = () => {
    newScreenPicker.show()
  }

  let newScreenPicker
</script>

<PagesList />

<button class="newscreen" on:click={newScreen}>Create New Screen</button>

<PageLayout layout={$store.pages[$store.currentPageName]} />

<div class="nav-items-container">
  <ComponentsHierarchy screens={$store.screens} />
</div>

<NewScreen bind:this={newScreenPicker} />

<style>
  .newscreen {
    cursor: pointer;
    border: 1px solid var(--grey-dark);
    border-radius: 3px;
    width: 100%;
    padding: 8px 16px;
    margin: 12px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    color: var(--ink);
    font-size: 14px;
    font-weight: 500;
    transition: all 2ms;
  }

  .newscreen:hover {
    background: var(--grey-light);
  }
</style>
