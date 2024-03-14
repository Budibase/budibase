<!--
  This is the public facing maintenance screen. It is displayed when there is
  required maintenance to be done on the Budibase installation. We only use this
  if we detect that the Budibase installation is in a state where the vast
  majority of apps would not function correctly.

  The builder-facing maintenance screen is in
  packages/builder/src/pages/builder/maintenance/index.svelte, and tends to
  contain more detailed information and actions for the installation owner to
  take.
-->
<script>
  import { MaintenanceType } from "@budibase/types"
  import { Heading, Body, Layout } from "@budibase/bbui"

  export let maintenanceList
</script>

<div class="content">
  {#each maintenanceList as maintenance}
    {#if maintenance.type === MaintenanceType.SQS_MISSING}
      <Layout>
        <Heading>Budibase installation requires maintenance</Heading>
        <Body>
          The administrator of this Budibase installation needs to take actions
          to update components that are out of date. Please contact them and
          show them this warning. More information will be available when they
          log into their account.
        </Body>
      </Layout>
    {/if}
  {/each}
</div>

<style>
  .content {
    max-width: 700px;
    margin: auto;
    height: 100vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-l);
  }

  @media (max-width: 640px) {
    .content {
      justify-content: flex-start;
      align-items: flex-start;
    }
  }
</style>
