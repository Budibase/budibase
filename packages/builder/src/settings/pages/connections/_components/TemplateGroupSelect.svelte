<script lang="ts">
  import { bb } from "@/stores/bb"
  import { ActionMenu, MenuItem, Icon, Button } from "@budibase/bbui"
  import type {
    RestTemplateGroup,
    RestTemplateGroupName,
    RestTemplateWithoutIcon,
  } from "@budibase/types"

  export let group: RestTemplateGroup<RestTemplateGroupName>

  type GroupTemplate = RestTemplateWithoutIcon<string, string>

  let menuRef: ActionMenu | undefined
  let open = false
  let selectedTemplate: GroupTemplate | null = null

  $: templates = group.templates || []
  $: if (templates.length && !selectedTemplate) {
    selectedTemplate = templates[0]
  }

  const onMenuOpen = () => {
    open = true
  }

  const onMenuClose = () => {
    open = false
  }

  const selectTemplate = (template: GroupTemplate) => {
    selectedTemplate = template
  }

  const confirmSelection = () => {
    if (selectedTemplate) {
      bb.settings(`/connections/new/${selectedTemplate.id}`)
      menuRef?.hide()
    }
  }
</script>

<ActionMenu
  bind:this={menuRef}
  disabled={false}
  roundedPopover
  align="left-outside"
  on:open={onMenuOpen}
  on:close={onMenuClose}
>
  <svelte:fragment slot="control">
    <div
      class="connection"
      role="button"
      tabindex="0"
      aria-haspopup="menu"
      aria-expanded={open}
    >
      <div class="connection-icon">
        <img src={group.icon} alt={group.name} />
      </div>
      {group.name}
    </div>
  </svelte:fragment>

  <div class="menu-content">
    <div class="menu-header">
      <div class="group-info">
        <div class="group-icon">
          <img src={group.icon} alt={group.name} />
        </div>
        <div class="group-details">
          <div class="group-name">{group.name}</div>
          {#if group.description}
            <div class="group-description">{group.description}</div>
          {/if}
        </div>
      </div>
    </div>

    <div class="menu-body">
      <div class="template-label">Select category</div>
      <div class="template-items">
        {#each templates as template (template.name)}
          {@const isSelected = selectedTemplate?.name === template.name}
          <span class="menu-item" class:selected={isSelected}>
            <MenuItem noClose on:click={() => selectTemplate(template)}>
              {template.name}
              <svelte:fragment slot="right">
                {#if isSelected}
                  <Icon name="check" size="S" />
                {/if}
              </svelte:fragment>
            </MenuItem>
          </span>
        {/each}
      </div>

      {#if selectedTemplate?.description}
        <div class="template-description">
          {selectedTemplate.description}
        </div>
      {/if}
    </div>

    <div class="menu-footer">
      <Button cta on:click={confirmSelection} disabled={!selectedTemplate}>
        Use template
      </Button>
    </div>
  </div>
</ActionMenu>

<style>
  .connection {
    display: flex;
    height: 38px;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    cursor: pointer;
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    background-color: var(--spectrum-global-color-gray-100);
    position: relative;
  }

  .connection:hover {
    background-color: var(--spectrum-global-color-gray-300);
  }

  .connection-icon {
    border-radius: 4px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    display: flex;
    width: 36px;
    height: 36px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    margin-right: 10px;
  }

  .connection-icon img {
    width: 20px;
    height: 20px;
  }

  .menu-content {
    width: 320px;
    display: flex;
    flex-direction: column;
  }

  .menu-header {
    padding: var(--spacing-m);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .group-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .group-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .group-icon img {
    width: 24px;
    height: 24px;
  }

  .group-details {
    flex: 1;
    min-width: 0;
  }

  .group-name {
    font-weight: 600;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-900);
  }

  .group-description {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
    margin-top: 2px;
  }

  .menu-body {
    padding: var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .template-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-700);
  }

  .template-items {
    max-height: 200px;
    overflow: auto;
  }

  .menu-item :global(.spectrum-Menu-item) {
    width: 100%;
  }

  .menu-item.selected :global(.spectrum-Menu-item) {
    background: var(--spectrum-global-color-gray-200);
    border-radius: var(--border-radius-s);
  }

  .menu-item :global(.spectrum-Menu-itemLabel) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .menu-item :global(.spectrum-Menu-item .icon) {
    flex: 0 0 24px;
    margin: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .template-description {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
    padding: var(--spacing-s);
    background: var(--spectrum-global-color-gray-100);
    border-radius: var(--border-radius-s);
    max-height: 80px;
    overflow: auto;
  }

  .menu-footer {
    padding: var(--spacing-m);
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    display: flex;
    justify-content: flex-end;
  }
</style>
