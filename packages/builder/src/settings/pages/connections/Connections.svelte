<script lang="ts">
  import { onMount } from "svelte"
  import { bb } from "@/stores/bb"
  import { Layout, Table, Button, CollapsibleSearch } from "@budibase/bbui"
  import RouteActions from "@/settings/components/RouteActions.svelte"
  import { oauth2 } from "@/stores/builder/oauth2"
  import { workspaceConnections } from "@/stores/builder/workspaceConnection"
  import EditConnectionRenderer from "./_components/EditConnectionRenderer.svelte"
  import IconRenderer from "./_components/IconRenderer.svelte"
  import TypeRenderer from "./_components/TypeRenderer.svelte"

  const customRenderers = [
    { column: "edit", component: EditConnectionRenderer },
    { column: "icon", component: IconRenderer },
    { column: "type", component: TypeRenderer },
  ]
  const schema = {
    icon: { width: "auto", displayName: "" },
    name: {
      sortable: true,
    },
    type: {
      sortable: true,
    },
    edit: {
      width: "auto",
      displayName: "",
    },
  }

  let searchValue = ""

  $: loading = $workspaceConnections.loading
  $: allConnections = $workspaceConnections.list
  $: filteredConnections = searchValue
    ? allConnections.filter(c =>
        c.name?.toLowerCase().includes(searchValue.toLowerCase())
      )
    : allConnections

  onMount(async () => {
    await Promise.all([oauth2.fetch(), workspaceConnections.fetch()])
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <RouteActions>
      <div class="header-buttons">
        <CollapsibleSearch
          placeholder="Search"
          value={searchValue}
          on:change={event => (searchValue = event.detail)}
        />
        <Button
          size="M"
          on:click={() => bb.settings("/connections/create")}
          cta
        >
          Add connection
        </Button>
      </div>
    </RouteActions>
    <div class="setting-spacing">
      <Table
        hideHeader
        rounded
        data={filteredConnections}
        {loading}
        {schema}
        {customRenderers}
        allowEditRows={false}
        allowEditColumns={false}
      />
    </div>
  </Layout>
</Layout>

<style>
  .header-buttons {
    display: flex;
    gap: var(--spacing-m);
  }
</style>
