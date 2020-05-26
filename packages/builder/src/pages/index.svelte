<script>
  import { getContext } from "svelte"
  import { store } from "builderStore"
  import AppList from "components/start/AppList.svelte"
  import { onMount } from "svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import IconButton from "components/common/IconButton.svelte"

  import Spinner from "components/common/Spinner.svelte"
  import CreateAppModal from "components/start/CreateAppModal.svelte"

  let promise = getApps()

  async function getApps() {
    const res = await fetch(`/api/applications`)
    const json = await res.json()

    if (res.ok) {
      return json
    } else {
      throw new Error(json)
    }
  }

  // Handle create app modal
  const { open } = getContext("simple-modal")
  const onCancel = text => {
    name = ""
    status = -1
  }

  const onOkay = text => {
    name = text
    status = 1
  }

  const showCreateAppModal = () => {
    open(
      CreateAppModal,
      {
        message: "What is your name?",
        hasForm: true,
        onCancel,
        onOkay,
      },
      {
        closeButton: false,
        closeOnEsc: false,
        closeOnOuterClick: false,
        styleContent: { padding: 0 },
        closeOnOuterClick: true
      }
    )
  }
</script>

<div class="welcome">Welcome to Budibase</div>
<div class="banner">
  <div class="banner-content">
    <div class="banner-header">
      Every accomplishment starts with a decision to try.
    </div>
    <button class="banner-button" type="button" on:click={showCreateAppModal}>
      <i class="ri-add-circle-fill" />
      Create New Web App
    </button>
  </div>
  <div class="banner-image">
    <img src="/_builder/assets/banner-image.png" alt="Bannerimage" />
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
  .welcome {
    margin: 60px 80px 0px 80px;
    font-size: 42px;
    color: var(--ink);
    font-weight: 900;
  }

  .banner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 20px 80px 40px 80px;
    background-image: linear-gradient(-45deg, #7f9ceb, #1d2f77);
    border-radius: 10px;
    max-height: 280px;
  }

  .banner-content {
    padding: 60px;
  }

  @media only screen and (min-width: 1800px) {
    .banner-content {
      padding: 80px;
    }
  }

  .banner-header {
    font-size: 24px;
    color: var(--white);
    font-weight: 500;
    margin-bottom: 20px;
  }

  @media only screen and (min-width: 1800px) {
    .banner-header {
      font-size: 36px;
      color: var(--white);
      font-weight: 500;
      margin-bottom: 20px;
    }
  }

  .banner-image {
    z-index: 1;
  }

  .banner-image img {
    max-height: 400px;
  }

  .spinner-container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .banner-button {
    background-color: var(--white);
    color: var(--ink);
    padding: 12px 20px;
    border-radius: 5px;
    border: 0px transparent solid;
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s;
    box-sizing: border-box;
    align-items: center;
    display: flex;
  }

  .ri-add-circle-fill {
    margin-right: 4px;
    font-size: 24px;
  }

  .banner-button:hover {
    background-color: var(--grey);
  }
</style>
