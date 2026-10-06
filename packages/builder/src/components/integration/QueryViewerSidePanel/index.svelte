<script module lang="ts">
  export type QueryResultTab = "JSON" | "Schema" | "Preview"
</script>

<script lang="ts">
  import type { JSONValue, QuerySchema } from "@budibase/types"
  import Panel from "@/components/design/Panel.svelte"
  import { ActionButton } from "@budibase/bbui"
  import JSONPanel from "./JSONPanel.svelte"
  import SchemaPanel from "./SchemaPanel.svelte"
  import PreviewPanel from "./PreviewPanel.svelte"

  interface Props {
    rows?: JSONValue[]
    schema: Record<string, QuerySchema | string>
    onSchemaChange?: (_schema?: Record<string, QuerySchema | string>) => void
    onClose?: () => void
    activeTab?: QueryResultTab
  }

  let {
    rows = [],
    schema,
    onSchemaChange = () => {},
    onClose = () => {},
    activeTab = $bindable("JSON"),
  }: Props = $props()

  const tabs: QueryResultTab[] = ["JSON", "Schema", "Preview"]
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
