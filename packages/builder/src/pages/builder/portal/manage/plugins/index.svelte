<script>
  import {
    Layout,
    Heading,
    Body,
    Button,
    Select,
    Divider,
    Modal,
    Search,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { plugins, admin } from "stores/portal"
  import PluginRow from "./_components/PluginRow.svelte"
  import AddPluginModal from "./_components/AddPluginModal.svelte"

  let modal
  let searchTerm = ""
  let filter = "all"
  let filterOptions = [
    { label: "All plugins", value: "all" },
    { label: "Components", value: "component" },
  ]

  if (!$admin.cloud) {
    filterOptions.push({ label: "Datasources", value: "datasource" })
  }

  $: filteredPlugins = $plugins
    .filter(plugin => {
      return filter === "all" || plugin.schema.type === filter
    })
    .filter(plugin => {
      return (
        !searchTerm ||
        plugin?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

  onMount(async () => {
    await plugins.load()
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading size="M">Plugins</Heading>
    <Body>Add your own custom datasources and components</Body>
  </Layout>
  <Divider size="S" />
  <Layout noPadding>
    <div class="controls">
      <div>
        <Button on:click={modal.show} newStyles cta icon={"Add"}>
          Add plugin
        </Button>
      </div>
      <div class="filters">
        <div class="select">
          <Select
            bind:value={filter}
            placeholder={null}
            options={filterOptions}
            autoWidth
            quiet
          />
        </div>
        <Search bind:value={searchTerm} placeholder="Search plugins" />
      </div>
    </div>
    {#if filteredPlugins?.length}
      <Layout noPadding gap="S">
        {#each filteredPlugins as plugin (plugin._id)}
          <PluginRow {plugin} />
        {/each}
      </Layout>
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
  }
  .controls :global(.spectrum-Search) {
    width: 200px;
  }
</style>
