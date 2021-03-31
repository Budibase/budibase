<script>
  import api from "builderStore/api"
  import AppList from "components/start/AppList.svelte"
  import { get } from "builderStore/api"
  import CreateAppModal from "components/start/CreateAppModal.svelte"
  import { Button, Heading, Modal, Spacer } from "@budibase/bbui"
  import TemplateList from "components/start/TemplateList.svelte"
  import analytics from "analytics"

  let hasKey
  let template
  let modal

  async function getApps() {
    const res = await get("/api/applications")
    const json = await res.json()

    if (res.ok) {
      return json
    } else {
      throw new Error(json)
    }
  }

  async function fetchKeys() {
    const response = await api.get(`/api/keys/`)
    return await response.json()
  }

  async function checkIfKeysAndApps() {
    const keys = await fetchKeys()
    const apps = await getApps()
    if (keys.userId) {
      hasKey = true
      analytics.identify(keys.userId)
    }
  }

  function selectTemplate(newTemplate) {
    template = newTemplate
    modal.show()
  }

  function initiateAppImport() {
    template = { fromFile: true }
    modal.show()
  }

  function closeModal() {
    template = null
    modal.hide()
  }

  checkIfKeysAndApps()
</script>

<div class="container">
  <div class="header">
    <Heading medium black>Welcome to the Budibase Beta 123</Heading>
    <div class="button-group">
      <Button secondary on:click={initiateAppImport}>Import Web App</Button>
      <Spacer medium />
      <Button primary on:click={modal.show}>Create New Web App</Button>
    </div>
  </div>

  <div class="banner">
    <img src="/assets/orange-landscape.png" alt="rocket" />
    <div class="banner-content">
      Every accomplishment starts with a decision to try.
    </div>
  </div>

  <!-- <TemplateList onSelect={selectTemplate} /> -->

  <AppList />
</div>

<Modal bind:this={modal} padding={false} width="600px" on:hide={closeModal}>
  <CreateAppModal {hasKey} {template} />
</Modal>

<style>
  .container {
    display: grid;
    gap: var(--spacing-xl);
    margin: 40px 80px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .banner {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    text-align: center;
    color: white;
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
    color: white;
    font-weight: 500;
  }

  .button-group {
    display: flex;
    flex-direction: row;
  }
</style>
