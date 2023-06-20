<script>
  import {
    Layout,
    Body,
    Heading,
    Divider,
    ActionButton,
    Modal,
  } from "@budibase/bbui"
  import { AppStatus } from "constants"
  import { apps } from "stores/portal"
  import { store } from "builderStore"
  import ExportAppModal from "components/start/ExportAppModal.svelte"

  $: filteredApps = $apps.filter(app => app.devId == $store.appId)
  $: app = filteredApps.length ? filteredApps[0] : {}
  $: appDeployed = app?.status === AppStatus.DEPLOYED

  let exportModal
  let exportPublishedVersion = false

  const exportApp = opts => {
    exportPublishedVersion = !!opts?.published
    exportModal.show()
  }
</script>

<Modal bind:this={exportModal} padding={false}>
  <ExportAppModal {app} published={exportPublishedVersion} />
</Modal>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>Export your app</Heading>
    <Body>Export your latest edited or published app</Body>
  </Layout>
  <Divider />
  <div class="export-body">
    <ActionButton secondary on:click={() => exportApp({ published: false })}>
      Export latest edited app
    </ActionButton>
    <ActionButton
      secondary
      disabled={!appDeployed}
      on:click={() => exportApp({ published: true })}
    >
      Export latest published app
    </ActionButton>
  </div>
</Layout>

<style>
  .export-body {
    display: flex;
    gap: var(--spacing-l);
  }
</style>
