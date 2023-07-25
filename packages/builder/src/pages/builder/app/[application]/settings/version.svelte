<script>
  import { Layout, Heading, Body, Divider, Button } from "@budibase/bbui"
  import { store, isOnlyUser } from "builderStore"
  import VersionModal from "components/deploy/VersionModal.svelte"

  let versionModal

  $: updateAvailable = $store.upgradableVersion !== $store.version
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>Version</Heading>
    <Body>See the current version of your app and check for updates</Body>
  </Layout>
  <Divider />
  {#if updateAvailable}
    <Body>
      The app is currently using version <strong>{$store.version}</strong>
      but version <strong>{$store.upgradableVersion}</strong> is available.
      <br />
      Updates can contain new features, performance improvements and bug fixes.
    </Body>
    <div>
      <Button
        cta
        on:click={versionModal.show}
        disabled={!$isOnlyUser}
        tooltip={$isOnlyUser
          ? null
          : "Unavailable - another user is editing this app"}
      >
        Update app
      </Button>
    </div>
  {:else}
    <Body>
      The app is currently using version <strong>{$store.version}</strong>.
      <br />
      You're running the latest!
    </Body>
    <div>
      <Button
        secondary
        on:click={versionModal.show}
        tooltip={$isOnlyUser
          ? null
          : "Unavailable - another user is editing this app"}
      >
        Revert app
      </Button>
    </div>
  {/if}
</Layout>

<VersionModal bind:this={versionModal} hideIcon={true} />
