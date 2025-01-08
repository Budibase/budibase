<script>
  import {
    Layout,
    Body,
    Heading,
    Divider,
    ActionButton,
    Modal,
  } from "@budibase/bbui"
  import { AppStatus } from "@/constants"
  import { appsStore } from "@/stores/portal"
  import { appStore } from "@/stores/builder"
  import ExportAppModal from "@/components/start/ExportAppModal.svelte"
  import ImportAppModal from "@/components/start/ImportAppModal.svelte"

  $: filteredApps = $appsStore.apps.filter(app => app.devId === $appStore.appId)
  $: app = filteredApps.length ? filteredApps[0] : {}
  $: appDeployed = app?.status === AppStatus.DEPLOYED

  let exportModal, importModal
  let exportPublishedVersion = false

  const exportApp = opts => {
    exportPublishedVersion = !!opts?.published
    exportModal.show()
  }

  const importApp = () => {
    importModal.show()
  }
</script>

<Modal bind:this={exportModal} padding={false}>
  <ExportAppModal {app} published={exportPublishedVersion} />
</Modal>

<Modal bind:this={importModal} padding={false}>
  <ImportAppModal {app} />
</Modal>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>Export your app</Heading>
    <Body>Export your latest edited or published app</Body>
  </Layout>
  <div class="body">
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
  <Divider />
  <Layout gap="XS" noPadding>
    <Heading>Import your app</Heading>
    <Body>Import an export to update this app</Body>
  </Layout>
  <div class="body">
    <ActionButton secondary on:click={() => importApp()}>
      Import app
    </ActionButton>
  </div>
</Layout>

<style>
  .body {
    display: flex;
    gap: var(--spacing-l);
  }
</style>
