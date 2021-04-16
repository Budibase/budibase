<script>
  import AppCard from "./AppCard.svelte"
  import { Heading, Divider } from "@budibase/bbui"
  import Spinner from "components/common/Spinner.svelte"
  import { get } from "builderStore/api"

  let promise = getApps()

  async function getApps() {
    const res = await get("/api/applications")
    const json = await res.json()

    if (res.ok) {
      return json
    } else {
      throw new Error(json)
    }
  }
</script>

<div class="root">
  <Heading m h2>Your Apps</Heading>
  <Divider s />
  {#await promise}
    <div class="spinner-container">
      <Spinner size="30" />
    </div>
  {:then apps}
    <div class="apps">
      {#each apps as app}
        <AppCard {...app} />
      {/each}
    </div>
  {:catch err}
    <h1 style="color:red">{err}</h1>
  {/await}
</div>

<style>
  .apps {
    margin-top: var(--spectrum-global-dimension-static-size-150);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-gap: var(--layout-m);
    justify-content: start;
  }
</style>
