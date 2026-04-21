<script lang="ts">
  import {
    ActionButton,
    Body,
    Modal,
    ModalContent,
    RadioGroup,
    TreeView,
    notifications,
  } from "@budibase/bbui"
  import {
    AgentKnowledgeSourceType,
    type KnowledgeSourceEntry,
  } from "@budibase/types"
  import { agentsStore, selectedAgent } from "@/stores/portal"
  import SharePointEntryTreeItem from "./tree/SharePointEntryTreeItem.svelte"
  import {
    buildEntryTreeFromSourceEntries,
    buildPatternsFromSelection,
    collectSelectablePaths,
    isExcludeNewByDefaultPatterns,
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
  let hasHydratedSelection = $state(false)
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
    hasHydratedSelection = false
    includeNewFilesByDefault = !isExcludeNewByDefaultPatterns(initialPatterns)

    await loadAllEntries()

    selectedEntryPaths = rehydrateFromPatterns(initialPatterns, selectablePaths)

    modal?.show()
  }

  export function hide() {
    modal?.hide()
  }

  const handleConfirm = async () => {
    if (!agentId || !siteId) {
      return
    }
    if (selectedEntryPaths.length === 0) {
      notifications.error("Please select at least one folder/file to sync")
      return
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
    if (hasHydratedSelection) {
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
        bind:value={includeNewFilesByDefault}
        getOptionLabel={o => o.label}
        getOptionValue={o => o.value}
        getOptionSubtitle={o => o.subtitle}
        direction="horizontal"
      ></RadioGroup>
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
        <TreeView width="auto" standalone={false} selectable quiet>
          {#each selectionTree as node (node.path)}
            <SharePointEntryTreeItem
              {node}
              selectedPaths={selectedEntryPaths}
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
