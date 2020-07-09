<script>
  import { getContext } from "svelte"
  import { store, tourStore } from "builderStore"
  import AppList from "components/start/AppList.svelte"
  import { onMount } from "svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import IconButton from "components/common/IconButton.svelte"
  import { get } from "builderStore/api"
  import Spinner from "components/common/Spinner.svelte"
  import CreateAppModal from "components/start/CreateAppModal.svelte"
  import { Button } from "@budibase/bbui"

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

  // Handle create app modal
  const { open } = getContext("simple-modal")

  const showCreateAppModal = () => {
    open(
      CreateAppModal,
      {
        message: "What is your name?",
        hasForm: true,
      },
      {
        closeButton: false,
        closeOnEsc: false,
        closeOnOuterClick: false,
        styleContent: { padding: 0 },
        closeOnOuterClick: true,
      }
    )
  }

  if ($tourStore.tour) {
    $tourStore.tour.cancel()
  }
</script>

<div class="header">
  <div class="welcome">Welcome to the Budibase Beta</div>
  <Button purple large on:click={showCreateAppModal}>Create New Web App</Button>
</div>

<div class="banner">
  <img src="/_builder/assets/orange-landscape.png" alt="rocket" />
  <div class="banner-content">
    Every accomplishment starts with a decision to try.
  </div>
</div>

{#await promise}
  <div class="spinner-container">
    <Spinner />
  </div>
{:then result}
  <AppList apps={result} />
{:catch err}
  <h1 style="color:red">{err}</h1>
{/await}

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 40px 80px 0px 80px;
  }

  .welcome {
    font-size: 42px;
    color: var(--ink);
    font-weight: 700;
  }

  .banner {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    text-align: center;
    color: white;
    margin: 20px 80px 40px 80px;
    border-radius: 10px;
  }

  .banner img {
    height: 250px;
    width: 100%;
    border-radius: 5px;
  }

  .banner-content {
    position: absolute;
    font-size: 24px;
    color: var(--white);
    font-weight: 500;
  }

  .spinner-container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
