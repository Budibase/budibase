<script>
  import IconButton from "components/common/IconButton.svelte"
  import { store } from "builderStore"
  import UserInterfaceRoot from "components/userInterface/UserInterfaceRoot.svelte"
  import { fade } from "svelte/transition"
</script>

<div class="root">
  <div class="content uk-container">

    <h1>Settings</h1>

    <label>
      <input
        type="checkbox"
        class="uk-checkbox"
        bind:checked={$store.useAnalytics} />
      Send analytics
    </label>

  </div>
</div>

<style>

</style>
