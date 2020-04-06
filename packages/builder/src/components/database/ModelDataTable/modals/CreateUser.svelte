<script>
  import { store, backendUiStore } from "builderStore"
  import ActionButton from "components/common/ActionButton.svelte"
  import * as api from "../api"

  export let onClosed

  let username
  let password
  let accessLevels = []

  $: valid = username && password && accessLevels.length
  $: currentAppInfo = {
    appname: $store.appname,
    instanceId: $backendUiStore.selectedDatabase.id,
  }

  async function createUser() {
    const user = {
      name: username,
      accessLevels,
      enabled: true,
      temporaryAccessId: "",
    }
    const response = await api.createUser(password, user, currentAppInfo)
    backendUiStore.actions.users.save(user)
    onClosed()
  }
</script>

<form class="uk-form-stacked">
  <div>
    <label class="uk-form-label" for="form-stacked-text">Username</label>
    <input class="uk-input" type="text" bind:value={username} />
    <label class="uk-form-label" for="form-stacked-text">Password</label>
    <input class="uk-input" type="password" bind:value={password} />
    <label class="uk-form-label" for="form-stacked-text">Access Levels</label>
    <select multiple bind:value={accessLevels}>
      {#each $store.accessLevels.levels as level}
        <option value={level.name}>{level.name}</option>
      {/each}
    </select>
  </div>
  <footer>
    <ActionButton alert on:click={onClosed}>Cancel</ActionButton>
    <ActionButton disabled={!valid} on:click={createUser}>Save</ActionButton>
  </footer>
</form>

<style>
  div {
    padding: 30px;
  }
  footer {
    padding: 20px;
    background: #fafafa;
    border-radius: 0.5rem;
  }
  select {
    width: 100%;
  }
  option {
    padding: 10px;
  }
</style>
