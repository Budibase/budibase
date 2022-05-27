<script>
  import { Layout, Table, Select } from "@budibase/bbui"
  import DateTimeRenderer from "components/common/renderers/DateTimeRenderer.svelte"
  import StatusRenderer from "./StatusRenderer.svelte"
  import HistoryDetailsPanel from "./HistoryDetailsPanel.svelte"
  import { automationStore } from "builderStore"
  import { onMount } from "svelte"

  export let appId

  let showPanel = false
  let selectedHistory = null
  let runHistory = []

  const runHistorySchema = {
    status: { displayName: "Status" },
    timestamp: { displayName: "Time" },
    name: { displayName: "Automation" },
  }

  const customRenderers = [
    { column: "time", component: DateTimeRenderer },
    { column: "status", component: StatusRenderer },
  ]

  function enrichHistory(definitions, runHistory) {
    const finalHistory = []
    for (let history of runHistory) {
      if (!history.steps) {
        continue
      }
      let notFound = false
      for (let step of history.steps) {
        const trigger = definitions.trigger[step.stepId],
          action = definitions.action[step.stepId]
        if (!trigger && !action) {
          notFound = true
          break
        }
        step.icon = trigger ? trigger.icon : action.icon
        step.name = trigger ? trigger.name : action.name
      }
      if (!notFound) {
        finalHistory.push(history)
      }
    }
    return finalHistory
  }

  function viewDetails({ detail }) {
    selectedHistory = detail
    showPanel = true
  }

  onMount(async () => {
    let definitions = await automationStore.actions.definitions()
    runHistory = enrichHistory(definitions, [
      {
        status: "Error",
        timestamp: "2022-05-11T16:06:14.438Z",
        name: "automation name",
        steps: [
          {
            stepId: "ROW_SAVED",
            outputs: {},
          },
          {
            stepId: "SEND_EMAIL_SMTP",
            inputs: {},
            outputs: {},
          },
        ],
      },
      {
        status: "Success",
        timestamp: "2022-05-11T16:03:14.438Z",
        name: "automation name",
        steps: [
          {
            stepId: "ROW_SAVED",
            outputs: {},
          },
          {
            stepId: "SEND_EMAIL_SMTP",
            inputs: {},
            outputs: {},
          },
        ],
      },
    ])
  })
</script>

<div class="root" class:panelOpen={showPanel}>
  <Layout paddingX="XL" gap="S" alignContent="start">
    <div class="search">
      <div class="select">
        <Select placeholder="All automations" label="Automation" />
      </div>
      <div class="select">
        <Select placeholder="Past 30 days" label="Date range" />
      </div>
      <div class="select">
        <Select placeholder="All status" label="Status" />
      </div>
    </div>
    {#if runHistory}
      <Table
        on:click={viewDetails}
        schema={runHistorySchema}
        allowSelectRows={false}
        allowEditColumns={false}
        allowEditRows={false}
        data={runHistory}
        {customRenderers}
      />
    {/if}
  </Layout>
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
    grid-template-columns: auto 360px;
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
    position: absolute;
    right: 0;
    height: 100%;
    width: 360px;
    overflow: hidden;
    background-color: var(--background);
  }

  .panelShow {
    display: block;
  }
</style>
