<script>
  import { Input, Select, Button } from "@budibase/bbui"
  import UserRow from "../UserRow.svelte"

  import { store, backendUiStore } from "builderStore"
  import api from "builderStore/api"
  // import * as api from "../api"

  let username = ""
  let password = ""
  let accessLevelId

  $: valid = username && password && accessLevelId
  $: appId = $store.appId

  // Create user!
  async function createUser() {
    if (valid) {
      const user = { name: username, username, password, accessLevelId }
      const response = await api.post(`/api/users`, user)
      const json = await response.json()
      backendUiStore.actions.users.create(json)
      fetchUsersPromise = fetchUsers()
    }
  }

  // Update user!
  async function updateUser(event) {
    let data = event.detail
    delete data.password
    const response = await api.put(`/api/users`, data)
    const users = await response.json()
    backendUiStore.update(state => {
      state.users = users
      return state
    })
    fetchUsersPromise = fetchUsers()
  }

  // Get users
  async function fetchUsers() {
    const response = await api.get(`/api/users`)
    const users = await response.json()
    backendUiStore.update(state => {
      state.users = users
      return state
    })
    return users
  }

  let fetchUsersPromise = fetchUsers()
</script>

<div class="container">
  <div class="background">
    <div class="title">Create new user</div>
    <div class="inputs">
      <Input thin bind:value={username} name="Name" placeholder="Username" />
      <Input
        thin
        bind:value={password}
        name="Password"
        placeholder="Password" />
      <Select bind:value={accessLevelId} thin>
        <option value="">Choose an option</option>
        <option value="ADMIN">Admin</option>
        <option value="POWER_USER">Power User</option>
      </Select>
    </div>
    <div class="create-button">
      <Button on:click={createUser} small primary>Create</Button>
    </div>
  </div>
  <div class="background-users">
    <div class="title">Current Users</div>
    {#await fetchUsersPromise}
      Loading state!
    {:then users}
      <ul>
        {#each users as user}
          <li>
            <UserRow {user} on:save={updateUser} />
          </li>
        {:else}
          <li>No Users found</li>
        {/each}
      </ul>
    {:catch error}
      Something went wrong when trying to fetch users. Please refresh (CMD + R /
      CTRL + R) the page and try again.
    {/await}
  </div>
</div>

<style>
  .container {
    display: grid;
    grid-gap: 32px;
    margin-top: 32px;
  }
  .background {
    position: relative;
    display: grid;
    grid-gap: 12px;
    border-radius: 5px;
  }

  .background-users {
    position: relative;
    display: grid;
    grid-gap: 12px;
    border-radius: 5px;
  }

  .create-button {
    position: absolute;
    top: 0px;
    right: 0px;
  }
  .create-button :global(button) {
    font-size: var(--font-size-sm);
    min-width: 100px;
    border-radius: var(--rounded-small);
  }
  .title {
    font-size: 14px;
    font-weight: 500;
  }
  .inputs {
    display: grid;
    margin-top: 12px;
    grid-gap: 18px;
    grid-template-columns: 1fr 1fr 1fr;
  }
  .inputs :global(input) {
    padding: 10px 12px;
    border-radius: var(--rounded-small);
  }
  .inputs :global(select) {
    padding: 10px 12px;
    border-radius: var(--rounded-small);
    background-color: var(--grey-2);
  }
  ul {
    list-style: none;
    padding: 0;
    display: grid;
    grid-gap: 8px;
    margin-top: 0;
  }
</style>
