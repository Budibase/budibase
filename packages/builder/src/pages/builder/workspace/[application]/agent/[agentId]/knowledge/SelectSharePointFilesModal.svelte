<script lang="ts">
  import {
    ActionButton,
    Body,
    Modal,
    ModalContent,
    TreeView,
    notifications,
  } from "@budibase/bbui"
  import {
    AgentKnowledgeSourceType,
    type KnowledgeSourceEntry,
  } from "@budibase/types"
  import { agentsStore, selectedAgent } from "@/stores/portal"
  import SharePointEntryTreeItem from "./SharePointEntryTreeItem.svelte"
  import {
    buildEntryTreeFromSourceEntries,
    buildPatternsFromSelection,
    collectSelectablePaths,
    flattenNodesByPath,
    rehydrateFromPatterns,
    wrapSelectionTreeWithSiteRoot,
  } from "./sharePointModalUtils"

  export interface Props {
    agentId?: string
    siteId?: string
  }

  let { agentId, siteId }: Props = $props()

  let syncMode = $state<"all" | "selective">("all")
  let selectedEntryPaths = $state<string[]>([])
  let hasHydratedSelection = $state(false)
  let loadingEntries = $state(false)
  let allEntries = $state<KnowledgeSourceEntry[]>([])
  let modal = $state<Modal>()

  const sharePointSource = $derived.by(() => {
    if (!siteId) {
      return undefined
    }
    return $selectedAgent?.knowledgeSources?.find(
      source =>
        source.type === AgentKnowledgeSourceType.SHAREPOINT &&
        source.config.site?.id === siteId
    )
  })

  const sourceId = $derived(sharePointSource?.id)
  const selectedSiteLabel = $derived(
    sharePointSource?.config.site?.name ||
      sharePointSource?.config.site?.webUrl ||
      siteId ||
      ""
  )
  const initialPatterns = $derived(
    sharePointSource?.config.filters?.patterns || []
  )

  const entryTree = $derived(buildEntryTreeFromSourceEntries(allEntries))
  const selectionTree = $derived(wrapSelectionTreeWithSiteRoot(entryTree))
  const selectablePaths = $derived(collectSelectablePaths(selectionTree))
  const selectionNodeByPath = $derived(flattenNodesByPath(selectionTree))

  const selectAllLabel = $derived(
    selectedEntryPaths.length === selectablePaths.length
      ? "Clear selection"
      : "Select all"
  )
  const selectedCountLabel = $derived(`${selectedEntryPaths.length} selected`)

  const loadAllEntries = async () => {
    if (!agentId || !siteId) {
      return
    }
    loadingEntries = true
    try {
      const response = await agentsStore.fetchAgentKnowledgeSourceAllEntries(
        agentId,
        siteId
      )
      allEntries = response.entries
    } finally {
      loadingEntries = false
    }
  }

  export async function show() {
    const hasInitialFilters = initialPatterns.length > 0
    syncMode = hasInitialFilters ? "selective" : "all"
    selectedEntryPaths = []
    hasHydratedSelection = false

    await loadAllEntries()

    if (hasInitialFilters) {
      selectedEntryPaths = rehydrateFromPatterns(
        initialPatterns,
        selectablePaths
      )
    } else if (syncMode === "selective") {
      selectedEntryPaths = [...selectablePaths]
    }

    modal?.show()
  }

  export function hide() {
    modal?.hide()
  }

  const handleConfirm = async () => {
    if (!agentId || !siteId) {
      return
    }
    if (syncMode === "selective" && selectedEntryPaths.length === 0) {
      notifications.error("Please select at least one folder/file to sync")
      return
    }

    const filters =
      syncMode === "all"
        ? undefined
        : buildPatternsFromSelection(
            selectedEntryPaths,
            selectablePaths,
            selectionNodeByPath
          )

    try {
      await agentsStore.applyAgentSharePointSiteFilters(agentId, siteId, {
        filters,
      })
      notifications.success("SharePoint folders/files updated")
      hide()
    } catch (error) {
      console.error(error)
      notifications.error("Failed to update SharePoint files")
    }
  }

  const toggleEntryPaths = (paths: string[], nextSelected: boolean) => {
    const nextPaths = new Set(selectedEntryPaths)
    for (const path of paths) {
      if (nextSelected) {
        nextPaths.add(path)
      } else {
        nextPaths.delete(path)
      }
    }
    selectedEntryPaths = Array.from(nextPaths)
  }

  const toggleAll = () => {
    const allPathSet = new Set(selectablePaths)
    const selectedPathCount = selectedEntryPaths.filter(path =>
      allPathSet.has(path)
    ).length

    if (selectedPathCount === selectablePaths.length) {
      selectedEntryPaths = []
      return
    }

    selectedEntryPaths = [...selectablePaths]
  }

  $effect(() => {
    if (hasHydratedSelection || syncMode !== "selective") {
      return
    }

    selectedEntryPaths = rehydrateFromPatterns(
      initialPatterns,
      selectablePaths,
      selectedEntryPaths
    )

    if (selectablePaths.length > 0 || initialPatterns.length === 0) {
      hasHydratedSelection = true
    }
  })
</script>

<Modal bind:this={modal}>
  <ModalContent
    custom
    showCloseIcon={false}
    showDivider={false}
    showConfirmButton
    confirmText="Save"
    cancelText="Cancel"
    disabled={!sourceId}
    onConfirm={handleConfirm}
    onCancel={hide}
  >
    <div class="content">
      <div class="title">
        <Body size="S">SharePoint - {selectedSiteLabel}</Body>
      </div>

      <div class="scope-controls card">
        <div class="scope-header">
          <Body size="S">Sync scope</Body>
        </div>
        <div class="scope-options">
          <ActionButton
            size="S"
            selected={syncMode === "all"}
            on:click={() => {
              syncMode = "all"
            }}
          >
            Sync all files
          </ActionButton>
          <ActionButton
            size="S"
            selected={syncMode === "selective"}
            on:click={() => {
              syncMode = "selective"
              if (selectedEntryPaths.length === 0) {
                selectedEntryPaths = [...selectablePaths]
              }
            }}
          >
            Selective sync
          </ActionButton>
        </div>
      </div>

      {#if syncMode === "selective"}
        <div class="entries-header">
          <Body size="M">Select folders/files to sync</Body>
          <ActionButton quiet size="S" on:click={toggleAll}>
            {selectAllLabel}
          </ActionButton>
          <span class="selected-count">{selectedCountLabel}</span>
        </div>

        {#if loadingEntries}
          <Body size="S">Loading SharePoint files...</Body>
        {:else if selectionTree.length === 0}
          <Body size="S">No folders or files found for this site.</Body>
        {:else}
          <div class="entries-list">
            <TreeView width="100%" standalone={false} selectable quiet>
              {#each selectionTree as node (node.path)}
                <SharePointEntryTreeItem
                  {node}
                  selectedPaths={selectedEntryPaths}
                  onTogglePaths={toggleEntryPaths}
                />
              {/each}
            </TreeView>
          </div>
        {/if}
      {/if}
    </div>
  </ModalContent>
</Modal>

<style>
  .content {
    padding: var(--spacing-l);
    width: min(760px, 95vw);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .title {
    padding-bottom: var(--spacing-xxs);
  }

  .card {
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 8px;
    background: var(--spectrum-global-color-gray-100);
  }

  .scope-controls {
    margin-top: var(--spacing-xs);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    padding: var(--spacing-s);
  }

  .scope-header {
    display: flex;
    align-items: center;
  }

  .scope-options {
    display: flex;
    gap: var(--spacing-xs);
  }

  .scope-options :global(button) {
    border-radius: 999px;
  }

  .entries-header {
    margin-top: var(--spacing-xxs);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .entries-header :global(.spectrum-ActionButton:first-of-type) {
    margin-left: auto;
  }

  .selected-count {
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
  }

  .entries-list {
    margin-top: var(--spacing-xxs);
    max-height: 420px;
    overflow: auto;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 8px;
    padding: var(--spacing-xs);
    background: var(--spectrum-global-color-gray-100);
  }

  .entries-list :global(.spectrum-TreeView-itemLink) {
    min-height: 30px;
    border-radius: 6px;
    padding-inline-end: 8px;
  }
</style>
