<script lang="ts">
  import { tick } from "svelte"
  import { Body, Button, ActionMenu, MenuItem, Icon } from "@budibase/bbui"
  import { ToolType } from "@budibase/types"
  import type { AgentTool } from "./toolTypes"
  import ToolIcon from "./ToolIcon.svelte"

  export interface Props {
    filteredTools: AgentTool[]
    toolSections: Record<string, AgentTool[]>
    toolSearch: string
    webSearchEnabled: boolean
    onToolClick: (tool: AgentTool) => void
    onAddApiConnection: () => void
    onConfigureWebSearch: () => void
    onClose?: () => void
  }

  let {
    filteredTools,
    toolSections,
    toolSearch = $bindable(""),
    webSearchEnabled = false,
    onToolClick,
    onAddApiConnection,
    onConfigureWebSearch,
    onClose,
  }: Props = $props()

  let toolsMenu: ActionMenu | undefined
  let toolsMenuElement: HTMLDivElement | undefined
  let searchInput: HTMLInputElement | undefined

  const focusSearch = async () => {
    await tick()
    searchInput?.focus()
  }

  const openWebSearchConfig = () => {
    toolsMenu?.hide()
    onConfigureWebSearch()
  }

  const handleWebSearchConfigClick = (event: MouseEvent) => {
    event.stopPropagation()
    openWebSearchConfig()
  }

  const handleKeydown = (event: KeyboardEvent) => {
    const items = Array.from(
      toolsMenuElement?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not(.is-disabled), button:not(:disabled)'
      ) || []
    )
    const focusableElements = searchInput ? [searchInput, ...items] : items
    const activeElement = document.activeElement as HTMLElement
    const activeIndex = focusableElements.indexOf(activeElement)
    const activeItemIndex = items.indexOf(activeElement)

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!focusableElements.length) {
        return
      }
      event.preventDefault()
      const direction = event.key === "ArrowDown" ? 1 : -1
      let nextIndex
      if (activeIndex === -1) {
        nextIndex = direction === 1 ? 0 : focusableElements.length - 1
      } else {
        nextIndex =
          (activeIndex + direction + focusableElements.length) %
          focusableElements.length
      }
      focusableElements[nextIndex].focus()
    } else if (
      (event.key === "Enter" || event.key === " ") &&
      activeItemIndex >= 0
    ) {
      event.preventDefault()
      items[activeItemIndex].click()
    } else if (event.key === "Escape") {
      event.preventDefault()
      toolsMenu?.hide()
    }
  }

  export const show = () => toolsMenu?.show()
</script>

<ActionMenu
  bind:this={toolsMenu}
  on:open={focusSearch}
  on:close={() => onClose?.()}
  align="right"
  roundedPopover
  portalTarget=".tools-popover-container"
>
  <div slot="control">
    <Button secondary size="S" icon="plus-circle">Add tools</Button>
  </div>

  <div
    class="tools-menu"
    role="presentation"
    bind:this={toolsMenuElement}
    onkeydown={handleKeydown}
  >
    <div class="tools-menu-header">
      <input
        bind:this={searchInput}
        class="tools-filter"
        type="text"
        placeholder="Search"
        bind:value={toolSearch}
        aria-label="Filter tools"
      />
    </div>

    <div class="tools-menu-content">
      {#if filteredTools.length === 0}
        <div class="tool-empty">
          <Body size="S" color="var(--spectrum-global-color-gray-600)">
            No tools available
          </Body>
        </div>
      {/if}
      {#if filteredTools.length > 0}
        {#each Object.keys(toolSections) as section}
          <div class="tool-section">
            <div class="tool-section-header">
              <span class="section-title">{section}</span>
              {#if section === "API tools"}
                <Button
                  secondary
                  size="S"
                  icon="plus"
                  on:click={() => {
                    toolsMenu?.hide()
                    onAddApiConnection()
                  }}>Add API connection</Button
                >
              {/if}
            </div>
            {#each toolSections[section] as tool}
              <MenuItem
                noClose
                on:click={() => {
                  if (
                    tool.sourceType === ToolType.SEARCH &&
                    !webSearchEnabled
                  ) {
                    openWebSearchConfig()
                    return
                  }
                  onToolClick(tool)
                  toolsMenu?.hide()
                }}
              >
                <div class="tool-item">
                  <div class="tool-item-icon">
                    <ToolIcon
                      icon={tool.icon}
                      size="S"
                      fallbackIcon={tool.fallbackIcon || "Wrench"}
                    />
                  </div>
                  <span class="tool-item-label">
                    {#if tool.sourceType === ToolType.SEARCH}
                      Web search
                    {:else}
                      {#if tool.sourceLabel}{tool.sourceLabel}:
                      {/if}{tool.readableName || tool.name}
                    {/if}
                  </span>
                  {#if tool.sourceType === ToolType.SEARCH}
                    <div class="web-search-actions">
                      {#if webSearchEnabled}
                        <Icon
                          name="check"
                          size="S"
                          color="var(--spectrum-semantic-positive-color-default)"
                        />
                      {/if}
                      <Icon
                        size="S"
                        name="gear"
                        hoverable={true}
                        on:click={handleWebSearchConfigClick}
                      />
                    </div>
                  {/if}
                </div>
              </MenuItem>
            {/each}
          </div>
        {/each}
      {/if}
    </div>
  </div>
</ActionMenu>

<style>
  :global([slot="control"] .spectrum-Button.new-styles .spectrum-Button-label) {
    font-weight: 500;
  }

  .tools-menu-header {
    display: flex;
    padding: var(--spectrum-listitem-padding-y)
      var(--spectrum-listitem-padding-right) var(--spectrum-listitem-padding-y)
      var(--spectrum-listitem-padding-left);
  }

  .tools-filter {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: var(--spectrum-global-color-gray-900);
    font-size: var(--font-size-s);
  }

  .tools-menu-content {
    max-height: 400px;
    width: 300px;
    overflow-y: auto;
  }

  .tool-section {
    display: flex;
    flex-direction: column;
  }

  .tool-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-s) var(--spectrum-listitem-padding-left);
    color: var(--spectrum-global-color-gray-600);
  }

  .section-title {
    font-size: var(--font-size-s);
    font-weight: 500;
  }

  .tool-empty {
    padding: var(--spacing-l);
    text-align: center;
  }

  .tool-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .web-search-actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .tool-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
  }

  .tool-item-label {
    font-size: var(--font-size-s);
  }
</style>
