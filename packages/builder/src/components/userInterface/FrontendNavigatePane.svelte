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

<button 
  class="newscreen"
  on:click={newScreen}>
  Create New Screen
</button>

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

.components-nav-header {
  font-size: 13px;
  color: var(--ink);
  margin-top: 20px;
  font-weight: 600;
  opacity: 0.4;
  letter-spacing: 1px;
}


.nav-group-header {
  display: flex;
  font-size: 0.9rem;
  font-weight: bold;
  justify-content: space-between;
  align-items: center;
}

.nav-group-header > span:nth-child(3) {
  margin-left: 5px;
  vertical-align: bottom;
  grid-column-start: title;
  margin-top: auto;
}

.border-line {
  border-bottom: 1px solid #d8d8d8;
}

.components-list-container {
  padding: 20px 0px 0 0;
}

</style>