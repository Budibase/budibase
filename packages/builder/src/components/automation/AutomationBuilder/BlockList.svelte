<script>
  import { sortBy } from "lodash/fp"
  import { automationStore } from "builderStore"
  import { ActionButton, Popover, Modal } from "@budibase/bbui"
  import { DropdownContainer, DropdownItem } from "components/common/Dropdowns"
  import CreateWebhookModal from "../Shared/CreateWebhookModal.svelte"

  $: hasTrigger = $automationStore.selectedAutomation.hasTrigger()
  $: tabs = [
    {
      label: "Trigger",
      value: "TRIGGER",
      icon: "Algorithm",
      disabled: hasTrigger,
    },
    {
      label: "Action",
      value: "ACTION",
      icon: "Actions",
      disabled: !hasTrigger,
    },
    {
      label: "Logic",
      value: "LOGIC",
      icon: "Filter",
      disabled: !hasTrigger,
    },
  ]

  let selectedIndex
  let anchors = []
  let popover
  let webhookModal
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
    const newBlock = $automationStore.selectedAutomation.constructBlock(
      selectedTab,
      stepId,
      blockDefinition
    )
    automationStore.actions.addBlockToAutomation(newBlock)
    closePopover()
    if (stepId === "WEBHOOK") {
      webhookModal.show()
    }
  }
</script>

<div class="tab-container">
  {#each tabs as tab, idx}
    <div bind:this={anchors[idx]}>
      <ActionButton
        quiet
        size="S"
        icon={tab.icon}
        disabled={tab.disabled}
        on:click={tab.disabled ? null : () => onChangeTab(idx)}
      >
        {tab.label}
      </ActionButton>
    </div>
  {/each}
</div>
<Popover
  on:close={() => (selectedIndex = null)}
  bind:this={popover}
  {anchor}
  align="left"
>
  <DropdownContainer>
    {#each blocks as [stepId, blockDefinition]}
      <DropdownItem
        icon={blockDefinition.icon}
        title={blockDefinition.name}
        subtitle={blockDefinition.description}
        on:click={() => addBlockToAutomation(stepId, blockDefinition)}
      />
    {/each}
  </DropdownContainer>
</Popover>
<Modal bind:this={webhookModal} width="30%">
  <CreateWebhookModal />
</Modal>

<style>
  .tab-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    min-height: 24px;
  }
</style>
