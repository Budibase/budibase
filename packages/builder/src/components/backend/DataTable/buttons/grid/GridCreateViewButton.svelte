<script>
import { ActionButton, Modal, TempTooltip, TooltipType } from "@budibase/bbui"
import { getContext } from "svelte"
import GridCreateViewModal from "../../modals/grid/GridCreateViewModal.svelte"

const { rows, columns, filter } = getContext("grid")

let modal
let firstFilterUsage = false

$: disabled = !$columns.length || !$rows.length
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
  <ActionButton {disabled} icon="CollectionAdd" quiet on:click={modal.show}>
    Create view
  </ActionButton>
</TempTooltip>
<Modal bind:this={modal}>
  <GridCreateViewModal />
</Modal>
