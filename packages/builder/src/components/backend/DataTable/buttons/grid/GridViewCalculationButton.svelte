<script>
  import { ActionButton, Modal, ModalContent } from "@budibase/bbui"
  import { CalculationType } from "@budibase/types"
  import { API } from "api"
  import { getContext, createEventDispatcher } from "svelte"

  const { definition } = getContext("grid")
  const dispatch = createEventDispatcher()

  let modal

  const save = async () => {
    await API.viewV2.update({
      ...$definition,
      schema: {
        "Average game length": {
          visible: true,
          calculationType: CalculationType.AVG,
          field: "Game Length",
        },
      },
    })
  }
</script>

<ActionButton icon="WebPage" quiet on:click={modal?.show}>
  Configure calculations
</ActionButton>

<Modal bind:this={modal}>
  <ModalContent
    title="Calculations"
    confirmText="Save"
    size="L"
    onConfirm={save}
  >
    Show calculations which are based on
  </ModalContent>
</Modal>
