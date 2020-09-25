<script>
  import { store, backendUiStore } from "builderStore"
  import ComponentsHierarchy from "components/userInterface/ComponentsHierarchy.svelte"
  import PageLayout from "components/userInterface/PageLayout.svelte"
  import PagesList from "components/userInterface/PagesList.svelte"
  import NewScreen from "components/userInterface/NewScreen.svelte"
  import { Button } from "@budibase/bbui"
  import { Spacer } from "@budibase/bbui"

  const newScreen = () => {
    newScreenPicker.show()
  }

  let newScreenPicker
</script>

<PagesList />

<Spacer medium />
<Button primary wide on:click={newScreen}>Create New Screen</Button>
<Spacer medium />
<PageLayout layout={$store.pages[$store.currentPageName]} />

<div class="nav-items-container">
  <ComponentsHierarchy screens={$store.screens} />
</div>

<NewScreen bind:this={newScreenPicker} />

<style>
  .newscreen {
    cursor: pointer;
    border: 1px solid var(--purple);
    border-radius: 5px;
    width: 100%;
    height: 36px;
    padding: 8px 16px;
    margin: 20px 0px 12px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--purple);
    color: var(--white);
    font-size: 14px;
    font-weight: 500;
    transition: all 3ms;
    outline: none;
  }

  .newscreen:hover {
    background: var(--purple-light);
    color: var(--purple);
  }

  .icon {
    color: var(--ink);
    font-size: 16px;
    margin-right: 4px;
  }
</style>
