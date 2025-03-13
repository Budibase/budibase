<script lang="ts">
  import { Layout, Heading, Body, Divider, Table } from "@budibase/bbui"
  import { oauth2 } from "@/stores/builder"
  import AddButton from "./AddButton.svelte"
  import { onMount } from "svelte"

  const schema = {
    name: "",
  }

  onMount(() => {
    oauth2.fetch()
  })
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

{#if $oauth2.configs.length}
  <Table
    data={$oauth2.configs}
    loading={$oauth2.loading}
    {schema}
    disableSorting
    allowEditColumns={false}
    allowClickRows={false}
  />
{/if}

<style>
  .header {
    display: flex;
    justify-content: space-between;
  }
</style>
