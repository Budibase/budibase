<script lang="ts">
  import {
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
  } from "@budibase/types"
  import SharePointEntryTreeItem from "./SharePointEntryTreeItem.svelte"
  import type { SharePointEntryTreeNode } from "./sharePointEntryTree"
  import { agentsStore, selectedAgent } from "@/stores/portal"
  import { toSharePointDisplayStatusFromFile } from "./sharePointStatus"

  export interface Props {
    agentId?: string
    siteId?: string
  }

  let { agentId, siteId }: Props = $props()
  let selectedEntryPaths = $state<string[]>([])
  let syncMode = $state<"all" | "selective">("all")
  let includeNewFiles = $state(false)
  let scopeEditMode = $state(false)

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
  const initialIncludePaths = $derived(
    sharePointSource?.config.filters?.includePaths || []
  )
  const initialExcludePaths = $derived(
    sharePointSource?.config.filters?.excludePaths || []
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

  const getFilePath = (file: KnowledgeBaseFile) =>
    (file.sourcePath || file.filename).trim()

  let sharePointFiles = $derived.by(() => {
    if (!agentId || !sourceId) {
      return [] as KnowledgeBaseFile[]
    }

    const files = $agentsStore.knowledgeByAgentId[agentId]?.files || []
    return getKnowledgeSourceFiles(files, sourceId, siteId)
  })
  let sourceRun = $derived.by(() => {
    if (!agentId || !sourceId) {
      return undefined
    }
    const runs = $agentsStore.knowledgeByAgentId[agentId]?.sourceRuns || []
    return runs.find(run => run.sourceId === sourceId)
  })
  let showProcessingState = $derived.by(() => {
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

  let modal = $state<Modal>()

  export function show() {
    const hasInitialFilters =
      initialIncludePaths.length > 0 || initialExcludePaths.length > 0
    syncMode = hasInitialFilters ? "selective" : "all"
    includeNewFiles =
      initialExcludePaths.length > 0 && initialIncludePaths.length === 0
    if (includeNewFiles) {
      const excludedPathSet = new Set(initialExcludePaths)
      selectedEntryPaths = selectablePaths.filter(
        path => !excludedPathSet.has(path)
      )
    } else if (initialIncludePaths.length > 0) {
      selectedEntryPaths = [...initialIncludePaths]
    } else if (syncMode === "selective") {
      selectedEntryPaths = [...selectablePaths]
    } else {
      selectedEntryPaths = []
    }
    scopeEditMode = false
    modal?.show()
  }

  export function hide() {
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
      notifications.error("Please select at least one folder/file to sync")
      return
    }

    const allPaths = Array.from(
      new Set(sharePointFiles.map(file => getFilePath(file)))
    )
    const selectedPaths = selectedEntryPaths
    const excludedPaths = allPaths.filter(path => !selectedPaths.includes(path))

    let filters:
      | { includePaths?: string[]; excludePaths?: string[] }
      | undefined
    if (syncMode === "all") {
      filters = undefined
    } else if (includeNewFiles) {
      filters =
        excludedPaths.length > 0 ? { excludePaths: excludedPaths } : undefined
    } else {
      filters =
        selectedPaths.length > 0 ? { includePaths: selectedPaths } : undefined
    }

    try {
      await agentsStore.updateAgentSharePointSite(agentId, siteId, {
        filters: {
          includePaths: filters?.includePaths,
          excludePaths: filters?.excludePaths,
        },
      })
      await agentsStore.fetchAgentKnowledgeSourceOptions(agentId)
      await agentsStore.fetchAgentFiles(agentId)
      await agentsStore.fetchAgents()
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

  const buildEntryTree = (
    files: KnowledgeBaseFile[]
  ): SharePointEntryTreeNode[] => {
    const roots: SharePointEntryTreeNode[] = []
    const byPath = new Map<string, SharePointEntryTreeNode>()

    for (const file of [...files].sort((a, b) =>
      getFilePath(a).localeCompare(getFilePath(b))
    )) {
      const path = getFilePath(file)
      if (!path) {
        continue
      }
      const parts = path.split("/").filter(Boolean)
      let parent = roots
      let currentPath = ""

      for (let i = 0; i < parts.length; i++) {
        const segment = parts[i]
        currentPath = currentPath ? `${currentPath}/${segment}` : segment
        const isLeaf = i === parts.length - 1
        let node = byPath.get(currentPath)
        if (!node) {
          node = {
            id: currentPath,
            name: segment,
            path: currentPath,
            type: isLeaf ? "file" : "folder",
            status: isLeaf
              ? toSharePointDisplayStatusFromFile(file.status)
              : undefined,
            children: [],
          }
          byPath.set(currentPath, node)
          parent.push(node)
        } else if (isLeaf) {
          node.type = "file"
          node.status = toSharePointDisplayStatusFromFile(file.status)
        }
        parent = node.children
      }
    }

    const sortNodes = (nodes: SharePointEntryTreeNode[]) => {
      nodes.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "folder" ? -1 : 1
        }
        return a.name.localeCompare(b.name)
      })
      for (const node of nodes) {
        sortNodes(node.children)
      }
    }
    sortNodes(roots)
    return roots
  }

  const entryTree = $derived(buildEntryTree(sharePointFiles))

  const selectablePaths = $derived(
    sharePointFiles.map(file => getFilePath(file))
  )

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
        <div class="scope-controls">
          <Body size="S">Sync scope</Body>
          <div class="scope-options">
            <label>
              <input
                type="radio"
                name="sharepoint-sync-mode"
                checked={syncMode === "all"}
                onchange={() => {
                  syncMode = "all"
                  includeNewFiles = false
                }}
              />
              Sync all files
            </label>
            <label>
              <input
                type="radio"
                name="sharepoint-sync-mode"
                checked={syncMode === "selective"}
                onchange={() => {
                  syncMode = "selective"
                  if (includeNewFiles) {
                    const excludedPathSet = new Set(initialExcludePaths)
                    selectedEntryPaths = selectablePaths.filter(
                      path => !excludedPathSet.has(path)
                    )
                  } else if (selectedEntryPaths.length === 0) {
                    selectedEntryPaths = [...selectablePaths]
                  }
                }}
              />
              Selective sync
            </label>
          </div>
        </div>
      {/if}

      {#if showEntrySelection}
        {#if syncMode === "selective"}
          <div class="include-new-toggle">
            <label>
              <input
                type="checkbox"
                checked={includeNewFiles}
                onchange={event => {
                  includeNewFiles = (event.currentTarget as HTMLInputElement)
                    .checked
                  if (includeNewFiles) {
                    const excludedPathSet = new Set(initialExcludePaths)
                    selectedEntryPaths = selectablePaths.filter(
                      path => !excludedPathSet.has(path)
                    )
                  }
                }}
              />
              Include new files by default
            </label>
          </div>
        {/if}

        <div class="entries-header">
          <Body size="S">
            {#if scopeEditMode}
              {#if syncMode === "all"}
                All files will be synced
              {:else}
                Select folders/files to sync
              {/if}
            {/if}
          </Body>
          {#if !scopeEditMode}
            <button
              class="link-btn"
              onclick={event => {
                event.preventDefault()
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
            </button>
          {/if}
          {#if allowSelection}
            <button
              class="link-btn"
              onclick={event => {
                event.preventDefault()
                toggleAll()
              }}
              disabled={syncMode !== "selective"}
            >
              {selectAllLabel}
            </button>
            <span class="selected-count">{selectedCountLabel}</span>
          {/if}
        </div>

        {#if sharePointFiles.length === 0}
          <Body size="S">
            {showProcessingState
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
              {#each entryTree as node (node.path)}
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
  }

  .title {
    padding-bottom: var(--spacing-s);
  }

  .entries-header {
    margin-top: var(--spacing-s);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .scope-controls {
    margin-top: var(--spacing-s);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .scope-options {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xxs);
    font-size: 12px;
  }

  .include-new-toggle {
    margin-top: var(--spacing-xs);
    font-size: 12px;
  }

  .entries-list {
    margin-top: var(--spacing-xxs);
    max-height: 420px;
    overflow: auto;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    padding: var(--spacing-xs);
  }

  .link-btn {
    margin-left: auto;
    border: none;
    background: none;
    color: var(--spectrum-global-color-blue-600);
    cursor: pointer;
    font-size: 12px;
  }

  .selected-count {
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
  }
</style>
