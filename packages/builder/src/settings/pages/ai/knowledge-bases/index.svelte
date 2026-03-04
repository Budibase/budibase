<script lang="ts">
  import { bb } from "@/stores/bb"
  import {
    aiConfigsStore,
    featureFlags,
    knowledgeBaseStore,
    vectorDbStore,
  } from "@/stores/portal"
  import { Body, Button, Layout, notifications, Table } from "@budibase/bbui"
  import { onMount } from "svelte"

  let knowledgeBases = $derived(
    [...$knowledgeBaseStore.configs].sort((a, b) =>
      a.name.localeCompare(b.name)
    )
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

<Layout noPadding gap="S">
  {#if $featureFlags.AI_RAG}
    <div class="section">
      <div class="section-header">
        <div class="section-title">Knowledge bases</div>
        <Button size="S" icon="plus" on:click={() => createKnowledgeBase()}>
          Knowledge base
        </Button>
      </div>

      {#if knowledgeBases.length}
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
          on:editrow={r => editKnowledgeBase(r.detail)}
        ></Table>
      {:else}
        <div class="no-enabled">
          <Body size="XS">No knowledge bases created yet</Body>
        </div>
      {/if}
    </div>
  {/if}
</Layout>

<style>
  .no-enabled {
    padding: 16px;
    background-color: var(--grey-1);
    border: 1px solid var(--grey-4);
    border-radius: var(--border-radius-m);
  }

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

  .section-header .section-title {
    margin-bottom: 0;
  }
</style>
