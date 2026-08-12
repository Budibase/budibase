<script lang="ts">
  import { onMount } from "svelte"
  import { Button, Layout, Table } from "@budibase/bbui"
  import { bb } from "@/stores/bb"
  import { oauth2 } from "@/stores/builder/oauth2"
  import { workspaceConnections } from "@/stores/builder/workspaceConnection"
  import RouteActions from "@/settings/components/RouteActions.svelte"
  import EditConnectionRenderer from "./_components/EditConnectionRenderer.svelte"
  import IconRenderer from "./_components/IconRenderer.svelte"
  import TypeRenderer from "./_components/TypeRenderer.svelte"

  const customRenderers = [
    { column: "icon", component: IconRenderer },
    { column: "type", component: TypeRenderer },
    { column: "edit", component: EditConnectionRenderer },
  ]
  const schema = {
    icon: { width: "40px" },
    name: { width: "1fr" },
    type: { width: "200px" },
    edit: { width: "100px", align: "Right" },
  }

  onMount(async () => {
    await oauth2.fetch()
  })
</script>

<Layout noPadding gap="XS">
  <RouteActions>
    <Button
      size="M"
      cta
      on:click={() => bb.settings("/connections/api-connections/new")}
    >
      Create a custom connection
    </Button>
  </RouteActions>

  <section class="connections-list-section">
    <div class="section-title">Your connections</div>

    <Table
      compact
      data={$workspaceConnections.list}
      {schema}
      {customRenderers}
      hideHeader
      rounded
      allowClickRows={false}
      allowEditRows={false}
    />
  </section>
</Layout>

<style>
  .connections-list-section {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-l);
  }

  .section-title {
    color: var(--grey-7, #a2a2a2);
    font-size: 13px;
  }
</style>
