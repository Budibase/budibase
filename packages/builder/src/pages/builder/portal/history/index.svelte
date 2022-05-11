<script>
  import {
    Layout,
    Page,
    Heading,
    Body,
    Table,
    Select,
    Input,
  } from "@budibase/bbui"
  import DateTimeRenderer from "components/common/renderers/DateTimeRenderer.svelte"
  import HistoryDetailsPanel from "components/portal/history/HistoryDetailsPanel.svelte"

  let showPanel = false
  let selectedHistory = null

  const runHistorySchema = {
    status: "",
    time: "",
    app: "",
    automation: "",
  }

  const customRenderers = [{ column: "time", component: DateTimeRenderer }]

  let runHistory = [
    {
      status: "Error",
      time: "2022-05-11T16:06:14.438Z",
      app: "App name",
      automation: "automation name",
    },
    {
      status: "Success",
      time: "2022-05-11T16:03:14.438Z",
      app: "App name",
      automation: "automation name",
    },
  ]

  function viewDetails({ detail }) {
    selectedHistory = detail
    showPanel = true
  }
</script>

<div class="root" class:panelOpen={showPanel}>
  <Page wide>
    <Layout noPadding gap="S">
      <Heading size="L">Run History</Heading>
      <Body>View all the automations your published apps have performed</Body>
      <div class="search">
        <div class="select"><Select placeholder="All apps" label="Apps" /></div>
        <div class="select">
          <Select placeholder="All automations" label="Automation" />
        </div>
        <div class="select">
          <Select placeholder="Past 30 days" label="Date range" />
        </div>
        <div class="select">
          <Select placeholder="All status" label="Status" />
        </div>
        <div class="separator" />
        <div class="searchInput">
          <Input placeholder="Search" />
        </div>
      </div>
      <Table
        on:click={viewDetails}
        schema={runHistorySchema}
        allowSelectRows={false}
        allowEditColumns={false}
        allowEditRows={false}
        data={runHistory}
        {customRenderers}
      />
    </Layout>
  </Page>
  <div class="panel" class:panelShow={showPanel}>
    <HistoryDetailsPanel
      bind:history={selectedHistory}
      close={() => {
        showPanel = false
      }}
    />
  </div>
</div>

<style>
  .root {
    display: grid;
    grid-template-columns: 1fr;
    height: 100%;
  }

  .panelOpen {
    grid-template-columns: 1fr 390px;
  }

  .search {
    display: flex;
    gap: var(--spacing-l);
    width: 100%;
    align-items: flex-end;
  }

  .select {
    flex-basis: 150px;
  }

  .separator {
    flex-grow: 1;
  }

  .searchInput {
    margin-top: auto;
  }

  .panel {
    display: none;
    right: 0;
    height: 100%;
    width: 99%;
  }

  .panelShow {
    display: block;
  }
</style>
