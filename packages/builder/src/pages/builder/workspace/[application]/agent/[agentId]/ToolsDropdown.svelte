<script lang="ts">
  import { Body, Button, ActionMenu, MenuItem, Icon } from "@budibase/bbui"
  import { ToolType } from "@budibase/types"
  import type { AgentTool } from "./toolTypes"
  import ToolIcon from "./ToolIcon.svelte"

  export let filteredTools: AgentTool[]
  export let toolSections: Record<string, AgentTool[]>
  export let toolSearch: string
  export let onToolClick: (_tool: AgentTool) => void
  export let onAddApiConnection: () => void
  export let webSearchEnabled = false
  export let onConfigureWebSearch: () => void

  let toolsMenu: ActionMenu | undefined

  const openWebSearchConfig = () => {
    toolsMenu?.hide()
    onConfigureWebSearch()
  }

  const handleWebSearchConfigClick = (event: MouseEvent) => {
    event.stopPropagation()
    openWebSearchConfig()
  }
</script>

<ActionMenu
  bind:this={toolsMenu}
  align="right"
  roundedPopover
  portalTarget=".tools-popover-container"
>
  <div slot="control">
    <Button secondary size="M" icon="plus">Add tools</Button>
  </div>

  <div class="tools-menu">
    <div class="tools-menu-header">
      <input
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
                on:click={() => {
                  if (
                    tool.sourceType === ToolType.SEARCH &&
                    !webSearchEnabled
                  ) {
                    openWebSearchConfig()
                    return
                  }
                  onToolClick(tool)
                }}
              >
                <div class="tool-item">
                  <div class="tool-item-icon">
                    <ToolIcon icon={tool.icon} size="S" fallbackIcon="Wrench" />
                  </div>
                  <span class="tool-item-label">
                    {#if tool.sourceType === ToolType.SEARCH}
                      Web search
                    {:else}
                      {#if tool.sourceLabel}{tool.sourceLabel}:
                      {/if}{tool.name}
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
