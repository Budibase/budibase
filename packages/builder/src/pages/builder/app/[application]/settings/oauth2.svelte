<script>
  import { Layout, Heading, Body, Divider, Button } from "@budibase/bbui"
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <div class="header">
      <Heading>OAuth2</Heading>
      <Button cta size="M">Add OAuth2</Button>
    </div>
    <Body
      >Manage and configure OAuth 2.0 Client Credentials for secure API access.</Body
    >
  </Layout>
  <Divider />
</Layout>

<style>
  .header {
    display: flex;
    justify-content: space-between;
  }
</style>
