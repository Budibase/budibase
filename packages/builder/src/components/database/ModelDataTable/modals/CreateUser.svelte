<script>
  import { store, backendUiStore } from "builderStore"
  import ActionButton from "components/common/ActionButton.svelte"
  import * as api from "../api"

  export let onClosed

  let username
  let password
  let accessLevelId

  $: valid = username && password && accessLevelId
  $: instanceId = $backendUiStore.selectedDatabase._id
  $: appId = $store.appId

  async function createUser() {
    const user = { name: username, username, password, accessLevelId }
    const response = await api.createUser(user, instanceId)
    backendUiStore.actions.users.create(response)
    onClosed()
  }
</script>

<form on:submit|preventDefault class="uk-form-stacked">
  <div>
    <div class="uk-margin">
      <label class="uk-form-label" for="form-stacked-text">Username</label>
      <input class="uk-input" type="text" bind:value={username} />
    </div>
    <div class="uk-margin">
      <label class="uk-form-label" for="form-stacked-text">Password</label>
      <input class="uk-input" type="password" bind:value={password} />
    </div>
    <div class="uk-margin">
      <label class="uk-form-label" for="form-stacked-text">Access Level</label>
      <select class="uk-select" bind:value={accessLevelId}>
        <option value=""></option>
        <option value="POWER_USER">Power User</option>
        <option value="ADMIN">Admin</option>
      </select>
    </div>
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
</style>
