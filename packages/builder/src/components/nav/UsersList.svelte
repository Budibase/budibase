<script>
  import { onMount } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import getIcon from "../common/icon"
  import { CheckIcon } from "../common/Icons"

  const getPage = (s, name) => {
    const props = s.pages[name]
    return { name, props }
  }

  $: currentAppInfo = {
    appname: $store.appname,
    instanceId: $backendUiStore.selectedDatabase._id,
  }

  async function fetchUsers() {
    const FETCH_USERS_URL = `/api/users`
    const response = await api(currentAppInfo.instanceId).get(FETCH_USERS_URL)
    const users = await response.json()
    backendUiStore.update(state => {
      state.users = users
      return state
    })
  }

  onMount(fetchUsers)
</script>

<div class="root">
  <ul>
    {#each $backendUiStore.users as user}
      <li>
        <i class="ri-user-4-line" />
        <button class:active={user.username === $store.currentUserName}>
          {user.name}
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
    font-size: 13px;
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
