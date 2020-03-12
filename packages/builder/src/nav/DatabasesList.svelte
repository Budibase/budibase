<script>
  import { navigate } from "svelte-routing"
  import { store } from "../builderStore"
  import getIcon from "../common/icon"
  import { CheckIcon } from "../common/Icons"

  $: instances = $store.appInstances

  function selectDatabase(databaseId) {
    store.update(state => {
      state.currentlySelectedDatabase = databaseId
      return state
    })
    navigate("/database", { replace: true })
  }
</script>

<div class="root">
  <ul>
    {#each $store.appInstances as { id, name }}
      <li>
        <span class="icon">
          {#if id === $store.currentlySelectedDatabase}
            <CheckIcon />
          {/if}
        </span>

        <button
          class:active={id === $store.currentlySelectedDatabase}
          on:click={() => selectDatabase(id)}>
          {name}
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
