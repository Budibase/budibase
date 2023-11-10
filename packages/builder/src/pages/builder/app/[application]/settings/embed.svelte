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
  } from "@budibase/bbui"
  import { AppStatus } from "constants"
  import { apps } from "stores/portal"
  import { store } from "builderStore"

  $: filteredApps = $apps.filter(app => app.devId == $store.appId)
  $: app = filteredApps.length ? filteredApps[0] : {}
  $: appUrl = `${window.origin}/embed${app?.url}`
  $: appDeployed = app?.status === AppStatus.DEPLOYED

  $: embed = `<iframe width="800" height="600" frameborder="0" allow="clipboard-write;camera;geolocation;fullscreen" src="${appUrl}"></iframe>`
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>Embed</Heading>
    <Body>Embed your app into your other tools of choice</Body>
  </Layout>
  <Divider />
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
        <Icon size="S" name="Info" /> Embeds will only work with a published app
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
    /* justify-content: center; */
    background-color: var(
      --spectrum-textfield-m-background-color,
      var(--spectrum-global-color-gray-50)
    );
    border-radius: var(--border-radius-s);
    padding: var(--spacing-xl);
  }
</style>
