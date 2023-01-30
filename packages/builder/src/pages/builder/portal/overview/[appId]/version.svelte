<script>
  import { Layout, Heading, Body, Divider, Button } from "@budibase/bbui"
  import { store } from "builderStore"
  import clientPackage from "@budibase/client/package.json"
  import VersionModal from "components/deploy/VersionModal.svelte"

  let versionModal

  $: updateAvailable = clientPackage.version !== $store.version
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
      but version <strong>{clientPackage.version}</strong> is available.
      <br />
      Updates can contain new features, performance improvements and bug fixes.
    </Body>
    <div>
      <Button cta on:click={versionModal.show}>Update app</Button>
    </div>
  {:else}
    <Body>
      The app is currently using version <strong>{$store.version}</strong>.
      <br />
      You're running the latest!
    </Body>
    <div>
      <Button secondary on:click={versionModal.show}>Revert app</Button>
    </div>
  {/if}
</Layout>

<VersionModal bind:this={versionModal} hideIcon={true} />
