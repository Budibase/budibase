<script>
  import { onMount } from "svelte"

  export let _bb
  export let _viewName
  export let _instanceId

  let username
  let password
</script>

<form class="uk-form">
  <div>
    <div class="uk-margin">
      <label class="uk-form-label" for="form-stacked-text">Username</label>
      <input class="uk-input" type="text" bind:value={username} />
    </div>
    <div class="uk-margin">
      <label class="uk-form-label" for="form-stacked-text">Password</label>
      <input class="uk-input" type="password" bind:value={password} />
    </div>
  </div>
</form>

<style>

</style>
