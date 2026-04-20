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
  } from "@budibase/types"
  import SharePointEntryTreeItem from "./SharePointEntryTreeItem.svelte"
  import type { SharePointEntryTreeNode } from "./sharePointEntryTree"
  import { agentsStore, selectedAgent } from "@/stores/portal"
  import {
    toSharePointDisplayStatusFromFile,
    toSharePointDisplayStatusFromSyncEntry,
    isSelectableSharePointStatus,
    type SharePointDisplayStatus,
  } from "./sharePointStatus"

  export interface Props {
    agentId?: string
    siteId?: string
  }

  const SITE_ROOT_PATH = "__site_root__"
  let { agentId, siteId }: Props = $props()
  let selectedEntryPaths = $state<string[]>([])
  let syncMode = $state<"all" | "selective">("all")
  let scopeEditMode = $state(false)
  let isOpen = $state(false)
  let hasHydratedSelection = $state(false)

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
  const initialPatterns = $derived(sharePointSource?.config.filters?.patterns || [])

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

  const toPatternFolderPath = (rawPattern: string) => {
    if (!rawPattern || rawPattern.startsWith("!")) {
      return undefined
    }
    const pattern = rawPattern.trim()
    if (!pattern) {
      return undefined
    }
    return pattern.endsWith("/**") ? pattern.slice(0, -3) : pattern
  }

  const rehydrateFromPatterns = (
    patterns: string[],
    folders: string[],
    currentSelection: string[] = []
  ) => {
    const folderSet = new Set(folders)
    const nextSelection = new Set<string>()

    for (const rawPattern of patterns) {
      const normalizedPattern = toPatternFolderPath(rawPattern)
      if (!normalizedPattern) {
        continue
      }
      if (folderSet.has(normalizedPattern)) {
        nextSelection.add(normalizedPattern)
        continue
      }

      const parentMatch = folders
        .filter(path => normalizedPattern.startsWith(`${path}/`))
        .sort((a, b) => b.length - a.length)[0]
      if (parentMatch) {
        nextSelection.add(parentMatch)
      }
    }

    if (nextSelection.size > 0) {
      return Array.from(nextSelection)
    }

    if (folders.length === 0) {
      return patterns.map(toPatternFolderPath).filter(Boolean) as string[]
    }

    return currentSelection
      .filter(path => folderSet.has(path))
      .sort((a, b) => a.localeCompare(b))
  }

  export function show() {
    const hasInitialFilters = initialPatterns.length > 0
    syncMode = hasInitialFilters ? "selective" : "all"
    if (initialPatterns.length > 0) {
      selectedEntryPaths = rehydrateFromPatterns(initialPatterns, selectablePaths)
    } else if (syncMode === "selective") {
      selectedEntryPaths = [...selectablePaths]
    } else {
      selectedEntryPaths = []
    }
    hasHydratedSelection = false
    isOpen = true
    scopeEditMode = false
    modal?.show()
  }

  export function hide() {
    isOpen = false
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

    let filters: { patterns?: string[] } | undefined
    const selectedWithoutRoot = selectedEntryPaths.filter(
      path => path !== SITE_ROOT_PATH
    )
    const selectableWithoutRoot = selectablePaths.filter(
      path => path !== SITE_ROOT_PATH
    )
    const hasSelectedSiteRoot = selectedEntryPaths.includes(SITE_ROOT_PATH)
    const isEffectivelySelectAll =
      hasSelectedSiteRoot &&
      selectableWithoutRoot.length > 0 &&
      selectedWithoutRoot.length === selectableWithoutRoot.length

    if (syncMode === "all" || isEffectivelySelectAll) {
      filters = undefined
    } else {
      const patterns = selectedWithoutRoot
        .map(path => {
          const node = selectionNodeByPath.get(path)
          if (node?.type === "file") {
            return path
          }
          return `${path}/**`
        })
      filters = patterns.length > 0 ? { patterns } : undefined
    }

    try {
      await agentsStore.updateAgentSharePointSite(agentId, siteId, {
        filters: {
          patterns: filters?.patterns,
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
    const fileNodesByPath = new Map<
      string,
      { path: string; status: SharePointDisplayStatus; errorMessage?: string }
    >()
    for (const file of files) {
      const path = getFilePath(file)
      if (!path) {
        continue
      }
      fileNodesByPath.set(path, {
        path,
        status: toSharePointDisplayStatusFromFile(file.status),
        errorMessage: file.errorMessage,
      })
    }

    for (const entry of sourceRun?.entries || []) {
      const path = (entry.path || "").trim()
      if (!path) {
        continue
      }

      const existing = fileNodesByPath.get(path)
      const displayStatus = toSharePointDisplayStatusFromSyncEntry(entry.status)
      if (!existing) {
        if (displayStatus === "failed") {
          fileNodesByPath.set(path, {
            path,
            status: displayStatus,
            errorMessage: entry.errorMessage,
          })
        }
        continue
      }

      if (!existing.errorMessage && entry.errorMessage) {
        existing.errorMessage = entry.errorMessage
      }
    }

    const roots: SharePointEntryTreeNode[] = []
    const byPath = new Map<string, SharePointEntryTreeNode>()

    for (const fileNode of [...fileNodesByPath.values()].sort((a, b) =>
      a.path.localeCompare(b.path)
    )) {
      const path = fileNode.path
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
            status: isLeaf ? fileNode.status : undefined,
            errorMessage: isLeaf ? fileNode.errorMessage : undefined,
            children: [],
          }
          byPath.set(currentPath, node)
          parent.push(node)
        } else if (isLeaf) {
          node.type = "file"
          node.status = fileNode.status
          node.errorMessage = fileNode.errorMessage
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

  const wrapSelectionTreeWithSiteRoot = (
    nodes: SharePointEntryTreeNode[]
  ): SharePointEntryTreeNode[] => {
    if (nodes.length === 0) {
      return []
    }

    return [
      {
        id: SITE_ROOT_PATH,
        name: "Site root",
        path: SITE_ROOT_PATH,
        type: "folder",
        children: nodes,
      },
    ]
  }

  const collectSelectablePaths = (nodes: SharePointEntryTreeNode[]): string[] => {
    const paths: string[] = []
    for (const node of nodes) {
      if (
        node.type === "folder" ||
        (node.type === "file" && isSelectableSharePointStatus(node.status))
      ) {
        paths.push(node.path)
      }
      paths.push(...collectSelectablePaths(node.children))
    }
    return paths
  }

  const flattenNodesByPath = (
    nodes: SharePointEntryTreeNode[]
  ): Map<string, SharePointEntryTreeNode> => {
    const byPath = new Map<string, SharePointEntryTreeNode>()
    const visit = (node: SharePointEntryTreeNode) => {
      byPath.set(node.path, node)
      for (const child of node.children) {
        visit(child)
      }
    }
    for (const node of nodes) {
      visit(node)
    }
    return byPath
  }

  const selectionTree = $derived(wrapSelectionTreeWithSiteRoot(entryTree))
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
  const displayTree = $derived(allowSelection ? selectionTree : entryTree)

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
              on:click={() => {
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
