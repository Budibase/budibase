<script>
  import { sortBy } from "lodash/fp"
  import { automationStore } from "builderStore"
  import { DropdownMenu } from "@budibase/bbui"
  import { DropdownContainer, DropdownItem } from "components/common/Dropdowns"
  import analytics from "analytics"

  $: hasTrigger = $automationStore.selectedAutomation.hasTrigger()
  $: tabs = [
    {
      label: "Trigger",
      value: "TRIGGER",
      icon: "ri-organization-chart",
      disabled: hasTrigger,
    },
    {
      label: "Action",
      value: "ACTION",
      icon: "ri-flow-chart",
      disabled: !hasTrigger,
    },
    {
      label: "Logic",
      value: "LOGIC",
      icon: "ri-filter-line",
      disabled: !hasTrigger,
    },
  ]

  let buttonProps = []
  let selectedIndex
  let anchors = []
  let popover
  $: selectedTab = selectedIndex == null ? null : tabs[selectedIndex].value
  $: anchor = selectedIndex === -1 ? null : anchors[selectedIndex]
  $: blocks = sortBy(entry => entry[1].name)(
    Object.entries($automationStore.blockDefinitions[selectedTab] ?? {})
  )

  function onChangeTab(idx) {
    selectedIndex = idx
    popover.show()
  }

  function closePopover() {
    selectedIndex = null
    popover.hide()
  }

  function addBlockToAutomation(stepId, blockDefinition) {
    const newBlock = {
      ...blockDefinition,
      inputs: blockDefinition.inputs || {},
      stepId,
      type: selectedTab,
    }
    automationStore.actions.addBlockToAutomation(newBlock)
    analytics.captureEvent("Added Automation Block", {
      name: blockDefinition.name,
    })
    closePopover()
  }
</script>

<div class="tab-container">
  {#each tabs as tab, idx}
    <div
      bind:this={anchors[idx]}
      class="tab"
      class:disabled={tab.disabled}
      on:click={tab.disabled ? null : () => onChangeTab(idx)}
      class:active={idx === selectedIndex}>
      {#if tab.icon}<i class={tab.icon} />{/if}
      <span>{tab.label}</span>
      <i class="ri-arrow-down-s-line arrow" />
    </div>
  {/each}
</div>
<DropdownMenu
  on:close={() => (selectedIndex = null)}
  bind:this={popover}
  {anchor}
  align="left">
  <DropdownContainer>
    {#each blocks as [stepId, blockDefinition]}
      <DropdownItem
        icon={blockDefinition.icon}
        title={blockDefinition.name}
        subtitle={blockDefinition.description}
        on:click={() => addBlockToAutomation(stepId, blockDefinition)} />
    {/each}
  </DropdownContainer>
</DropdownMenu>

<style>
  .tab-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-l);
    min-height: 24px;
  }

  .tab {
    color: var(--grey-7);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size-xs);
  }
  .tab span {
    font-weight: 500;
    user-select: none;
  }
  .tab.active,
  .tab:not(.disabled):hover {
    color: var(--ink);
    cursor: pointer;
  }
  .tab.disabled {
    color: var(--grey-5);
  }
  .tab i:not(:last-child) {
    font-size: 16px;
  }
</style>
