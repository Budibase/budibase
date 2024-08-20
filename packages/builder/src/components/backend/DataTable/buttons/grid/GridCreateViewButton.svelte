<script>
  import { getContext } from "svelte"
  import { Modal, ActionButton, TooltipType, TempTooltip } from "@budibase/bbui"
  import GridCreateViewModal from "../../modals/grid/GridCreateViewModal.svelte"

  const { filter } = getContext("grid")

  let modal
  let firstFilterUsage = false

  $: {
    if ($filter?.length && !firstFilterUsage) {
      firstFilterUsage = true
    }
  }
</script>

<TempTooltip
  text="Create a view to save your filters"
  type={TooltipType.Info}
  condition={firstFilterUsage}
>
  <ActionButton icon="CollectionAdd" quiet on:click={modal.show}>
    Create view
  </ActionButton>
</TempTooltip>
<Modal bind:this={modal}>
  <GridCreateViewModal />
</Modal>
