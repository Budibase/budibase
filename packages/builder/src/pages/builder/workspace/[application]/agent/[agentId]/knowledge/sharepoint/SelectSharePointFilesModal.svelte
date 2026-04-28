<script lang="ts">
  import {
    Body,
    Modal,
    ModalContent,
    RadioGroup,
    TreeView,
    keepOpen,
    notifications,
  } from "@budibase/bbui"
  import {
    AgentKnowledgeSourceType,
    type KnowledgeSourceEntry,
  } from "@budibase/types"
  import { agentsStore, selectedAgent } from "@/stores/portal"
  import SharePointEntryTreeItem from "./tree/SharePointEntryTreeItem.svelte"
  import {
    buildFileDescendantPathsByNodePath,
    buildEntryTreeFromSourceEntries,
    buildPatternsFromSelection,
    flattenNodesByPath,
    isExcludeNewByDefaultPatterns,
    rehydrateFromPatterns,
    wrapSelectionTreeWithSiteRoot,
  } from "./sharePointModalUtils"

  export interface Props {
    agentId?: string
    siteId?: string
  }

  let { agentId, siteId }: Props = $props()

  let selectedEntryPaths = $state<string[]>([])
  let loadingEntries = $state(false)
  let allEntries = $state<KnowledgeSourceEntry[]>([])
  let includeNewFilesByDefault = $state(true)
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
  const selectionNodeByPath = $derived(flattenNodesByPath(selectionTree))
  const fileDescendantPathsByNodePath = $derived(
    buildFileDescendantPathsByNodePath(selectionTree)
  )
  const selectablePaths = $derived.by(() =>
    Array.from(selectionNodeByPath.values())
      .filter(node => node.type === "file")
      .map(node => node.path)
      .sort((a, b) => a.localeCompare(b))
  )

  const selectedCountLabel = $derived(
    `${selectedEntryPaths.length} files selected`
  )

  const loadAllEntries = async () => {
    if (!agentId || !siteId) {
      return
    }
    loadingEntries = true
    allEntries = []
    try {
      const response = await agentsStore.fetchAgentKnowledgeSourceAllEntries(
        agentId,
        siteId
      )
      allEntries = response.entries
    } catch (error) {
      console.error(error)
      notifications.error(
        "Failed to load SharePoint files. Check your network connection and try again."
      )
    } finally {
      loadingEntries = false
    }
  }

  export async function show() {
    selectedEntryPaths = []
    includeNewFilesByDefault = !isExcludeNewByDefaultPatterns(initialPatterns)

    await loadAllEntries()

    const selectablePathSet = new Set(selectablePaths)
    selectedEntryPaths = rehydrateFromPatterns(
      initialPatterns,
      selectablePaths
    ).filter(path => selectablePathSet.has(path))

    modal?.show()
  }

  export function hide() {
    modal?.hide()
  }

  const handleConfirm = async () => {
    if (!agentId || !siteId) {
      return keepOpen
    }
    if (selectedEntryPaths.length === 0) {
      notifications.error("Please select at least one folder/file to sync")

      return keepOpen
    }

    const filters = buildPatternsFromSelection(
      selectedEntryPaths,
      selectablePaths,
      selectionNodeByPath,
      includeNewFilesByDefault
    )

    try {
      await agentsStore.applyAgentSharePointSiteFilters(agentId, siteId, {
        filters,
      })
      if (sourceId) {
        await agentsStore.syncAgentKnowledgeSources(agentId, sourceId)
      }
      await agentsStore.fetchAgentKnowledge(agentId)

      notifications.success("SharePoint folders/files updated")
      hide()
    } catch (error) {
      console.error(error)
      notifications.error("Failed to update SharePoint files")
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
    disabled={!sourceId}
    onConfirm={handleConfirm}
    onCancel={hide}
  >
    <div class="entries-header">
      <RadioGroup
        options={[
          { label: "Include new files by default", value: true },
          { label: "Exclude new files by default", value: false },
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
      <Body size="S">Loading SharePoint files...</Body>
    {:else if selectionTree.length === 0}
      <Body size="S">No folders or files found for this site.</Body>
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
</style>
