<script>
  import { Icon, TooltipPosition, TooltipType, Modal } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import ActionModal from "./ActionModal.svelte"

  export let block

  const dispatch = createEventDispatcher()
  let actionModal
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
      size={"S"}
    />
  {/if}
  <Icon
    hoverable
    name="AddCircle"
    on:click={() => {
      actionModal.show()
    }}
    tooltipType={TooltipType.Info}
    tooltipPosition={TooltipPosition.Right}
    tooltip={"Add a step"}
    size={"S"}
  />
</div>

<style>
  .action-bar {
    background-color: var(--background);
    border-radius: 4px 4px 4px 4px;
    display: flex;
    gap: var(--spacing-m);
    padding: 8px 12px;
    cursor: default;
  }
</style>
