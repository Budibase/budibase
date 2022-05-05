<script>
  import { Layout, Divider, Heading, Body, Page, Button } from "@budibase/bbui"
  import { store } from "builderStore"
  import clientPackage from "@budibase/client/package.json"

  export let app
  //Review locking behaviour.
  //The app just needs to be unlocked/lockedByYou to proceed?

  $: updateAvailable = clientPackage.version !== $store.version
</script>

<div class="version-tab">
  <Page wide={false}>
    <Layout noPadding>
      <Layout gap="XS" noPadding>
        <Heading>App Version</Heading>
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
            <Button cta on:click={() => {}}>Update App</Button>
          </div>
        </Body>
      </Layout>
    </Layout>
  </Page>
</div>

<style>
  .page-action {
    padding-top: var(--spacing-xl);
  }
</style>
