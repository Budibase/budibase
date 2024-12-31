<script>
  import Panel from "@/components/design/Panel.svelte"
  import { ActionButton } from "@budibase/bbui"
  import JSONPanel from "./JSONPanel.svelte"
  import SchemaPanel from "./SchemaPanel.svelte"
  import PreviewPanel from "./PreviewPanel.svelte"

  export let rows
  export let schema
  export let onSchemaChange = () => {}
  export let onClose = () => {}

  const tabs = ["JSON", "Schema", "Preview"]
  let activeTab = "JSON"
</script>

<Panel
  showCloseButton
  closeButtonIcon="RailRightClose"
  onClickCloseButton={onClose}
  title="Query results"
  icon={"SQLQuery"}
  borderLeft
  extraWide
>
  <div slot="panel-header-content">
    <div class="settings-tabs">
      {#each tabs as tab}
        <ActionButton
          size="M"
          quiet
          selected={activeTab === tab}
          on:click={() => {
            activeTab = tab
          }}
        >
          {tab}
        </ActionButton>
      {/each}
    </div>
  </div>
  <div class="content">
    {#if activeTab === "JSON"}
      <JSONPanel data={rows?.length === 1 ? rows[0] : rows || {}} />
    {:else if activeTab === "Schema"}
      <SchemaPanel {onSchemaChange} {schema} />
    {:else}
      <PreviewPanel {schema} {rows} />
    {/if}
  </div>
</Panel>

<style>
  .settings-tabs {
    display: flex;
    gap: var(--spacing-s);
    padding: 0 var(--spacing-l);
    padding-bottom: var(--spacing-l);
  }

  .content {
    padding: 14px;
    height: 100%;
    overflow: scroll;
  }
</style>
