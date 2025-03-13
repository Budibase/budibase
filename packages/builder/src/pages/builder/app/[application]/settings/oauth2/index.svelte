<script lang="ts">
  import { Layout, Heading, Body, Divider, Button, Table } from "@budibase/bbui"
  import { oauth2 } from "@/stores/builder"
  import AddButton from "./AddButton.svelte"
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <div class="header">
      <Heading>OAuth2</Heading>
      <AddButton />
    </div>
    <Body
      >Manage and configure OAuth 2.0 Client Credentials for secure API access.</Body
    >
  </Layout>
  <Divider />
</Layout>

<Table data={$oauth2} />

<style>
  .header {
    display: flex;
    justify-content: space-between;
  }
</style>
