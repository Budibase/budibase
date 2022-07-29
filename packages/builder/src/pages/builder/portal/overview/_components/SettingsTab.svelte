<script>
  import {
    Layout,
    Divider,
    Heading,
    Body,
    Page,
    Button,
    Modal,
    Detail,
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
  $: appDeployed = app.status === AppStatus.DEPLOYED
</script>

<div class="settings-tab">
  <Page wide={false}>
    <Layout gap="XL" paddingY="XXL" paddingX="">
      <Layout gap="XS" noPadding>
        <Heading size="M">App settings</Heading>
        <Body>General information about your app</Body>
      </Layout>
      <Divider />
      <span class="details-section">
        <Layout gap="XS" noPadding>
          <Heading size="S">App details</Heading>
          <Body>
            Update your app's name and URL.

            <div class="app-details">
              <div class="app-detail">
                <Detail size="S">Name</Detail>
                <div class="name">{app?.name}</div>
              </div>
              <div class="app-detail">
                <Detail size="S">URL path</Detail>
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
      <Divider />
      <span class="version-section">
        <Layout gap="XS" noPadding>
          <Heading size="S">App version</Heading>

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
    gap: var(--spacing-xl);
    margin: var(--spacing-xl) 0 0 0;
  }
  .detail-title {
    color: var(--spectrum-global-color-gray-700);
    font-size: var(
      --spectrum-alias-font-size-default,
      var(--spectrum-global-dimension-font-size-100)
    );
  }

  .app-detail {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
