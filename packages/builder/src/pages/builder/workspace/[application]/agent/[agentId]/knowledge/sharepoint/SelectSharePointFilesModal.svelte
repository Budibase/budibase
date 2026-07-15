<script lang="ts">
  import {
    ActionButton,
    Body,
    Modal,
    ModalContent,
    RadioGroup,
    TreeView,
    keepOpen,
    notifications,
  } from "@budibase/bbui"
  import {
    type AgentKnowledgeSourceListSelection,
    AgentKnowledgeSourceType,
    type KnowledgeSourceEntry,
  } from "@budibase/types"
  import { agentsStore, selectedAgent } from "@/stores/portal"
  import { workspaceDeploymentStore } from "@/stores/builder"
  import SharePointEntryTreeItem from "./tree/SharePointEntryTreeItem.svelte"
  import {
    buildFileDescendantPathsByNodePath,
    buildEntryTreeFromSourceEntries,
    buildPatternsFromSelection,
    LIST_PATH_PREFIX,
    SITE_ROOT_PATH,
    flattenNodesByPath,
    isExcludeNewByDefaultPatterns,
    rehydrateFromPatterns,
    wrapSelectionTreeWithSiteRoot,
  } from "./sharePointModalUtils"

  export interface Props {
    agentId?: string
    operationId: string
    siteId?: string
  }

  let { agentId, operationId, siteId }: Props = $props()

  let selectedEntryPaths = $state<string[]>([])
  let loadingEntries = $state(false)
  let loadEntriesError = $state<string | null>(null)
  let allEntries = $state<KnowledgeSourceEntry[]>([])
  let includeNewFilesByDefault = $state(true)
  let modal = $state<Modal>()

  const sharePointSource = $derived.by(() => {
    if (!siteId) {
      return undefined
    }
    const sources =
      $selectedAgent?.operations?.find(
        operation => operation.id === operationId
      )?.knowledgeSources || []
    return sources.find(
      source =>
        source.type === AgentKnowledgeSourceType.SHAREPOINT &&
        source.config.site.id === siteId
    )
  })

  const sourceId = $derived(sharePointSource?.id)
  const selectedSiteLabel = $derived(
    sharePointSource?.config.site.name ||
      sharePointSource?.config.site.webUrl ||
      siteId ||
      ""
  )
  const initialPatterns = $derived(
    sharePointSource?.config.filters?.patterns || []
  )
  const initialListSelection = $derived(
    sharePointSource?.config.filters?.listSelection
  )

  const entryTree = $derived(buildEntryTreeFromSourceEntries(allEntries))
  const selectionTree = $derived(wrapSelectionTreeWithSiteRoot(entryTree))
  const selectionNodeByPath = $derived(flattenNodesByPath(selectionTree))
  const fileDescendantPathsByNodePath = $derived(
    buildFileDescendantPathsByNodePath(selectionTree)
  )
  const selectablePaths = $derived.by(() =>
    Array.from(selectionNodeByPath.values())
      .filter(node => node.type === "file" || node.type === "list")
      .map(node => node.path)
      .sort((a, b) => a.localeCompare(b))
  )
  const selectableFilePaths = $derived(
    selectablePaths.filter(path => !path.startsWith(LIST_PATH_PREFIX))
  )
  const selectableListPaths = $derived(
    selectablePaths.filter(path => path.startsWith(LIST_PATH_PREFIX))
  )

  const selectedCountLabel = $derived(
    `${selectedEntryPaths.filter(path => path !== SITE_ROOT_PATH).length} items selected`
  )

  const loadAllEntries = async () => {
    if (!agentId || !operationId || !siteId) {
      return false
    }
    loadingEntries = true
    loadEntriesError = null
    allEntries = []
    try {
      const response =
        await agentsStore.fetchOperationKnowledgeSourceAllEntries(
          agentId,
          operationId,
          siteId
        )
      allEntries = response.entries
      return true
    } catch (error) {
      console.error(error)
      loadEntriesError =
        "Failed to load SharePoint files. Check your network connection and try again."
      notifications.error(loadEntriesError)
      return false
    } finally {
      loadingEntries = false
    }
  }

  const rehydrateSelectedEntryPaths = () => {
    const selectablePathSet = new Set(selectablePaths)
    const selectedFilePaths = rehydrateFromPatterns(
      initialPatterns,
      selectableFilePaths
    ).filter(path => selectablePathSet.has(path))
    const selectedListPaths = selectableListPaths.filter(path => {
      if (!initialListSelection) {
        return true
      }
      const listId = path.slice(LIST_PATH_PREFIX.length)
      const selected = initialListSelection.listIds.includes(listId)
      return initialListSelection.mode === "include" ? selected : !selected
    })
    selectedEntryPaths = [...selectedFilePaths, ...selectedListPaths]
    if (selectedEntryPaths.length === selectablePaths.length) {
      selectedEntryPaths = [SITE_ROOT_PATH, ...selectedEntryPaths]
    }
  }

  const retryLoadAllEntries = async () => {
    const loaded = await loadAllEntries()
    if (!loaded) {
      return
    }
    rehydrateSelectedEntryPaths()
  }

  export async function show() {
    selectedEntryPaths = []
    loadEntriesError = null
    includeNewFilesByDefault = !isExcludeNewByDefaultPatterns(initialPatterns)

    const loaded = await loadAllEntries()
    if (!loaded) {
      modal?.show()
      return
    }
    rehydrateSelectedEntryPaths()

    modal?.show()
  }

  export function hide() {
    modal?.hide()
  }

  const handleConfirm = async () => {
    if (!agentId || !operationId || !siteId) {
      return keepOpen
    }
    if (selectedEntryPaths.length === 0) {
      notifications.error("Please select at least one file or list to sync")

      return keepOpen
    }

    const filters = buildPatternsFromSelection(
      selectedEntryPaths.filter(
        path => path === SITE_ROOT_PATH || !path.startsWith(LIST_PATH_PREFIX)
      ),
      selectableFilePaths,
      selectionNodeByPath,
      includeNewFilesByDefault
    )
    const selectedListIds = selectedEntryPaths
      .filter(path => path.startsWith(LIST_PATH_PREFIX))
      .map(path => path.slice(LIST_PATH_PREFIX.length))
    let listSelection: AgentKnowledgeSourceListSelection | undefined
    if (includeNewFilesByDefault) {
      const excludedListIds = selectableListPaths
        .map(path => path.slice(LIST_PATH_PREFIX.length))
        .filter(listId => !selectedListIds.includes(listId))
      listSelection = excludedListIds.length
        ? { mode: "exclude", listIds: excludedListIds }
        : undefined
    } else {
      listSelection = { mode: "include", listIds: selectedListIds }
    }

    try {
      await agentsStore.applyOperationSharePointSiteFilters(
        agentId,
        operationId,
        siteId,
        {
          filters,
          listSelection,
        }
      )
      await Promise.all([
        agentsStore.fetchAgentKnowledge(agentId),
        workspaceDeploymentStore.fetch(),
      ])

      notifications.success("SharePoint folders/files updated and sync started")
      hide()
    } catch (error) {
      console.error(error)
      notifications.error("Failed to update SharePoint content")
      return keepOpen
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
</script>

<Modal bind:this={modal}>
  <ModalContent
    title={`SharePoint - ${selectedSiteLabel}`}
    showCloseIcon={false}
    showDivider={false}
    showConfirmButton
    size="XL"
    confirmText="Save"
    cancelText="Cancel"
    disabled={!sourceId || loadingEntries || !!loadEntriesError}
    onConfirm={handleConfirm}
    onCancel={hide}
  >
    <div class="entries-header">
      <RadioGroup
        options={[
          { label: "Include new content by default", value: true },
          { label: "Exclude new content by default", value: false },
        ]}
        value={includeNewFilesByDefault}
        on:change={e => {
          includeNewFilesByDefault = e.detail === "true"
        }}
        getOptionLabel={o => o.label}
        getOptionValue={o => o.value}
        getOptionSubtitle={o => o.subtitle}
        direction="horizontal"
      ></RadioGroup>
      <span class="selected-count">{selectedCountLabel}</span>
    </div>

    {#if loadingEntries}
      <Body size="S">Loading SharePoint content...</Body>
    {:else if loadEntriesError}
      <div class="load-error">
        <Body size="S">{loadEntriesError}</Body>
        <ActionButton quiet icon="refresh" on:click={retryLoadAllEntries}
          >Retry</ActionButton
        >
      </div>
    {:else if selectionTree.length === 0}
      <Body size="S">No files or lists found for this site.</Body>
    {:else}
      <div class="entries-list">
        <TreeView width="auto" standalone={false} quiet selectable>
          {#each selectionTree as node (node.path)}
            <SharePointEntryTreeItem
              selectable
              {node}
              selectedPaths={selectedEntryPaths}
              {fileDescendantPathsByNodePath}
              onTogglePaths={toggleEntryPaths}
              showStatus={false}
            />
          {/each}
        </TreeView>
      </div>
    {/if}
  </ModalContent>
</Modal>

<style>
  .entries-header {
    margin-top: var(--spacing-xxs);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    justify-content: space-between;
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
    overflow: auto;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 8px;
  }

  .load-error {
    display: flex;
    gap: var(--spacing-xs);
    align-items: center;
    justify-content: space-between;
  }
</style>
