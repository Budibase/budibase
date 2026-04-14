<script lang="ts">
  import {
    Body,
    Modal,
    ModalContent,
    Select,
    TreeView,
  } from "@budibase/bbui"
  import {
    AgentKnowledgeSourceSyncEntryStatus,
    type KnowledgeSourceEntry,
    type KnowledgeSourceOption,
    type KnowledgeSourceSyncRun,
  } from "@budibase/types"
  import SharePointEntryTreeItem from "./SharePointEntryTreeItem.svelte"
  import type { SharePointEntryTreeNode } from "./sharePointEntryTree"

  export interface Props {
    title?: string
    loadingSharePointSites: boolean
    loadingSharePointEntries?: boolean
    sharePointSites?: KnowledgeSourceOption[]
    sharePointEntries?: KnowledgeSourceEntry[]
    syncRun?: KnowledgeSourceSyncRun
    selectedSiteId?: string
    selectedEntryPaths?: string[]
    isAddingSite?: boolean
    scopeEditMode?: boolean
    onSave?: () => void
  }

  let {
    title = "SharePoint files",
    loadingSharePointSites,
    loadingSharePointEntries = false,
    sharePointSites = [],
    sharePointEntries = [],
    syncRun,
    selectedSiteId = $bindable(""),
    selectedEntryPaths = $bindable([]),
    isAddingSite = false,
    scopeEditMode = $bindable(false),
    onSave,
  }: Props = $props()

  let modal = $state<Modal>()

  export function show() {
    modal?.show()
  }

  export function hide() {
    modal?.hide()
  }

  const handleConfirm = async () => {
    if (!isAddingSite && !scopeEditMode) {
      hide()
      return
    }
    await onSave?.()
  }

  const toggleEntryPath = (path: string) => {
    if (selectedEntryPaths.includes(path)) {
      selectedEntryPaths = selectedEntryPaths.filter(entry => entry !== path)
      return
    }
    selectedEntryPaths = Array.from(new Set([...selectedEntryPaths, path]))
  }

  const buildEntryTree = (
    entries: KnowledgeSourceEntry[],
    statusByPath: Map<string, AgentKnowledgeSourceSyncEntryStatus>
  ): SharePointEntryTreeNode[] => {
    const roots: SharePointEntryTreeNode[] = []
    const byPath = new Map<string, SharePointEntryTreeNode>()

    for (const entry of [...entries].sort((a, b) =>
      a.path.localeCompare(b.path)
    )) {
      const parts = entry.path.split("/").filter(Boolean)
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
            type: isLeaf ? entry.type : "folder",
            status: isLeaf ? statusByPath.get(currentPath) : undefined,
            children: [],
          }
          byPath.set(currentPath, node)
          parent.push(node)
        } else if (isLeaf) {
          node.type = entry.type
          node.status = statusByPath.get(currentPath)
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

  const syncStatusByPath = $derived.by(() => {
    const map = new Map<string, AgentKnowledgeSourceSyncEntryStatus>()
    for (const entry of syncRun?.entries || []) {
      map.set(entry.path, entry.status)
    }
    return map
  })

  const entryTree = $derived(buildEntryTree(sharePointEntries, syncStatusByPath))

  const toggleAll = () => {
    const allPaths = sharePointEntries.map(entry => entry.path)
    if (selectedEntryPaths.length === allPaths.length) {
      selectedEntryPaths = []
      return
    }
    selectedEntryPaths = allPaths
  }

  const selectAllLabel = $derived(
    selectedEntryPaths.length === sharePointEntries.length
      ? "Clear selection"
      : "Select all"
  )

  const selectedCountLabel = $derived(`${selectedEntryPaths.length} selected`)
</script>

<Modal bind:this={modal}>
  <ModalContent
    custom
    showCloseIcon={false}
    showDivider={false}
    showConfirmButton={isAddingSite || scopeEditMode}
    confirmText={isAddingSite ? "Add site" : scopeEditMode ? "Save" : "Close"}
    cancelText={isAddingSite || scopeEditMode ? "Cancel" : "Close"}
    onConfirm={handleConfirm}
    onCancel={hide}
  >
    <div class="content">
      <div class="title">
        <Body size="S">{title}</Body>
      </div>

      {#if loadingSharePointSites}
        <Body size="S">Loading SharePoint sites...</Body>
      {:else if sharePointSites.length === 0}
        <Body size="S">No SharePoint sites found for this connection.</Body>
      {:else if isAddingSite}
        <Select
          bind:value={selectedSiteId}
          label="Select site"
          options={sharePointSites}
          getOptionLabel={site => site.name || site.webUrl || site.id}
          getOptionValue={site => site.id}
        />
      {:else if selectedSiteId}
        <div class="entries-header">
          <Body size="S">Select folders/files to sync</Body>
          <button
            class="link-btn"
            onclick={event => {
              event.preventDefault()
              toggleAll()
            }}
          >
            {selectAllLabel}
          </button>
          <span class="selected-count">{selectedCountLabel}</span>
        </div>

        {#if loadingSharePointEntries}
          <Body size="S">Loading site structure...</Body>
        {:else if sharePointEntries.length === 0}
          <Body size="S">No folders or files found for this site.</Body>
        {:else}
          <div class="entries-list">
            <TreeView width="100%" standalone={false}>
              {#each entryTree as node (node.path)}
                <SharePointEntryTreeItem
                  {node}
                  selectedPaths={selectedEntryPaths}
                  onToggle={toggleEntryPath}
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
