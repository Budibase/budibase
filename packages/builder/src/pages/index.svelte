<script>
  import { getContext } from "svelte"
  import { store } from "builderStore"
  import AppList from "components/start/AppList.svelte"
  import { onMount } from "svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import IconButton from "components/common/IconButton.svelte"
  import { get } from "builderStore/api"
  import Spinner from "components/common/Spinner.svelte"
  import CreateAppModal from "components/start/CreateAppModal.svelte"

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
</script>

<div class="welcome">Welcome to Budibase</div>

<div class="banner">
  <img src="/_builder/assets/rocket.jpg" alt="rocket">
   <div class="banner-content">
      Every accomplishment starts with a decision to try.
    </div>
</div>
<div class="app-section-header">
  <div class="app-section-title">Your Web Apps</div>
  <button class="banner-button" type="button" on:click={showCreateAppModal}>
    <i class="ri-add-circle-fill" />
    Create New Web App
  </button>
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

  .welcome {
    font-size: 42px;
    color: var(--ink);
    font-weight: 900;
    margin: 40px 0px 0px 80px;
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

  .banner-button {
    background-color: var(--ink);
    color: var(--white);
    padding: 12px 24px;
    border-radius: 5px;
    border: var(--ink) 1px solid;
    font-size: 16px;
    font-weight: 400;
    box-sizing: border-box;
    align-items: center;
    display: flex;
    cursor: pointer;
    transition: all 0.2s ease 0s;
    overflow: hidden;
    outline: none;
    user-select: none;
    white-space: nowrap;
  }

  .ri-add-circle-fill {
    margin-right: 4px;
    font-size: 24px;
  }

  .banner-button:hover {
    background-color: var(--white);
    color: var(--ink);
    border: var(--grey-dark) 1px solid;
  }

  .app-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 40px 80px 0px 80px;
  }

  .app-section-title {
    font-size: 20px;
    color: var(--ink);
    font-weight: 700;
    margin-bottom: 20px;
  }
</style>
