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
    KnowledgeBaseFileStatus,
    type KnowledgeBaseFile,
    type KnowledgeSourceEntry,
  } from "@budibase/types"
  import { agentsStore, selectedAgent } from "@/stores/portal"
  import SharePointEntryTreeItem from "./SharePointEntryTreeItem.svelte"
  import {
    buildEntryTree,
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

  let selectedEntryPaths = $state<string[]>([])
  let syncMode = $state<"all" | "selective">("all")
  let scopeEditMode = $state(false)
  let isOpen = $state(false)
  let hasHydratedSelection = $state(false)
  let loadingSourceEntries = $state(false)
  let loadingAllSourceEntries = $state(false)
  let allSourceEntries = $state<KnowledgeSourceEntry[] | undefined>()
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

  const getKnowledgeSourceFiles = (
    files: KnowledgeBaseFile[],
    knowledgeSourceId?: string,
    sharePointSiteId?: string
  ): KnowledgeBaseFile[] =>
    files.filter(file => {
      if (knowledgeSourceId && file.knowledgeSourceId === knowledgeSourceId) {
        return true
      }
      return (
        !!sharePointSiteId &&
        !!file.originFileId?.startsWith(`sharepoint:${sharePointSiteId}:`)
      )
    })

  const sharePointFiles = $derived.by(() => {
    if (!agentId || !sourceId) {
      return [] as KnowledgeBaseFile[]
    }

    const files = $agentsStore.knowledgeByAgentId[agentId]?.files || []
    return getKnowledgeSourceFiles(files, sourceId, siteId)
  })

  const sourceRun = $derived.by(() => {
    if (!agentId || !sourceId) {
      return undefined
    }
    const runs = $agentsStore.knowledgeByAgentId[agentId]?.sourceRuns || []
    return runs.find(run => run.sourceId === sourceId)
  })

  const sourceEntriesResponse = $derived.by(() => {
    if (!agentId || !siteId) {
      return undefined
    }
    return $agentsStore.knowledgeByAgentId[agentId]?.sourceEntriesBySiteId?.[
      siteId
    ]
  })

  const sourceEntries = $derived(sourceEntriesResponse?.entries || [])

  const showProcessingState = $derived.by(() => {
    if (!sourceId) {
      return false
    }
    if (!sourceRun) {
      return true
    }
    return sharePointFiles.some(
      file => file.status === KnowledgeBaseFileStatus.PROCESSING
    )
  })

  const loadSourceEntries = async () => {
    if (!agentId || !siteId) {
      return
    }

    loadingSourceEntries = true
    try {
      await agentsStore.fetchAgentKnowledgeSourceEntries(agentId, siteId)
    } finally {
      loadingSourceEntries = false
    }
  }

  const loadAllSourceEntries = async () => {
    if (!agentId || !siteId) {
      return
    }
    loadingAllSourceEntries = true
    try {
      const response = await agentsStore.fetchAgentKnowledgeSourceAllEntries(
        agentId,
        siteId
      )
      allSourceEntries = response.entries
    } finally {
      loadingAllSourceEntries = false
    }
  }

  export function show() {
    const hasInitialFilters = initialPatterns.length > 0
    syncMode = hasInitialFilters ? "selective" : "all"
    selectedEntryPaths = hasInitialFilters
      ? rehydrateFromPatterns(initialPatterns, selectablePaths)
      : syncMode === "selective"
        ? [...selectablePaths]
        : []

    hasHydratedSelection = false
    isOpen = true
    scopeEditMode = false
    allSourceEntries = undefined

    loadSourceEntries().catch(error => {
      console.error(error)
      notifications.error("Failed to load SharePoint files")
    })

    modal?.show()
  }

  export function hide() {
    isOpen = false
    allSourceEntries = undefined
    modal?.hide()
  }

  const handleConfirm = async () => {
    if (!scopeEditMode) {
      hide()
      return
    }
    if (!agentId || !siteId) {
      return
    }
    if (syncMode === "selective" && selectedEntryPaths.length === 0) {
      notifications.error("Please select at least one folder to sync")
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
      notifications.error("Failed to sync SharePoint")
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

  const entryTree = $derived(
    buildEntryTree(
      sharePointFiles.map(file => ({
        filename: file.filename,
        sourcePath: file.sourcePath,
        status: file.status,
        errorMessage: file.errorMessage,
      })),
      sourceRun?.entries || []
    )
  )

  const sourceEntriesTree = $derived(
    buildEntryTreeFromSourceEntries(sourceEntries)
  )
  const allSourceEntriesTree = $derived(
    buildEntryTreeFromSourceEntries(allSourceEntries || [])
  )

  const selectionTreeBase = $derived(
    scopeEditMode && syncMode === "selective" && allSourceEntries
      ? allSourceEntriesTree
      : sourceEntriesTree.length > 0
        ? sourceEntriesTree
        : entryTree
  )
  const selectionTree = $derived(
    wrapSelectionTreeWithSiteRoot(selectionTreeBase)
  )
  const selectablePaths = $derived(collectSelectablePaths(selectionTree))
  const selectionNodeByPath = $derived(flattenNodesByPath(selectionTree))

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

  const selectAllLabel = $derived(
    selectedEntryPaths.length === selectablePaths.length
      ? "Clear selection"
      : "Select all"
  )
  const selectedCountLabel = $derived(`${selectedEntryPaths.length} selected`)
  const showScopeControls = $derived(scopeEditMode && !!sourceId)
  const showEntrySelection = $derived(!!sourceId)
  const allowSelection = $derived(scopeEditMode && syncMode === "selective")

  const displayTree = $derived.by(() => {
    if (allowSelection) {
      return selectionTree
    }
    if (syncMode === "selective") {
      return sourceEntriesTree
    }
    return entryTree
  })

  $effect(() => {
    if (!isOpen || hasHydratedSelection || syncMode !== "selective") {
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
    showConfirmButton={scopeEditMode}
    confirmText={scopeEditMode ? "Save" : "Close"}
    cancelText={scopeEditMode ? "Cancel" : "Close"}
    disabled={!sourceId}
    onConfirm={handleConfirm}
    onCancel={hide}
  >
    <div class="content">
      <div class="title">
        <Body size="S">SharePoint - {selectedSiteLabel}</Body>
      </div>

      {#if showScopeControls}
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
      {/if}

      {#if showEntrySelection}
        <div class="entries-header">
          <Body size="M">
            {#if scopeEditMode}
              {#if syncMode === "all"}
                All files will be synced
              {:else}
                Select folders to sync
              {/if}
            {/if}
          </Body>
          {#if !scopeEditMode}
            <ActionButton
              quiet
              size="S"
              loading={loadingAllSourceEntries}
              on:click={async () => {
                await loadAllSourceEntries()
                scopeEditMode = true
                if (
                  syncMode === "selective" &&
                  selectedEntryPaths.length === 0
                ) {
                  selectedEntryPaths = [...selectablePaths]
                }
              }}
            >
              Edit files
            </ActionButton>
          {/if}
          {#if allowSelection}
            <ActionButton
              quiet
              size="S"
              on:click={() => {
                toggleAll()
              }}
              disabled={syncMode !== "selective"}
            >
              {selectAllLabel}
            </ActionButton>
            <span class="selected-count">{selectedCountLabel}</span>
          {/if}
        </div>

        {#if allowSelection && (loadingSourceEntries || loadingAllSourceEntries)}
          <Body size="S">Loading SharePoint files...</Body>
        {:else if displayTree.length === 0}
          <Body size="S">
            {allowSelection
              ? "No folders or files found for this site."
              : showProcessingState
                ? "SharePoint sync is in progress. Files will appear here shortly."
                : "No folders or files found for this site."}
          </Body>
        {:else}
          <div class="entries-list">
            <TreeView
              width="100%"
              standalone={false}
              selectable={allowSelection}
              quiet
            >
              {#each displayTree as node (node.path)}
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

  .entries-header {
    margin-top: var(--spacing-xxs);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
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

  .entries-header :global(.spectrum-ActionButton:first-of-type) {
    margin-left: auto;
  }

  .selected-count {
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
  }
</style>
