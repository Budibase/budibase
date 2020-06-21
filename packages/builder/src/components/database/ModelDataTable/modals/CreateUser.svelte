<script>
  import { store, backendUiStore } from "builderStore"
  import ActionButton from "components/common/ActionButton.svelte"
  import * as api from "../api"

  export let onClosed

  let username
  let password
  let accessLevelId

  $: valid = username && password && accessLevelId
  $: appId = $store.appId

  async function createUser() {
    const user = { name: username, username, password, accessLevelId }
    const response = await api.createUser(user)
    backendUiStore.actions.users.create(response)
    onClosed()
  }
</script>

<form on:submit|preventDefault class="uk-form-stacked">
  <div class="main">
    <div class="heading">
      <i class="ri-list-settings-line button--toggled" />
      <div class="title">Create User</div>
    </div>
    <div class="uk-margin">
      <label class="uk-form-label" for="form-stacked-text">Username</label>
      <input
        data-cy="username"
        class="uk-input"
        type="text"
        bind:value={username} />
    </div>
    <div class="uk-margin">
      <label class="uk-form-label" for="form-stacked-text">Password</label>
      <input
        data-cy="password"
        class="uk-input"
        type="password"
        bind:value={password} />
    </div>
    <div class="uk-margin">
      <label class="uk-form-label" for="form-stacked-text">Access Level</label>
      <select
        data-cy="accessLevel"
        class="uk-select"
        bind:value={accessLevelId}>
        <option value="" />
        <option value="POWER_USER">Power User</option>
        <option value="ADMIN">Admin</option>
      </select>
    </div>
  </div>
  <footer>
    <div class="button">
      <ActionButton secondary on:click={onClosed}>Cancel</ActionButton>
    </div>
    <ActionButton disabled={!valid} on:click={createUser}>Save</ActionButton>
  </footer>
</form>

<style>
  .main {
    padding: 40px 40px 20px 40px;
  }

  .title {
    font-size: 24px;
    font-weight: 700;
    color: var(--ink);
    margin-left: 12px;
  }

  .heading {
    display: flex;
    align-items: baseline;
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 20px;
    background: var(--grey-light);
    border-radius: 0 0 5px 5px;
  }

  .button {
    margin-right: 20px;
  }
</style>
