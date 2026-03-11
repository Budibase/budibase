<script lang="ts">
  import InfoDisplay from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import { bb } from "@/stores/bb"
  import {
    aiConfigsStore,
    featureFlags,
    knowledgeBaseStore,
    vectorDbStore,
  } from "@/stores/portal"
  import {
    Body,
    Button,
    Layout,
    notifications,
    ProgressCircle,
    Table,
  } from "@budibase/bbui"
  import { onMount } from "svelte"

  let knowledgeBases = $derived(
    [...$knowledgeBaseStore.list].sort((a, b) => a.name.localeCompare(b.name))
  )

  function createKnowledgeBase() {
    knowledgeBaseStore.clearFormDraft()
    bb.settings(`/ai-config/knowledge-bases/new`)
  }

  function editKnowledgeBase(row: { _id?: string }) {
    if (!row._id) {
      return
    }
    knowledgeBaseStore.clearFormDraft()
    bb.settings(`/ai-config/knowledge-bases/${row._id}`)
  }

  onMount(async () => {
    try {
      await Promise.all([
        aiConfigsStore.fetch(),
        knowledgeBaseStore.fetch(),
        vectorDbStore.fetch(),
      ])
    } catch {
      notifications.error("Error fetching AI settings")
    }
  })
</script>

<Layout noPadding gap="XS">
  {#if $featureFlags.AI_RAG}
    <div class="section-header">
      <div class="section-title">Knowledge bases</div>
      <Button size="S" icon="plus" on:click={() => createKnowledgeBase()}>
        Knowledge base
      </Button>
    </div>

    {#if $knowledgeBaseStore.loading && !$knowledgeBaseStore.loaded}
      <div class="loading-state">
        <ProgressCircle size="S" />
        <Body size="S">Loading knowledge bases...</Body>
      </div>
    {:else if knowledgeBases.length > 0}
      <Table
        compact
        data={knowledgeBases}
        schema={{
          name: {},
        }}
        hideHeader
        rounded
        allowClickRows={false}
        allowEditRows
        editColumnPosition="right"
        on:editrow={r => editKnowledgeBase(r.detail)}
      ></Table>
    {:else if $knowledgeBaseStore.loaded}
      <InfoDisplay body="No knowledge bases created yet"></InfoDisplay>
    {/if}
  {/if}
</Layout>

<style>
  .section-title {
    font-size: 13px;
    color: var(--grey-7, #a2a2a2);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }

  .loading-state {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: 24px 0;
  }
</style>
