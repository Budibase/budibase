<script lang="ts">
  import {
    Layout,
    Button,
    Select,
    Modal,
    Table,
    ActionButton,
    Icon,
    TooltipPosition,
    Banner,
    notifications,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import type { Plugin } from "@budibase/types"
  import { admin } from "@/stores/portal/admin"
  import { appsStore } from "@/stores/portal/apps"
  import { plugins } from "@/stores/portal/plugins"
  import AddPluginModal from "./_components/AddPluginModal.svelte"
  import PluginNameRenderer from "./_components/PluginNameRenderer.svelte"
  import EditPluginRenderer from "./_components/EditPluginRenderer.svelte"
  import RouteActions from "@/settings/components/RouteActions.svelte"
  import UsedInAppsRenderer from "./_components/UsedInAppsRenderer.svelte"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { routeActions } from "@/settings/pages"
  import type { StoreApp } from "@/types"

  interface PluginTableRow extends Plugin {
    usedInApps: string[]
    usedInAppsLabel: string
  }

  const schema = {
    name: {
      width: "2fr",
      minWidth: "200px",
      preventSelectRow: true,
    },
    version: {
      width: "1fr",
      preventSelectRow: true,
    },
    "schema.type": {
      width: "1fr",
      displayName: "Type",
      capitalise: true,
      minWidth: "120px",
      preventSelectRow: true,
    },
    usedInAppsLabel: {
      width: "1.5fr",
      displayName: "Used in apps",
      minWidth: "180px",
      sortable: false,
      preventSelectRow: true,
    },
    edit: {
      width: "auto",
      displayName: "",
      sortable: false,
      preventSelectRow: true,
    },
  }
  const customRenderers = [
    { column: "name", component: PluginNameRenderer },
    { column: "usedInAppsLabel", component: UsedInAppsRenderer },
    { column: "edit", component: EditPluginRenderer },
  ]

  let modal: any
  let bulkDeleteDialog: ConfirmDialog
  let searchTerm = ""
  let filter = "all"
  let selectedRows: PluginTableRow[] = []
  let deletingPlugins = false
  let filterOptions = [
    { label: "All plugins", value: "all" },
    { label: "Components", value: "component" },
  ]

  const pluginUpdates = plugins.updates
  let applyingUpdates = false

  if (!$admin.cloud) {
    filterOptions.push({ label: "Datasources", value: "datasource" })
    filterOptions.push({ label: "Automation", value: "automation" })
  }

  const buildPluginUsageMap = (apps: StoreApp[]): Map<string, string[]> => {
    const usage = new Map<string, Set<string>>()
    for (const app of apps || []) {
      if (!app?.name || !Array.isArray(app.usedPlugins)) {
        continue
      }
      for (const plugin of app.usedPlugins) {
        if (!plugin?._id) {
          continue
        }
        if (!usage.has(plugin._id)) {
          usage.set(plugin._id, new Set())
        }
        usage.get(plugin._id)?.add(app.name)
      }
    }

    const usageMap = new Map<string, string[]>()
    for (const [pluginId, appNames] of usage.entries()) {
      usageMap.set(
        pluginId,
        [...appNames].sort((a, b) => a.localeCompare(b))
      )
    }
    return usageMap
  }

  $: pluginUsageById = buildPluginUsageMap($appsStore.apps)

  $: enrichedPlugins = ($plugins || []).map(plugin => {
    const usedInApps = plugin._id ? pluginUsageById.get(plugin._id) || [] : []
    return {
      ...plugin,
      usedInApps,
      usedInAppsLabel: usedInApps.length
        ? `${usedInApps.length} app${usedInApps.length === 1 ? "" : "s"}`
        : "Not used",
    }
  }) as PluginTableRow[]

  $: filteredPlugins = enrichedPlugins
    .filter((plugin: any) => {
      return filter === "all" || plugin.schema.type === filter
    })
    .filter((plugin: any) => {
      return (
        !searchTerm ||
        plugin?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

  onMount(async () => {
    await Promise.all([plugins.load(), appsStore.load()])
    try {
      await plugins.checkUpdates()
    } catch (err: any) {
      notifications.error(
        err?.message
          ? `Failed to check plugin updates: ${err.message}`
          : "Failed to check plugin updates"
      )
    }
  })

  async function bulkDeletePlugins() {
    if (deletingPlugins || selectedRows.length === 0) {
      return
    }
    deletingPlugins = true
    const pluginsToDelete = [...selectedRows]
    try {
      const deletionResults = await Promise.allSettled(
        pluginsToDelete.map(async plugin => {
          if (!plugin._id) {
            throw new Error("Plugin ID missing")
          }
          await plugins.deletePlugin(plugin._id)
          return plugin._id
        })
      )

      const deletedPluginIds = new Set<string>()
      const failedPluginIds = new Set<string>()
      const failedMessages: string[] = []
      for (let index = 0; index < deletionResults.length; index++) {
        const result = deletionResults[index]
        const plugin = pluginsToDelete[index]
        if (!plugin?._id) {
          continue
        }
        if (result.status === "fulfilled") {
          deletedPluginIds.add(result.value)
          continue
        }
        failedPluginIds.add(plugin._id)
        const reason =
          result.reason?.message ||
          result.reason?.error ||
          JSON.stringify(result.reason)
        failedMessages.push(`${plugin.name}: ${reason}`)
      }

      if (deletedPluginIds.size > 0) {
        notifications.success(
          deletedPluginIds.size === 1
            ? "Deleted 1 plugin"
            : `Deleted ${deletedPluginIds.size} plugins`
        )
      }
      if (failedMessages.length > 0) {
        notifications.error(
          `Failed to delete plugins:\n${failedMessages.join("\n")}`
        )
      }

      selectedRows = selectedRows.filter(
        row => row._id && failedPluginIds.has(row._id)
      )
    } finally {
      deletingPlugins = false
    }
  }

  async function applyAllUpdates() {
    if (applyingUpdates) {
      return
    }
    applyingUpdates = true
    try {
      const response = await plugins.applyUpdates()
      if (response.updated.length) {
        const count = response.updated.length
        notifications.success(
          count === 1
            ? `Updated ${response.updated[0].name} to ${response.updated[0].updatedVersion}`
            : `Updated ${count} plugins`
        )
      }
      if (response.failed.length) {
        const messages = response.failed
          .map(item => `${item.name}: ${item.error}`)
          .join("\n")
        notifications.error(`Failed to update plugins:\n${messages}`)
      }
    } catch (err: any) {
      notifications.error(
        err?.message
          ? `Failed to update plugins: ${err.message}`
          : "Failed to update plugins"
      )
    } finally {
      applyingUpdates = false
    }
  }
</script>

<Layout noPadding gap="S">
  {#if $pluginUpdates.length}
    <Banner type="info" showCloseButton={false}>
      <div class="updates-banner">
        <div class="updates-text">
          <span>
            {#if $pluginUpdates.length === 1}
              1 plugin update available
            {:else}
              {$pluginUpdates.length} plugin updates available
            {/if}
          </span>
          <span class="updates-note">
            Only Svelte 5 compatible plugins can be auto-updated
          </span>
        </div>
        <Button
          secondary
          size="S"
          on:click={applyAllUpdates}
          disabled={applyingUpdates}
        >
          {applyingUpdates ? "Updating..." : "Update all"}
        </Button>
      </div>
    </Banner>
  {/if}
  <Layout noPadding gap="S">
    <RouteActions>
      <div class="controls">
        <ActionButton
          size="M"
          quiet
          on:click={() =>
            window
              ?.open("https://github.com/Budibase/plugins", "_blank")
              ?.focus()}
        >
          <Icon
            name={"github-logo"}
            size="M"
            weight="fill"
            tooltip={"Github repo"}
            tooltipPosition={TooltipPosition.Top}
          />
        </ActionButton>
        {#if $plugins?.length}
          <div class="filters">
            <div class="select">
              <Select
                bind:value={filter}
                placeholder={undefined}
                options={filterOptions}
                autoWidth
              />
            </div>
          </div>
        {/if}
        <div class="actions">
          {#if selectedRows.length}
            <Button
              size="M"
              warning
              on:click={bulkDeleteDialog.show}
              disabled={deletingPlugins}
            >
              Delete selected ({selectedRows.length})
            </Button>
          {/if}
          <Button size="M" on:click={modal.show} cta>Add plugin</Button>
        </div>
      </div>
    </RouteActions>

    {#if $plugins?.length}
      <Table
        {schema}
        data={filteredPlugins}
        allowEditColumns={false}
        allowEditRows={false}
        allowSelectRows={true}
        allowClickRows={false}
        {customRenderers}
        bind:selectedRows
      />
    {/if}
  </Layout>
</Layout>

<Modal bind:this={modal}>
  <AddPluginModal />
</Modal>

<ConfirmDialog
  bind:this={bulkDeleteDialog}
  title="Delete selected plugins"
  okText={deletingPlugins ? "Deleting..." : "Delete plugins"}
  onOk={bulkDeletePlugins}
  disabled={deletingPlugins}
>
  Are you sure you want to delete {selectedRows.length} selected plugin{selectedRows.length ===
  1
    ? ""
    : "s"}?
  {#if selectedRows.some(row => row.usedInApps?.length)}
    <div class="usage-warning">
      The following plugins are currently used in apps:
      <ul>
        {#each selectedRows.filter(row => row.usedInApps?.length) as row}
          <li>
            <strong>{row.name}</strong> — {row.usedInApps.join(", ")}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</ConfirmDialog>

<style>
  .filters {
    display: flex;
    gap: var(--spacing-xl);
  }
  .controls {
    display: flex;
    gap: var(--spacing-xl);
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
  }
  .controls :global(.spectrum-Search) {
    width: 200px;
  }
  .actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  @media (max-width: 640px) {
    .filters {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    .controls :global(.spectrum-Search) {
      width: auto;
    }
    .actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
  .usage-warning {
    margin-top: var(--spacing-m);
  }
  .usage-warning ul {
    margin: var(--spacing-xs) 0 0 0;
    padding-left: var(--spacing-l);
  }
  .updates-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    flex-wrap: wrap;
  }
  .updates-text {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  .updates-note {
    font-size: var(--font-size-xs);
    opacity: 0.8;
  }
</style>
