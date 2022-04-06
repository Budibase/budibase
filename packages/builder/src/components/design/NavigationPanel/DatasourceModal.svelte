<script>
  import { store, selectedAccessRole } from "builderStore"
  import { ModalContent, Layout, Select } from "@budibase/bbui"
  import { tables, datasources, roles } from "stores/backend"
  import getTemplates from "builderStore/store/screenTemplates"
  import ICONS from "../../backend/DatasourceNavigator/icons"
  import { IntegrationNames } from "constants"

  export let onCancel
  export let onConfirm

  let selectedScreens = []
  let screenAccessRole = $selectedAccessRole + ""

  const toggleScreenSelection = table => {
    if (selectedScreens.find(s => s.table === table.name)) {
      selectedScreens = selectedScreens.filter(
        screen => screen.table !== table.name
      )
    } else {
      let partialTemplates = getTemplates($store, $tables.list).filter(
        template => template.table === table.name
      )
      selectedScreens = [...partialTemplates, ...selectedScreens]
    }
  }

  const confirmDatasourceSelection = async () => {
    await onConfirm({
      templates: selectedScreens,
      screenAccessRole,
    })
  }

  $: filteredSources = $datasources.list.reduce((acc, datasource) => {
    acc["restSources"] = !acc["restSources"] ? [] : acc["restSources"]
    acc["otherSources"] = !acc["otherSources"] ? [] : acc["otherSources"]
    if (datasource.source === IntegrationNames.REST) {
      acc["restSources"].push(datasource)
    } else {
      acc["otherSources"].push(datasource)
    }
    return acc
  }, {})
</script>

<ModalContent
  title="Create CRUD Screens"
  confirmText="Confirm"
  cancelText="Back"
  onConfirm={confirmDatasourceSelection}
  {onCancel}
  disabled={!selectedScreens.length}
  size="L"
>
  <Layout noPadding gap="XS">
    {#each filteredSources.otherSources as datasource}
      <div class="data-source-header">
        <div class="datasource-icon">
          <svelte:component
            this={ICONS[datasource.source]}
            height="24"
            width="24"
          />
        </div>
        <div class="content">
          <div class="text">{datasource.name}</div>
        </div>
      </div>
      {#if Array.isArray(datasource.entities)}
        {#each datasource.entities.filter(table => table._id !== "ta_users") as table}
          <div
            class="data-source-entry"
            class:selected={selectedScreens.find(x => x.table === table.name)}
            on:click={() => toggleScreenSelection(table)}
          >
            <svg
              width="16px"
              height="16px"
              class="spectrum-Icon"
              style="color: white"
              focusable="false"
            >
              <use xlink:href="#spectrum-icon-18-Table" />
            </svg>
            {table.name}
          </div>
        {/each}
      {/if}
      {#if datasource["entities"] && !Array.isArray(datasource.entities)}
        {#each Object.keys(datasource.entities).filter(table => table._id !== "ta_users") as table_key}
          <div
            class="data-source-entry"
            class:selected={selectedScreens.find(
              x => x.table === datasource.entities[table_key].name
            )}
            on:click={() =>
              toggleScreenSelection(datasource.entities[table_key])}
          >
            <svg
              width="16px"
              height="16px"
              class="spectrum-Icon"
              style="color: white"
              focusable="false"
            >
              <use xlink:href="#spectrum-icon-18-Table" />
            </svg>
            {datasource.entities[table_key].name}
          </div>
        {/each}
      {/if}
    {/each}
    <Select
      bind:value={screenAccessRole}
      label="Screen access"
      getOptionLabel={role => role.name}
      getOptionValue={role => role._id}
      getOptionColor={role => role.color}
      options={$roles}
    />
  </Layout>
</ModalContent>

<style>
  .data-source-header {
    display: flex;
    align-items: center;
  }

  .data-source-header .content {
    padding: var(--spectrum-alias-item-padding-l);
  }

  .data-source-entry {
    cursor: pointer;
    grid-gap: var(--spectrum-alias-grid-margin-xsmall);
    padding: var(--spectrum-alias-item-padding-s);
    background: var(--spectrum-alias-background-color-primary);
    transition: 0.3s all;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    box-sizing: border-box;
    border-width: 1px;
    display: flex;
    align-items: center;
  }

  .data-source-entry:hover,
  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }
</style>
