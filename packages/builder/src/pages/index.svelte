<script>
  import { store } from "builderStore";
  import AppList from "components/start/AppList.svelte"
  import { onMount } from "svelte"
  import IconButton from "components/common/IconButton.svelte"
  import Spinner from "components/common/Spinner.svelte"

  let promise = getApps()

  async function getApps() {
    const res = await fetch(`/api/${$store.clientId}/applications`)
    const json = await res.json()

    if (res.ok) {
      return json
    } else {
      throw new Error(json)
    }
  }
</script>

<main>
  {#await promise}
    <div class="spinner-container">
      <Spinner />
    </div>
  {:then result}
    <AppList apps={result} />
  {:catch err}
    <h1 style="color:red">{err}</h1>
  {/await}
</main>

<style>
  main {
    height: 100%;
    width: 100%;
    font-family: "Roboto", Helvetica, Arial, sans-serif;
  }

  .spinner-container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
