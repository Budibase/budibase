<script lang="ts">
  import {
    KnowledgeBaseFileStatus,
    type SharePointScopeTarget,
  } from "@budibase/types"
  import {
    Body,
    Helpers,
    Icon,
    Modal,
    ModalContent,
    notifications,
    StatusLight,
    TreeItem,
  } from "@budibase/bbui"
  import SharePointEntryTreeItem from "./SharePointEntryTreeItem.svelte"
  import type { SharePointEntryTreeNode } from "./sharePointEntryTree"
  import { isNodeTargeted } from "../sharePointScope"

  export interface Props {
    selectable?: boolean
    node: SharePointEntryTreeNode
    scopeTargets?: SharePointScopeTarget[]
    ancestorSelected?: boolean
    onToggleNode?: (
      _node: SharePointEntryTreeNode,
      _nextSelected: boolean
    ) => void
    onExpandNode?: (_node: SharePointEntryTreeNode) => Promise<void> | void
    showStatus?: boolean
  }

  let {
    selectable,
    node,
    scopeTargets,
    ancestorSelected = false,
    onToggleNode,
    onExpandNode,
    showStatus = true,
  }: Props = $props()

  const getSharePointStatusText = (
    status?: SharePointEntryTreeNode["status"]
  ) => {
    switch (status) {
      case KnowledgeBaseFileStatus.PROCESSING:
        return "Processing"
      case KnowledgeBaseFileStatus.READY:
        return "Ready"
      case KnowledgeBaseFileStatus.FAILED:
        return "Failed"
      default:
        return undefined
    }
  }

  const getSharePointStatusLightProps = (
    status?: SharePointEntryTreeNode["status"]
  ) => {
    switch (status) {
      case KnowledgeBaseFileStatus.READY:
        return { positive: true }
      case KnowledgeBaseFileStatus.FAILED:
        return { negative: true }
      default:
        return { notice: true }
    }
  }

  let errorModal = $state<Modal>()
  let hasChildren = $derived(!!node.hasChildren || node.children.length > 0)
  let hasError = $derived(
    node.status === KnowledgeBaseFileStatus.FAILED && !!node.errorMessage
  )

  const openErrorModal = (event: MouseEvent | KeyboardEvent) => {
    if (!hasError) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    errorModal?.show()
  }

  const copy = () => {
    if (!node.errorMessage) {
      return
    }
    Helpers.copyToClipboard(node.errorMessage)
    notifications.success("Error copied to clipboard")
  }
  let selected = $derived(
    !!scopeTargets && (ancestorSelected || isNodeTargeted(node, scopeTargets))
  )
  let disabled = $derived(!!scopeTargets && ancestorSelected)

  const handleSelect = (_event: CustomEvent<boolean>) => {
    if (!scopeTargets) {
      return
    }
    onToggleNode?.(node, !selected)
  }

  const handleToggle = async (event: CustomEvent<boolean>) => {
    node.open = event.detail
    if (event.detail && !node.childrenLoaded) {
      await onExpandNode?.(node)
    }
  }

  const handleRetry = async (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    await onExpandNode?.(node)
  }
</script>

<div class="sharepoint-entry-tree-item">
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <TreeItem
    title={node.name}
    {selected}
    showCheckbox={selectable}
    {disabled}
    open={node.open || false}
    {hasChildren}
    on:select={handleSelect}
    on:toggle={handleToggle}
    on:click={openErrorModal}
  >
    <svelte:fragment slot="post">
      {#if showStatus && (node.type === "file" || node.type === "list") && getSharePointStatusText(node.status)}
        <StatusLight size="S" {...getSharePointStatusLightProps(node.status)}>
          {getSharePointStatusText(node.status)}
        </StatusLight>
      {/if}
    </svelte:fragment>

    {#if hasChildren}
      {#if node.loading}
        <TreeItem title="Loading..." disabled />
      {:else if node.loadError}
        <TreeItem title="Failed to load. Retry" on:click={handleRetry} />
      {:else}
        {#each node.children as child (child.path)}
          <SharePointEntryTreeItem
            {selectable}
            node={child}
            {scopeTargets}
            ancestorSelected={!!scopeTargets && selected}
            {onToggleNode}
            {onExpandNode}
            {showStatus}
          />
        {/each}
      {/if}
    {/if}
  </TreeItem>

  {#if hasError}
    <Modal bind:this={errorModal}>
      <ModalContent
        title={`SharePoint sync error - ${node.name}`}
        showDivider={false}
        size="L"
        showCloseIcon
        showConfirmButton={false}
        showCancelButton={false}
      >
        <div class="error-header">
          <Body size="S">The file failed to sync with this error:</Body>
          <Icon name="copy" size="S" hoverable on:click={copy} />
        </div>
        <pre class="error-detail">{node.errorMessage}</pre>
      </ModalContent>
    </Modal>
  {/if}
</div>

<style>
  .error-header {
    display: flex;
    justify-content: space-between;
  }

  .error-detail {
    max-height: 320px;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-word;
    color: var(--spectrum-semantic-negative-color-default);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 6px;
    padding: var(--spacing-m);
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
  }

  .sharepoint-entry-tree-item :global(.spectrum-TreeView-itemLink) {
    padding-inline-end: 8px;
  }
</style>
