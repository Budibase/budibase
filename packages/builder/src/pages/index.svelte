<script>
  import { getContext } from "svelte"
  import { store } from "builderStore"
  import api from "builderStore/api"
  import AppList from "components/start/AppList.svelte"
  import { onMount } from "svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import Spinner from "components/common/Spinner.svelte"
  import CreateAppModal from "components/start/CreateAppModal.svelte"
  import TemplateList from "components/start/TemplateList.svelte"
  import { Button } from "@budibase/bbui"

  let hasKey

  async function fetchKeys() {
    const response = await api.get(`/api/keys/`)
    const res = await response.json()
    return res.budibase
  }

  async function checkIfKeysAndApps() {
    const key = await fetchKeys()
    if (key) {
      hasKey = true
    } else {
      showCreateAppModal()
    }
  }

  // Handle create app modal
  const { open } = getContext("simple-modal")

  const showCreateAppModal = template => {
    open(
      CreateAppModal,
      {
        hasKey,
        template,
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

  checkIfKeysAndApps()
</script>

<div class="header">
  <div class="welcome">Welcome to the Budibase Beta</div>
  <Button primary purple on:click={() => showCreateAppModal()}>
    Create New Web App
  </Button>
</div>

<div class="banner">
  <img src="/_builder/assets/orange-landscape.png" alt="rocket" />
  <div class="banner-content">
    Every accomplishment starts with a decision to try.
  </div>
</div>

<TemplateList onSelect={showCreateAppModal} />
<AppList />

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 40px 80px 0px 80px;
  }

  .welcome {
    font-size: var(--font-size-3xl);
    color: var(--ink);
    font-weight: 600;
  }

  .banner {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    text-align: center;
    color: white;
    margin: 20px 80px 40px 80px;
    border-radius: 16px;
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
</style>
