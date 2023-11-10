<script>
  import {
    Layout,
    Divider,
    Heading,
    Body,
    Button,
    Label,
    Modal,
    Icon,
  } from "@budibase/bbui"
  import { AppStatus } from "constants"
  import { store } from "builderStore"
  import { apps } from "stores/portal"
  import UpdateAppModal from "components/start/UpdateAppModal.svelte"
  import { API } from "api"

  let updatingModal

  $: filteredApps = $apps.filter(app => app.devId == $store.appId)
  $: app = filteredApps.length ? filteredApps[0] : {}
  $: appDeployed = app?.status === AppStatus.DEPLOYED

  const initialiseApp = async () => {
    const applicationPkg = await API.fetchAppPackage($store.appId)
    await store.actions.initialise(applicationPkg)
  }
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>Name and URL</Heading>
    <Body>Edit your app's name and URL</Body>
  </Layout>
  <Divider />

  <Layout noPadding gap="XXS">
    <Label size="L">Name</Label>
    <Body>{$store?.name}</Body>
  </Layout>

  <Layout noPadding gap="XS">
    <Label size="L">Icon</Label>
    <div class="icon">
      <Icon
        size="L"
        name={$store?.icon?.name || "Apps"}
        color={$store?.icon?.color}
      />
    </div>
  </Layout>

  <Layout noPadding gap="XXS">
    <Label size="L">URL</Label>
    <Body>{$store.url}</Body>
  </Layout>

  <div>
    <Button
      cta
      on:click={() => {
        updatingModal.show()
      }}
      disabled={appDeployed}
      tooltip={appDeployed
        ? "You must unpublish your app to make changes"
        : null}
    >
      Edit
    </Button>
  </div>
</Layout>

<Modal bind:this={updatingModal} padding={false} width="600px">
  <UpdateAppModal
    app={{
      name: $store.name,
      url: $store.url,
      icon: $store.icon,
      appId: $store.appId,
    }}
    onUpdateComplete={async () => {
      await initialiseApp()
    }}
  />
</Modal>

<style>
  .icon {
    display: flex;
    justify-content: flex-start;
  }
</style>
