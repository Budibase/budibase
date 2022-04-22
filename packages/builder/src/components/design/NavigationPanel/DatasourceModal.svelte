<script>
  import { store } from "builderStore"
  import { ModalContent, Layout, notifications, Icon } from "@budibase/bbui"
  import { tables, datasources } from "stores/backend"
  import getTemplates from "builderStore/store/screenTemplates"
  import ICONS from "../../backend/DatasourceNavigator/icons"
  import { IntegrationNames } from "constants"
  import { onMount } from "svelte"

  export let onCancel
  export let onConfirm
  export let initalScreens = []

  let selectedScreens = [...initalScreens]

  const toggleScreenSelection = (table, datasource) => {
    if (selectedScreens.find(s => s.table === table.name)) {
      selectedScreens = selectedScreens.filter(
        screen => screen.table !== table.name
      )
    } else {
      let partialTemplates = getTemplates($store, $tables.list).reduce(
        (acc, template) => {
          if (template.table === table.name) {
            template.datasource = datasource.name
            acc.push(template)
          }
          return acc
        },
        []
      )
      selectedScreens = [...partialTemplates, ...selectedScreens]
    }
  }

  const confirmDatasourceSelection = async () => {
    await onConfirm({
      templates: selectedScreens,
    })
  }

  $: filteredSources = Array.isArray($datasources.list)
    ? $datasources.list.reduce((acc, datasource) => {
        if (
          datasource.source !== IntegrationNames.REST &&
          datasource["entities"]
        ) {
          acc.push(datasource)
        }
        return acc
      }, [])
    : []

  onMount(async () => {
    try {
      await datasources.fetch()
    } catch (error) {
      notifications.error("Error fetching datasources")
    }
  })
</script>

<span data-cy="data-source-modal">
  <ModalContent
    title="Create CRUD Screens"
    confirmText="Confirm"
    cancelText="Back"
    onConfirm={confirmDatasourceSelection}
    {onCancel}
    disabled={!selectedScreens.length}
    size="L"
  >
    <Layout noPadding gap="S">
      {#each filteredSources as datasource}
        <div class="data-source-wrap">
          <div class="data-source-header">
            <div class="datasource-icon">
              <svelte:component
                this={ICONS[datasource.source]}
                height="24"
                width="24"
              />
            </div>
            <div class="data-source-name">{datasource.name}</div>
          </div>
          {#if Array.isArray(datasource.entities)}
            {#each datasource.entities.filter(table => table._id !== "ta_users") as table}
              <div
                class="data-source-entry"
                class:selected={selectedScreens.find(
                  x => x.table === table.name
                )}
                on:click={() => toggleScreenSelection(table, datasource)}
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

                {#if selectedScreens.find(x => x.table === table.name)}
                  <span class="data-source-check">
                    <Icon size="S" name="CheckmarkCircle" />
                  </span>
                {/if}
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
                  toggleScreenSelection(
                    datasource.entities[table_key],
                    datasource
                  )}
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

                {#if selectedScreens.find(x => x.table === datasource.entities[table_key].name)}
                  <span class="data-source-check">
                    <Icon size="S" name="CheckmarkCircle" />
                  </span>
                {/if}
              </div>
            {/each}
          {/if}
        </div>
      {/each}
    </Layout>
  </ModalContent>
</span>

<style>
  .data-source-wrap {
    padding-bottom: var(--spectrum-alias-item-padding-s);
    display: grid;
    grid-gap: var(--spacing-xs);
  }

  .data-source-header {
    display: flex;
    align-items: center;
  }

  .data-source-entry {
    cursor: pointer;
    grid-gap: var(--spectrum-alias-grid-margin-xsmall);
    padding: var(--spectrum-alias-item-padding-s);
    background: var(--spectrum-alias-background-color-primary);
    transition: 0.3s all;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    border-width: 1px;
    display: flex;
    align-items: center;
  }

  .data-source-entry:hover,
  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }

  .data-source-name {
    padding: var(--spectrum-alias-item-padding-s);
    min-height: var(--spectrum-icon-size-s);
  }

  .data-source-entry .data-source-check {
    margin-left: auto;
  }

  .data-source-entry :global(.spectrum-Icon) {
    min-width: 16px;
  }

  .data-source-entry .data-source-check :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-green-600);
    display: block;
  }
</style>
