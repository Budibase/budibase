<script>
  import {
    Layout,
    Body,
    Heading,
    Divider,
    Button,
    Helpers,
    Icon,
    notifications,
    Select,
  } from "@budibase/bbui"
  import { AppStatus } from "@/constants"
  import { appsStore } from "@/stores/portal"
  import { appStore, workspaceAppStore } from "@/stores/builder"

  let selectedApp

  $: filteredApps = $appsStore.apps.filter(app => app.devId == $appStore.appId)
  $: workspace = filteredApps.length ? filteredApps[0] : {}
  $: workspaceBaseUrl = `${window.origin}/embed${workspace?.url}`
  $: workspaceUrl =
    !selectedApp || selectedApp?.isDefault
      ? workspaceBaseUrl
      : `${workspaceBaseUrl}${selectedApp.url}`
  $: appDeployed = workspace?.status === AppStatus.DEPLOYED
  $: defaultApp = $workspaceAppStore.workspaceApps.find(a => a.isDefault)
  $: embedTitle = selectedApp?.name || workspace?.name || ""

  $: embed = `<iframe title="${embedTitle}" width="800" height="600" frameborder="0" allow="clipboard-write;camera;geolocation;fullscreen" src="${workspaceUrl}"> </iframe>`
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>Embed</Heading>
    <Body>Embed your app into your other tools of choice</Body>
  </Layout>
  <Divider />
  <div class="embed-app-select">
    <span>
      Select a workspace app below if you wish to target a specific app:
    </span>
    <Select
      placeholder={!$workspaceAppStore.workspaceApps.length
        ? "No workspace apps"
        : false}
      options={$workspaceAppStore.workspaceApps}
      getOptionLabel={a => a.name}
      getOptionValue={a => a}
      value={selectedApp || defaultApp}
      on:change={e => (selectedApp = e.detail)}
      disabled={!$workspaceAppStore.workspaceApps.length}
    />
  </div>
  <div class="embed-body">
    <div class="embed-code">{embed}</div>
    {#if appDeployed}
      <div>
        <Button
          cta
          disabled={!appDeployed}
          on:click={async () => {
            await Helpers.copyToClipboard(embed)
            notifications.success("Copied")
          }}
        >
          Copy code
        </Button>
      </div>
    {:else}
      <div class="embed-info">
        <Icon size="S" name="info" /> Embeds will only work with a published app
      </div>
    {/if}
  </div>
</Layout>

<style>
  .embed-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .embed-body {
    display: flex;
    flex-direction: column;
    gap: var(--spectrum-alias-grid-gutter-small);
  }
  .embed-code {
    display: flex;
    align-items: center;
    background-color: var(
      --spectrum-textfield-m-background-color,
      var(--spectrum-global-color-gray-50)
    );
    border-radius: var(--border-radius-s);
    padding: var(--spacing-xl);
  }
  .embed-app-select {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    width: fit-content;
  }
</style>
