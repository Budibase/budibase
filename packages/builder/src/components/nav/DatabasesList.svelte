<script>
  import { tick, onMount } from "svelte"
  import { goto } from "@sveltech/routify"
  import { store, backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import { CheckIcon } from "../common/Icons"

  $: instances = $store.appInstances

  async function selectDatabase(database) {
    backendUiStore.actions.database.select(database)
  }

  async function deleteDatabase(database) {
    const DELETE_DATABASE_URL = `/api/instances/${database.name}`
    const response = await api.delete(DELETE_DATABASE_URL)
    store.update(state => {
      state.appInstances = state.appInstances.filter(
        db => db._id !== database._id
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
          {#if database._id === $backendUiStore.selectedDatabase._id}
            <CheckIcon />
          {/if}
        </span>
        <button
          class:active={database._id === $backendUiStore.selectedDatabase._id}
          on:click={() => {
            $goto(`./database/${database._id}`), selectDatabase(database)
          }}>
          {database.name}
        </button>
        <i
          class="ri-delete-bin-7-line hoverable alignment"
          on:click={() => deleteDatabase(database)} />
      </li>
    {/each}
  </ul>
</div>

<style>
  .root {
    font-size: 13px;
    color: var(--secondary100);
    position: relative;
    padding-left: 20px;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .alignment {
    margin-left: auto;
    padding-right: 20px;
  }

  li {
    margin: 0px 0px 10px 0px;
    display: flex;
    align-items: center;
  }

  button {
    margin: 0 0 0 6px;
    padding: 0;
    border: none;
    font-family: Roboto;
    font-size: 13px;
    outline: none;
    cursor: pointer;
    background: rgba(0, 0, 0, 0);
    text-rendering: optimizeLegibility;
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
