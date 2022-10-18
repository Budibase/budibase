<script>
  import {
    ActionButton,
    Layout,
    Pagination,
    Select,
    Table,
    Modal,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { backups } from "stores/portal"
  import DatasourceRenderer from "./DatasourceRenderer.svelte"
  import ScreensRenderer from "./ScreensRenderer.svelte"
  import AutomationsRenderer from "./AutomationsRenderer.svelte"
  import CreateBackupModal from "./CreateBackupModal.svelte"
  import TriggerRenderer from "./TriggerRenderer.svelte"
  import ActionsRenderer from "./ActionsRenderer.svelte"

  export let app
  let backupData = null
  let modal

  const triggers = {
    PUBLISH: "Publish",
    SCHEDULED: "Scheduled",
    MANUAL: "Manual",
  }

  const schema = {
    trigger: {
      displayName: "Trigger",
    },
    name: {
      displayName: "Name",
    },
    date: {
      displayName: "Date",
    },
    datasources: {
      displayName: "Data",
    },
    screens: {
      displayName: "Screens",
    },
    automations: {
      displayName: "Automations",
    },
    userId: {
      displayName: "User",
    },
    actions: {
      displayName: null,
    },
  }

  const customRenderers = [
    { column: "datasources", component: DatasourceRenderer },
    { column: "screens", component: ScreensRenderer },
    { column: "automations", component: AutomationsRenderer },
    { column: "trigger", component: TriggerRenderer },
    { column: "actions", component: ActionsRenderer },
  ]

  async function fetchBackups() {
    backups.load()
    backupData = enrichBackupData($backups)
  }

  function enrichBackupData(backups) {
    let enrichedBackups = backups.map(backup => {
      return {
        ...backup,
        ...Object.assign(...backup.contents),
      }
    })

    return enrichedBackups
  }

  function createManualBackup(name) {
    backups.createManualBackup({ appId: app.appId, name })
  }

  onMount(async () => {
    console.log(await backups.searchBackups(app.appId))

    await fetchBackups()
  })
</script>

<div class="root">
  <Layout noPadding gap="M" alignContent="start">
    <div class="search">
      <div class="select">
        <Select
          placeholder="All"
          label="Trigger"
          options={Object.values(triggers)}
        />
      </div>
      <div class="split-buttons">
        <ActionButton on:click={modal.show} icon="SaveAsFloppy"
          >Create new backup</ActionButton
        >
      </div>
    </div>
    {#if backupData}
      <div>
        <Table
          {schema}
          allowSelectRows={false}
          allowEditColumns={false}
          allowEditRows={false}
          data={backupData}
          {customRenderers}
          placeholderText="No backups found"
          border={false}
        />
        <div class="pagination">
          <Pagination page={1} />
        </div>
      </div>
    {/if}
  </Layout>
</div>

<Modal bind:this={modal}>
  <CreateBackupModal {createManualBackup} />
</Modal>

<style>
  .root {
    display: grid;
    grid-template-columns: 1fr;
    height: 100%;
    padding: var(--spectrum-alias-grid-gutter-medium)
      var(--spectrum-alias-grid-gutter-large);
  }

  .search {
    display: flex;
    gap: var(--spacing-xl);
    width: 100%;
    align-items: flex-end;
  }

  .select {
    flex-basis: 150px;
  }

  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: var(--spacing-xl);
  }

  .split-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    gap: var(--spacing-xl);
  }
</style>
