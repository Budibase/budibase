<script>
  import { Icon, TooltipPosition, TooltipType, Modal } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { licensing } from "stores/portal"
  import { selectedAutomation } from "stores/builder"
  import { isStepLimitExceeded } from "@budibase/shared-core"

  import ActionModal from "./ActionModal.svelte"

  export let block

  const dispatch = createEventDispatcher()
  const automationStepLimit =
    $licensing.license.quotas.usage.static.automationStepCount.value

  let actionModal

  $: canAddMoreSteps =
    automationStepLimit === -1 &&
    !isStepLimitExceeded($selectedAutomation.data, automationStepLimit)
</script>

<Modal bind:this={actionModal} width="30%">
  <ActionModal modal={actionModal} {block} />
</Modal>

<div class="action-bar">
  {#if !block.branchNode}
    <Icon
      hoverable
      name="Branch3"
      on:click={() => {
        dispatch("branch")
      }}
      tooltipType={TooltipType.Info}
      tooltipPosition={TooltipPosition.Left}
      tooltip={"Create branch"}
    />
  {/if}
  <Icon
    hoverable
    disabled={!canAddMoreSteps}
    name="AddCircle"
    on:click={() => {
      if (canAddMoreSteps) {
        actionModal.show()
      }
    }}
    tooltipType={TooltipType.Info}
    tooltipPosition={TooltipPosition.Right}
    tooltip={canAddMoreSteps
      ? "Add a step"
      : `Maximum of ${automationStepLimit} action steps reached`}
  />
</div>

<style>
  .action-bar {
    background-color: var(--background);
    border-radius: 4px 4px 4px 4px;
    display: flex;
    gap: var(--spacing-m);
    padding: var(--spacing-m);
  }
</style>
