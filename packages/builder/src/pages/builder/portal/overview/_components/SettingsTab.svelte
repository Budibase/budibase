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
  import { auth } from "stores/portal"
  import clientPackage from "@budibase/client/package.json"
  import VersionModal from "components/deploy/VersionModal.svelte"
  import UpdateAppModal from "components/start/UpdateAppModal.svelte"

  export let app

  let versionModal
  let updatingModal
  let selfHostPath =
    "https://docs.budibase.com/docs/hosting-methods#self-host-budibase"

  $: updateAvailable = clientPackage.version !== $store.version
  $: appUrl = `${window.origin}/app${app?.url}`
  $: lockedBy = app?.lockedBy
  $: lockedByYou = $auth.user.email === lockedBy?.email
</script>

<div class="version-tab">
  <Page wide={false}>
    <Layout gap="XL" noPadding>
      <Layout gap="XS" noPadding>
        <Heading size="S">Name and Url</Heading>
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
              disabled={lockedBy && !lockedByYou}
            >
              Edit
            </Button>
          </div>
        </Body>
      </Layout>
      <Layout gap="XS" noPadding>
        <Heading size="S">App Version</Heading>
        <Divider />
        <Body>
          {#if updateAvailable}
            <p>
              The app is currently using version <strong>{app?.version}</strong>
              but version <strong>{clientPackage.version}</strong> is available.
            </p>
          {:else}
            <p>
              The app is currently using version <strong>{app?.version}</strong
              >. You're running the latest!
            </p>
          {/if}
          <p>
            Updates can contain new features, performance improvements and bug
            fixes.
          </p>
          <div class="page-action">
            <Button
              cta
              on:click={versionModal.show()}
              disabled={!updateAvailable}>Update App</Button
            >
          </div>
        </Body>
      </Layout>
      <Layout gap="XS" noPadding>
        <Heading size="S">Self-host Budibase</Heading>
        <Divider />
        <Body>
          <p>
            Self-host Budibase for free to get unlimited apps and more - and it
            only takes a few minutes!
          </p>
          <div class="page-action">
            <Button
              cta
              on:click={() => {
                window.open(selfHostPath, "_blank")
              }}>Self-host Budibase</Button
            >
          </div>
        </Body>
      </Layout>
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
