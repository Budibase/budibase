<script>
  import {
    ActionButton,
    Button,
    Modal,
    ModalContent,
    Input,
    Heading,
    Checkbox,
  } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let row

  let editVariableModal
  let deleteDialog

  let productionTouched = false
  let developmentTouched = false

  let productionValue = "******"
  let developmentValue = "******"

  let useProductionValue
</script>

<ActionButton size="S" on:click={editVariableModal.show}>Edit</ActionButton>

<Modal bind:this={editVariableModal}>
  <ModalContent disabled={!productionTouched && !developmentTouched}>
    <Input label="Name" value={row.name} />

    <div>
      <Heading size="XS">Production</Heading>
      <Input
        on:change={() => (productionTouched = true)}
        label="Value"
        bind:value={productionValue}
      />
    </div>
    <div>
      <Heading size="XS">Development</Heading>
      <Input
        disabled={useProductionValue}
        on:change={() => (developmentTouched = true)}
        label="Value"
        bind:value={developmentValue}
      />
      <Checkbox bind:value={useProductionValue} text="Use production value" />
    </div>

    <div class="footer" slot="footer">
      <Button on:click={deleteDialog.show} warning>Delete</Button>
    </div>
  </ModalContent>
</Modal>

<ConfirmDialog
  bind:this={deleteDialog}
  onOk={() => {
    console.log("delete")
  }}
  okText="Delete Environment Variable"
  title="Confirm Deletion"
>
  Are you sure you wish to delete the environment variable
  <i>{row.name}?</i>
  This action cannot be undone.
</ConfirmDialog>
