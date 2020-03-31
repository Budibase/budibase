<script>
  import { tick } from "svelte"
  import { store, backendUiStore } from "../builderStore"
  import api from "../builderStore/api"
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

  async function deleteDatabase(database) {
    const DELETE_DATABASE_URL = `/_builder/instance/_master/0/api/record/applications/${$store.appId}/instances/${database.id}`
    const response = await api.delete(DELETE_DATABASE_URL)
    store.update(state => {
      state.appInstances = state.appInstances.filter(
        db => db.id !== database.id
      )
      return state
    })
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
        <i
          class="ri-close-line hoverable uk-margin-small-left"
          on:click={() => deleteDatabase(database)} />
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
    display: flex;
    align-items: center;
  }

  button {
    margin: 0 0 0 6px;
    padding: 0;
    border: none;
    font-family: Roboto;
    font-size: 0.8rem;
    outline: none;
    cursor: pointer;
    background: rgba(0, 0, 0, 0);
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
