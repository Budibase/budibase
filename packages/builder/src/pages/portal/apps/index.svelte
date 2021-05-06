<script>
  import {
    Heading,
    Layout,
    Button,
    ActionButton,
    ActionGroup,
    Select,
  } from "@budibase/bbui"
  import AppList from "components/start/AppList.svelte"

  let layout = "grid"
</script>

<Layout noPadding>
  <div class="title">
    <Heading>Apps</Heading>
    <Button primary>Create new app</Button>
  </div>
  <div class="filter">
    <div class="select">
      <Select quiet placeholder="Filter by groups" />
    </div>
    <ActionGroup>
      <ActionButton
        on:click={() => (layout = "grid")}
        selected={layout === "grid"}
        quiet
        icon="ClassicGridView"
      />
      <ActionButton
        on:click={() => (layout = "table")}
        selected={layout === "table"}
        quiet
        icon="ViewRow"
      />
    </ActionGroup>
  </div>
  {#if layout === "grid"}
    <AppList />
  {:else}
    Table
  {/if}
</Layout>

<style>
  .title,
  .filter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .select {
    width: 110px;
  }
</style>
