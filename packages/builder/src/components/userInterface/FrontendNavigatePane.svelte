<script>
  import { store, backendUiStore } from "builderStore"
  import ComponentsHierarchy from "components/userInterface/ComponentsHierarchy.svelte"
  import PageLayout from "components/userInterface/PageLayout.svelte"
  import PagesList from "components/userInterface/PagesList.svelte"
  import { AddIcon } from "components/common/Icons"
  import NewScreen from "components/userInterface/NewScreen.svelte"
  
  const newScreen = () => {
    newScreenPicker.show()
  }

  let newScreenPicker
</script>

<div class="pages-list-container">
  <div class="nav-header">
    <span class="navigator-title">Navigate</span>
    <span class="components-nav-page">Pages</span>
  </div>

  <div class="nav-items-container">
    <PagesList />
  </div>
</div>

<div class="border-line" />

<PageLayout layout={$store.pages[$store.currentPageName]} />

<div class="border-line" />

<div class="components-list-container">
  <div class="nav-group-header">
    <span class="components-nav-header" style="margin-top: 0;">
      Screens
    </span>
    <div>
      <button on:click={newScreen}>
        <AddIcon />
      </button>
    </div>
  </div>
  <div class="nav-items-container">
    <ComponentsHierarchy screens={$store.screens} />
  </div>
</div>

<NewScreen bind:this={newScreenPicker} />

<style>

button {
  cursor: pointer;
  outline: none;
  border: none;
  border-radius: 5px;
  width: 20px;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.components-nav-page {
  font-size: 13px;
  color: var(--ink);
  padding-left: 20px;
  margin-top: 20px;
  font-weight: 600;
  opacity: 0.4;
  letter-spacing: 1px;
}

.components-nav-header {
  font-size: 13px;
  color: var(--ink);
  margin-top: 20px;
  font-weight: 600;
  opacity: 0.4;
  letter-spacing: 1px;
}

.nav-header {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.nav-items-container {
  padding: 1rem 0rem 0rem 0rem;
}

.nav-group-header {
  display: flex;
  padding: 0px 20px 0px 20px;
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

  .navigator-title {
  font-size: 18px;
  color: var(--ink);
  font-weight: bold;
  padding: 0 20px 20px 20px;
}

.border-line {
  border-bottom: 1px solid #d8d8d8;
}

.components-list-container {
  padding: 20px 0px 0 0;
}

</style>