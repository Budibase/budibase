<script>
  import { tick } from "svelte";
  import { store, backendUiStore } from "../builderStore"
  import getIcon from "../common/icon"
  import { CheckIcon } from "../common/Icons"

  $: instances = $store.appInstances
  $: views = $store.hierarchy.indexes

  async function selectDatabase(database) {
    backendUiStore.actions.navigate("DATABASE")
    backendUiStore.actions.records.select(null)
    backendUiStore.actions.views.select(views[0])
    backendUiStore.actions.database.select(database)
  }
</script>

<div class="root">
  <ul>
    {#each $store.appInstances as database}
      <li>
        <span class="icon">
          {#if database.id === $backendUiStore.selectedDatabase.id}
            <CheckIcon />
          {/if}
        </span>

        <button
          class:active={database.id === $backendUiStore.selectedDatabase.id}
          on:click={() => selectDatabase(database)}>
          {database.name}
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  .root {
    padding-bottom: 10px;
    font-size: 0.9rem;
    color: var(--secondary50);
    font-weight: bold;
    position: relative;
    padding-left: 1.8rem;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    margin: 0.5rem 0;
  }

  button {
    margin: 0 0 0 6px;
    padding: 0;
    border: none;
    font-family: Roboto;
    font-size: 0.8rem;
    outline: none;
    cursor: pointer;
    background: rgba(0,0,0,0);
  }

  .active {
    font-weight: 500;
  }

  .icon {
    display: inline-block;
    width: 14px;
    color: #333;
  }
</style>
