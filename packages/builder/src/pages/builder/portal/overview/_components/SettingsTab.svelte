<script>
  import {
    Layout,
    Divider,
    Heading,
    Body,
    Page,
    Button,
    Modal,
  } from "@budibase/bbui"
  import { store } from "builderStore"
  import clientPackage from "@budibase/client/package.json"
  import VersionModal from "components/deploy/VersionModal.svelte"
  import UpdateAppModal from "components/start/UpdateAppModal.svelte"
  import { AppStatus } from "constants"

  export let app

  let versionModal
  let updatingModal

  $: updateAvailable = clientPackage.version !== $store.version
  $: appUrl = `${window.origin}/app${app?.url}`
  $: appDeployed = app?.status === AppStatus.DEPLOYED
</script>

<div class="settings-tab">
  <Page wide={false}>
    <Layout gap="XL" paddingY="XXL" paddingX="">
      <span class="details-section">
        <Layout gap="XS" noPadding>
          <Heading size="S">Name and URL</Heading>
          <Divider />
          <Body>
            <div class="app-details">
              <div class="app-name">
                <div class="name-title detail-title">Name</div>
                <div class="name">{app?.name}</div>
              </div>
              <div class="app-url">
                <div class="url-title detail-title">Url Path</div>
                <div class="url">{appUrl}</div>
              </div>
            </div>
            <div class="page-action">
              <Button
                cta
                secondary
                on:click={() => {
                  updatingModal.show()
                }}
                disabled={appDeployed}
              >
                Edit
              </Button>
            </div>
          </Body>
        </Layout>
      </span>
      <span class="version-section">
        <Layout gap="XS" noPadding>
          <Heading size="S">App version</Heading>
          <Divider />
          <Body>
            {#if updateAvailable}
              <Body>
                The app is currently using version
                <strong>{$store.version}</strong>
                but version <strong>{clientPackage.version}</strong> is
                available.
                <br />
                Updates can contain new features, performance improvements and bug
                fixes.
              </Body>
              <div class="page-action">
                <Button cta on:click={versionModal.show()}>Update app</Button>
              </div>
            {:else}
              <div class="version-status">
                The app is currently using version
                <strong>{$store.version}</strong>. You're running the latest!
              </div>
              <div class="page-action">
                <Button secondary on:click={versionModal.show()}>
                  Revert app
                </Button>
              </div>
            {/if}
          </Body>
        </Layout>
      </span>
    </Layout>
    <VersionModal bind:this={versionModal} hideIcon={true} />
    <Modal bind:this={updatingModal} padding={false} width="600px">
      <UpdateAppModal {app} />
    </Modal>
  </Page>
</div>

<style>
  .page-action {
    padding-top: var(--spacing-xl);
  }
  .app-details {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
  .detail-title {
    color: var(--spectrum-global-color-gray-600);
    font-size: var(
      --spectrum-alias-font-size-default,
      var(--spectrum-global-dimension-font-size-100)
    );
  }
</style>
