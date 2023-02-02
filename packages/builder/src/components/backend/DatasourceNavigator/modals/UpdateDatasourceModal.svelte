<script>
  import { datasources } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import { Input, ModalContent, Modal } from "@budibase/bbui"

  let error = ""
  let modal
  let name

  export let datasource
  export let onCancel = undefined

  export const show = () => {
    name = datasource?.name
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }

  function checkValid(evt) {
    const datasourceName = evt.target.value
    if ($datasources?.list.some(ds => ds.name === datasourceName)) {
      error = `Datasource with name ${datasourceName} already exists. Please choose another name.`
      return
    }
    error = ""
  }

  async function updateDatasource() {
    const updatedDatasource = {
      ...datasource,
      name,
    }
    await datasources.save(updatedDatasource)
    notifications.success(`Datasource ${name} updated successfully.`)
    hide()
  }
</script>

<Modal bind:this={modal} on:hide={onCancel}>
  <ModalContent
    title="Edit Datasource"
    size="L"
    confirmText="Save"
    onConfirm={updateDatasource}
    disabled={error || !name || !datasource?.type}
  >
    <Input
      label="Datasource Name"
      on:input={checkValid}
      bind:value={name}
      {error}
    />
  </ModalContent>
</Modal>
