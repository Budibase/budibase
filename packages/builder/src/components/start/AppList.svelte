<script>
  import AppCard from "./AppCard.svelte"
  import { Heading } from "@budibase/bbui"
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
  <Heading medium black>Your Apps</Heading>
  {#await promise}
    <div class="spinner-container">
      <Spinner size="30" />
    </div>
  {:then apps}
    <div class="inner">
      <div>
        <div>
          <div class="apps">
            {#each apps as app}
              <AppCard {...app} />
            {/each}
          </div>
        </div>
      </div>
    </div>
  {:catch err}
    <h1 style="color:red">{err}</h1>
  {/await}
</div>

<style>
  .apps {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-gap: var(--layout-m);
    justify-content: start;
  }

  .root {
    margin: 20px 80px;
  }
</style>
