<script>
  import Modal from "../../../common/Modal.svelte"
  import { store, backendUiStore } from "../../../builderStore"
  import ActionButton from "../../../common/ActionButton.svelte"
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
    const response = await api.createUser(
      {
        username,
        password,
        accessLevels,
        enabled: true,
      },
      currentAppInfo
    )
    onClosed()
  }
</script>

<form class="uk-form-stacked">
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
  <footer>
    <ActionButton alert on:click={onClosed}>Cancel</ActionButton>
    <ActionButton disabled={!valid} on:click={createUser}>Save</ActionButton>
  </footer>
</form>

<style>
  footer {
    position: absolute;
    padding: 20px;
    width: 100%;
    bottom: 0;
    left: 0;
    background: #fafafa;
  }
</style>
