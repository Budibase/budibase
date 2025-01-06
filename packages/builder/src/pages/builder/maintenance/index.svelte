<script>
  import { MaintenanceType } from "@budibase/types"
  import { Heading, Body, Button, Layout } from "@budibase/bbui"
  import { admin } from "@/stores/portal"
  import BudibaseLogo from "../portal/_components/BudibaseLogo.svelte"

  $: {
    if ($admin.maintenance.length === 0) {
      window.location = "/builder"
    }
  }
</script>

<div class="main">
  <div class="content">
    <div class="hero">
      <BudibaseLogo />
    </div>
    <div class="inner-content">
      {#each $admin.maintenance as maintenance}
        {#if maintenance.type === MaintenanceType.SQS_MISSING}
          <Layout>
            <Heading>Please upgrade your Budibase installation</Heading>
            <Body>
              We've detected that the version of Budibase you're using depends
              on a more recent version of the CouchDB database than what you
              have installed.
            </Body>
            <Body>
              To resolve this, you can either rollback to a previous version of
              Budibase, or follow the migration guide to update to a later
              version of CouchDB.
            </Body>
          </Layout>
          <Button
            on:click={() =>
              (window.location = "https://docs.budibase.com/docs/migrations")}
            >Migration guide</Button
          >
        {/if}
      {/each}
    </div>
  </div>
</div>

<style>
  .main {
    max-width: 700px;
    margin: auto;
    height: 100vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-l);
  }
  .hero {
    margin: var(--spacing-l);
  }
  .content {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: center;
    gap: var(--spacing-m);
  }

  .inner-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-m);
  }

  @media only screen and (max-width: 600px) {
    .content {
      flex-direction: column;
      align-items: flex-start;
    }
    .main {
      height: auto;
    }
  }
</style>
