<script>
  import AppList from "components/start/AppList.svelte"
  import { onMount } from "svelte"
  import IconButton from "components/common/IconButton.svelte"
  import Spinner from "components/common/Spinner.svelte"

  let promise = getApps()

  async function getApps() {
    const res = await fetch(`/api/budibase/applications`)
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

  <!--
    <div class="settings">
      <IconButton icon="settings"
                  on:click={store.showSettings}/>
    </div>


    {#if $store.useAnalytics}
      <iframe src="https://marblekirby.github.io/bb-analytics.html" width="0" height="0" style="visibility:hidden;display:none"/>
    {/if}
  -->
</main>

<style>
  main {
    height: 100%;
    width: 100%;
    font-family: "Roboto", Helvetica, Arial, sans-serif;
  }

  .settings {
    position: absolute;
    bottom: 25px;
    right: 25px;
  }

  .spinner-container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
