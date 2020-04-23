<script>
  import { store, backendUiStore } from "builderStore"
  import ActionButton from "components/common/ActionButton.svelte"
  import * as api from "../api"

  export let onClosed

  let username
  let password

  $: valid = username && password
  $: instanceId = $backendUiStore.selectedDatabase.id

  async function createUser() {
    const user = { name: username, username, password }
    const response = await api.createUser(user, instanceId);
    console.log(response);
    backendUiStore.actions.users.create(response)
    onClosed()
  }
</script>

<form on:submit|preventDefault class="uk-form-stacked">
  <div>
    <label class="uk-form-label" for="form-stacked-text">Username</label>
    <input class="uk-input" type="text" bind:value={username} />
    <label class="uk-form-label" for="form-stacked-text">Password</label>
    <input class="uk-input" type="password" bind:value={password} />
    <label class="uk-form-label" for="form-stacked-text">Access Levels</label>
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
