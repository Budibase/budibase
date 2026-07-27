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
    AgentKnowledgeSourceType,
    SharePointScopeAction,
    type SharePointScopeRule,
  } from "@budibase/types"
  import { agentsStore, selectedAgent } from "@/stores/portal"
  import { workspaceDeploymentStore } from "@/stores/builder"
  import SharePointEntryTreeItem from "./tree/SharePointEntryTreeItem.svelte"
  import type { SharePointEntryTreeNode } from "./tree/sharePointEntryTree"
  import { entryToNode, toggleScopeNode } from "./sharePointScope"

  export interface Props {
    agentId?: string
    operationId: string
    siteId?: string
  }

  let { agentId, operationId, siteId }: Props = $props()

  let defaultAction = $state(SharePointScopeAction.INCLUDE)
  let scopeRules = $state<SharePointScopeRule[]>([])
  let rootNodes = $state<SharePointEntryTreeNode[]>([])
  let loadingEntries = $state(false)
  let loadEntriesError = $state<string | null>(null)
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
  const isOutdated = $derived(
    !!sharePointSource && !sharePointSource.config.scope
  )
  const selectedSiteLabel = $derived(
    sharePointSource?.config.site.name ||
      sharePointSource?.config.site.webUrl ||
      siteId ||
      ""
  )
  const ruleCountLabel = $derived(
    `${scopeRules.length} scope ${scopeRules.length === 1 ? "rule" : "rules"}`
  )

  const loadRootEntries = async () => {
    if (!agentId || !operationId || !siteId || isOutdated) {
      return
    }
    loadingEntries = true
    loadEntriesError = null
    rootNodes = []
    try {
      const response = await agentsStore.fetchOperationKnowledgeSourceEntries(
        agentId,
        operationId,
        siteId
      )
      rootNodes = response.entries.map(entryToNode)
    } catch (error) {
      console.error(error)
      loadEntriesError =
        "Failed to load SharePoint content. Check your connection and try again."
      notifications.error(loadEntriesError)
    } finally {
      loadingEntries = false
    }
  }

  const expandNode = async (node: SharePointEntryTreeNode) => {
    if (
      !agentId ||
      !operationId ||
      !siteId ||
      !node.driveId ||
      node.childrenLoaded ||
      node.loading
    ) {
      return
    }
    node.loading = true
    node.loadError = undefined
    rootNodes = [...rootNodes]
    try {
      const response = await agentsStore.fetchOperationKnowledgeSourceEntries(
        agentId,
        operationId,
        siteId,
        {
          driveId: node.driveId,
          parentItemId: node.type === "folder" ? node.itemId : undefined,
          parentPath: node.path,
        }
      )
      node.children = response.entries.map(entryToNode)
      node.childrenLoaded = true
    } catch (error) {
      console.error(error)
      node.loadError = "Failed to load"
      notifications.error(`Failed to load ${node.name}`)
    } finally {
      node.loading = false
      rootNodes = [...rootNodes]
    }
  }

  const toggleNode = (
    node: SharePointEntryTreeNode,
    nextSelected: boolean,
    inheritedAction: SharePointScopeAction
  ) => {
    scopeRules = toggleScopeNode({
      rules: scopeRules,
      node,
      nextSelected,
      inheritedAction,
    })
  }

  export async function show() {
    const scope = sharePointSource?.config.scope
    if (scope) {
      defaultAction = scope.defaultAction
      scopeRules = [...scope.rules]
    } else {
      defaultAction = SharePointScopeAction.EXCLUDE
      scopeRules = []
    }
    modal?.show()
    await loadRootEntries()
  }

  export function hide() {
    modal?.hide()
  }

  const handleConfirm = async () => {
    if (!agentId || !operationId || !siteId || isOutdated) {
      return keepOpen
    }
    try {
      await agentsStore.applyOperationSharePointSiteScope(
        agentId,
        operationId,
        siteId,
        {
          scope: {
            defaultAction,
            rules: scopeRules,
          },
        }
      )
      await Promise.all([
        agentsStore.fetchAgentKnowledge(agentId),
        workspaceDeploymentStore.fetch(),
      ])

      notifications.success("SharePoint scope updated and sync started")
      hide()
    } catch (error) {
      console.error(error)
      notifications.error("Failed to update SharePoint scope")
      return keepOpen
    }
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    title={`SharePoint - ${selectedSiteLabel}`}
    showCloseIcon={false}
    showDivider={false}
    showConfirmButton={!isOutdated}
    size="XL"
    confirmText="Save"
    cancelText="Cancel"
    disabled={!sourceId || loadingEntries || !!loadEntriesError}
    onConfirm={handleConfirm}
    onCancel={hide}
  >
    {#if isOutdated}
      <Body size="S">
        This SharePoint source uses an outdated configuration. Delete it and
        reconnect the site to configure scoped sync.
      </Body>
    {:else}
      <div class="entries-header">
        <RadioGroup
          options={[
            {
              label: "Include new content by default",
              value: SharePointScopeAction.INCLUDE,
            },
            {
              label: "Exclude new content by default",
              value: SharePointScopeAction.EXCLUDE,
            },
          ]}
          value={defaultAction}
          on:change={e => {
            defaultAction = e.detail as SharePointScopeAction
            scopeRules = []
          }}
          getOptionLabel={o => o.label}
          getOptionValue={o => o.value}
          direction="horizontal"
        ></RadioGroup>
        <span class="selected-count">{ruleCountLabel}</span>
      </div>

      {#if loadingEntries}
        <Body size="S">Loading SharePoint content...</Body>
      {:else if loadEntriesError}
        <div class="load-error">
          <Body size="S">{loadEntriesError}</Body>
          <ActionButton quiet icon="refresh" on:click={loadRootEntries}>
            Retry
          </ActionButton>
        </div>
      {:else if rootNodes.length === 0}
        <Body size="S">No document libraries or lists found for this site.</Body
        >
      {:else}
        <div class="entries-list">
          <TreeView width="auto" standalone={false} quiet selectable>
            {#each rootNodes as node (node.id)}
              <SharePointEntryTreeItem
                selectable
                {node}
                {scopeRules}
                inheritedAction={defaultAction}
                onToggleNode={toggleNode}
                onExpandNode={expandNode}
                showStatus={false}
              />
            {/each}
          </TreeView>
        </div>
      {/if}
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
