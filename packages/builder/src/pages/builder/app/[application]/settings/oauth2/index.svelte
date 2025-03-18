<script lang="ts">
  import { Layout, Heading, Body, Divider, Table } from "@budibase/bbui"
  import { oauth2 } from "@/stores/builder"
  import AddButton from "./AddButton.svelte"
  import { onMount } from "svelte"
  import MoreMenuRenderer from "./MoreMenuRenderer.svelte"

  const schema = {
    name: {
      sortable: false,
    },
    lastUsed: {
      displayName: "Last used",
      sortable: false,
    },
    more: {
      width: "auto",
      displayName: "",
    },
  }
  const customRenderers = [{ column: "more", component: MoreMenuRenderer }]

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

  <Table
    data={configs}
    loading={$oauth2.loading}
    {schema}
    {customRenderers}
    allowEditRows={false}
    allowEditColumns={false}
    allowClickRows={false}
  />
</Layout>

<style>
  .header {
    display: flex;
    justify-content: space-between;
  }
</style>
