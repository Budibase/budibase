<script>
  import {
    Heading,
    Layout,
    Button,
    ActionButton,
    ActionGroup,
    ButtonGroup,
    Select,
    Modal,
    Page,
  } from "@budibase/bbui"
  import AppGridView from "components/start/AppGridView.svelte"
  import AppTableView from "components/start/AppTableView.svelte"
  import CreateAppModal from "components/start/CreateAppModal.svelte"
  import api from "builderStore/api"
  import analytics from "analytics"
  import { onMount } from "svelte"
  import { apps } from "stores/portal"

  let layout = "grid"
  let modal
  let template

  async function checkKeys() {
    const response = await api.get(`/api/keys/`)
    const keys = await response.json()
    if (keys.userId) {
      analytics.identify(keys.userId)
    }
  }

  function initiateAppImport() {
    template = { fromFile: true }
    modal.show()
  }

  onMount(() => {
    checkKeys()
    apps.load()
  })
</script>

<Page wide>
  <Layout noPadding>
    <div class="title">
      <Heading>Apps</Heading>
      <ButtonGroup>
        <Button secondary on:click={initiateAppImport}>Import app</Button>
        <Button cta on:click={modal.show}>Create new app</Button>
      </ButtonGroup>
    </div>
    <div class="filter">
      <div class="select">
        <Select quiet placeholder="Filter by groups" />
      </div>
      <ActionGroup>
        <ActionButton
          on:click={() => (layout = "grid")}
          selected={layout === "grid"}
          quiet
          icon="ClassicGridView"
        />
        <ActionButton
          on:click={() => (layout = "table")}
          selected={layout === "table"}
          quiet
          icon="ViewRow"
        />
      </ActionGroup>
    </div>
    {#if layout === "grid"}
      <AppGridView />
    {:else}
      <AppTableView />
    {/if}
  </Layout>
</Page>
<Modal
  bind:this={modal}
  padding={false}
  width="600px"
  on:hide={() => (template = null)}
>
  <CreateAppModal {template} />
</Modal>

<style>
  .title,
  .filter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .select {
    width: 110px;
  }
</style>
