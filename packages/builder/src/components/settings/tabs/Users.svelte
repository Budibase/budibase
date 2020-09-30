<script>
  import { Input, Select, Button, Label } from "@budibase/bbui"
  import UserRow from "../UserRow.svelte"

  import { store, backendUiStore } from "builderStore"
  import api from "builderStore/api"
  // import * as api from "../api"

  let username = ""
  let password = ""
  let accessLevelId = "ADMIN"

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
  <div>
    <Label extraSmall grey>Create New User</Label>
    <div class="inputs">
      <Input thin bind:value={username} name="Name" placeholder="Username" />
      <Input
        thin
        bind:value={password}
        name="Password"
        placeholder="Password" />
      <Select secondary bind:value={accessLevelId} thin>
        <option value="ADMIN">Admin</option>
        <option value="POWER_USER">Power User</option>
      </Select>
      <Button on:click={createUser} primary>Create</Button>
    </div>
  </div>
  <div>
    <Label extraSmall grey>Current Users</Label>
    {#await fetchUsersPromise}
      Loading...
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
    grid-gap: var(--spacing-xl);
  }

  .inputs {
    display: grid;
    justify-items: stretch;
    grid-gap: var(--spacing-m);
    grid-template-columns: 1fr 1fr 1fr 140px;
  }

  ul {
    list-style: none;
    padding: 0;
    display: grid;
    grid-gap: var(--spacing-m);
    margin: 0;
  }
</style>
