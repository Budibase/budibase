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
  $: appUrl = `${window.origin}/app${app?.url}`
  $: appDeployed = app?.status === AppStatus.DEPLOYED

  const initialiseApp = async () => {
    const applicationPkg = await API.fetchAppPackage(app.devId)
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
    <Body>{app?.name}</Body>
  </Layout>

  <Layout noPadding gap="XS">
    <Label size="L">Icon</Label>
    <div class="icon">
      <Icon
        size="L"
        name={app?.icon?.name || "Apps"}
        color={app?.icon?.color}
      />
    </div>
  </Layout>

  <Layout noPadding gap="XXS">
    <Label size="L">URL</Label>
    <Body>{appUrl}</Body>
  </Layout>

  <div>
    <Button
      cta
      on:click={() => {
        updatingModal.show()
      }}
      disabled={appDeployed}
      tooltip={appDeployed
        ? "You must unpublish your app to make changes to these settings"
        : null}
      icon={appDeployed ? "HelpOutline" : null}
    >
      Edit
    </Button>
  </div>
</Layout>

<Modal bind:this={updatingModal} padding={false} width="600px">
  <UpdateAppModal
    {app}
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
