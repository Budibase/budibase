<script>
  import { Page, Layout, Heading, Body, Link } from "@budibase/bbui"
  import { MaintenanceType } from "@budibase/types"
  import { admin } from "stores/portal"
  import BudibaseLogo from "../portal/_components/BudibaseLogo.svelte"
</script>

{#each $admin.maintenance as maintenance}
  {#if maintenance.type === MaintenanceType.SQS_MISSING}
    <Page>
      <Layout>
        <BudibaseLogo />
        <Heading>Please upgrade your Budibase installation</Heading>
        <Body>
          We've detected that the version of Budibase you're using depends on a
          more recent version of the CouchDB database than what you have
          installed.
        </Body>
        <Body>
          To resolve this, you can either rollback to a previous version of
          Budibase, or follow the migration guide <Link href="#">here</Link>
          to update to a later version of CouchDB.
        </Body>
      </Layout>
    </Page>
  {/if}
{/each}
