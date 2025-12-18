<script lang="ts">
  import { Body, Button, ActionMenu, MenuItem } from "@budibase/bbui"
  import { type ToolMetadata } from "@budibase/types"
  import type { IconInfo } from "@/helpers/integrationIcons"

  interface EnrichedTool extends ToolMetadata {
    readableBinding: string
    runtimeBinding: string
    icon?: IconInfo
  }

  export let filteredTools: EnrichedTool[]
  export let toolSections: Record<string, EnrichedTool[]>
  export let toolSearch: string
  export let onToolClick: (_tool: EnrichedTool) => void
  export let onAddApiConnection: () => void
  let toolsMenu: ActionMenu | undefined
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

    {#if filteredTools.length === 0}
      <div class="tool-empty">
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          No tools available
        </Body>
      </div>
    {:else}
      <div class="tools-menu-content">
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
              <MenuItem on:click={() => onToolClick(tool)}>
                <div class="tool-item">
                  <div class="tool-item-icon">
                    {#if tool?.icon?.icon}
                      <svelte:component
                        this={tool.icon.icon}
                        height="16"
                        width="16"
                      />
                    {:else if tool?.icon?.url}
                      <img src={tool.icon.url} alt="" width="16" height="16" />
                    {/if}
                  </div>
                  <span class="tool-item-label">
                    {#if tool.sourceLabel}{tool.sourceLabel}:
                    {/if}{tool.name}
                  </span>
                </div>
              </MenuItem>
            {/each}
          </div>
        {/each}
      </div>
    {/if}
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
