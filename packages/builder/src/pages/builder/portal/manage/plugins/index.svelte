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
  import { plugins } from "stores/portal"
  import PluginRow from "./_components/PluginRow.svelte"
  import AddPluginModal from "./_components/AddPluginModal.svelte"

  let modal
  let searchTerm = ""

  let filterOptions = [
    { label: "All Plugins", value: "all" },
    { label: "Components", value: "datasource" },
    { label: "Datasources", value: "component" },
  ]
  let filter = "all"
  $: filteredPlugins =
    filter === "all" && searchTerm.length === 0
      ? $plugins
      : $plugins
          .filter(plugin => plugin.schema.type !== filter)
          .filter(plugin =>
            plugin?.name?.toLowerCase().includes(searchTerm.toLowerCase())
          )

  onMount(async () => {
    await plugins.load()
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <div style="display: flex;">
      <Heading size="M">Plugins</Heading>
    </div>
    <Body>Add your own custom datasources and components</Body>
    <Divider />
  </Layout>
  <Layout noPadding>
    <div class="align-buttons">
      <div>
        <Button on:click={modal.show} newStyles cta icon={"Add"}
          >Add plugin</Button
        >
      </div>
      <div class="filters">
        <div class="select">
          <Select
            bind:value={filter}
            placeholder={null}
            options={filterOptions}
          />
        </div>

        <Search bind:value={searchTerm} />
      </div>
    </div>

    {#if $plugins}
      {#each filteredPlugins as plugin}
        <PluginRow {plugin} />
      {/each}
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
  .align-buttons {
    margin-top: -10px;
    display: flex;
    column-gap: var(--spacing-xl);
    justify-content: space-between;
  }

  .select {
    flex-basis: 180px;
  }
</style>
