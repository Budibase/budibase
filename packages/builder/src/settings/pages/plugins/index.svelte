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
  import { admin } from "@/stores/portal/admin"
  import { plugins } from "@/stores/portal/plugins"
  import AddPluginModal from "./_components/AddPluginModal.svelte"
  import PluginNameRenderer from "./_components/PluginNameRenderer.svelte"
  import EditPluginRenderer from "./_components/EditPluginRenderer.svelte"
  import { routeActions } from "@/settings/pages"

  const schema = {
    name: {
      width: "2fr",
      minWidth: "200px",
    },
    version: {
      width: "1fr",
    },
    "schema.type": {
      width: "1fr",
      displayName: "Type",
      capitalise: true,
      minWidth: "120px",
    },
    edit: {
      width: "auto",
      displayName: "",
    },
  }
  const customRenderers = [
    { column: "name", component: PluginNameRenderer },
    { column: "edit", component: EditPluginRenderer },
  ]

  let modal: any
  let searchTerm: any = ""
  let filter: any = "all"
  let filterOptions = [
    { label: "All plugins", value: "all" },
    { label: "Components", value: "component" },
  ]

  const pluginUpdates = plugins.updates
  let applyingUpdates = false

  if (!$admin.cloud) {
    filterOptions.push({ label: "Datasources", value: "datasource" })
  }

  $: filteredPlugins = $plugins
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
    await plugins.load()
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
    <div use:routeActions class="controls">
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
      <Button size="M" on:click={modal.show} cta>Add plugin</Button>
    </div>

    {#if $plugins?.length}
      <Table
        {schema}
        data={filteredPlugins}
        allowEditColumns={false}
        allowEditRows={false}
        allowSelectRows={false}
        allowClickRows={false}
        {customRenderers}
      />
    {/if}
  </Layout>
</Layout>

<Modal bind:this={modal}>
  <AddPluginModal />
</Modal>

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

  @media (max-width: 640px) {
    .filters {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    .controls :global(.spectrum-Search) {
      width: auto;
    }
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
