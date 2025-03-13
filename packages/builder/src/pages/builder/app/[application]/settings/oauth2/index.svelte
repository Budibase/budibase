<script lang="ts">
  import { Layout, Heading, Body, Divider, Table } from "@budibase/bbui"
  import { oauth2 } from "@/stores/builder"
  import AddButton from "./AddButton.svelte"
  import { onMount } from "svelte"

  const schema = {
    name: {
      sortable: false,
    },
    lastUsed: {
      displayName: "Last used",
      sortable: false,
    },
  }

  onMount(() => {
    oauth2.fetch()
  })

  $: configs = $oauth2.configs.map(c => ({
    lastUsed: "Never used",
    ...c,
  }))
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

<Table
  data={configs}
  loading={$oauth2.loading}
  {schema}
  allowEditColumns={false}
  allowClickRows={false}
/>

<style>
  .header {
    display: flex;
    justify-content: space-between;
  }
</style>
