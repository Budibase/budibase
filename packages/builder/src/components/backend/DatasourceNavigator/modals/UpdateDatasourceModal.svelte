<script>
  import { datasources } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import { Input, ModalContent, Modal } from "@budibase/bbui"
  import { _ } from "../../../../../lang/i18n"

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
      error = `${$_(
        "components.backend.DatasourceNavigation.modals.UpdateDatasourceModal.Datasource_name"
      )} ${datasourceName} ${$_(
        "components.backend.DatasourceNavigation.modals.UpdateDatasourceModal.another_name"
      )}`
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
    notifications.success(
      `${$_(
        "components.backend.DatasourceNavigation.modals.UpdateDatasourceModal.Datasource"
      )} ${name} ${$_(
        "components.backend.DatasourceNavigation.modals.UpdateDatasourceModal.Updated_successfully"
      )}`
    )
    hide()
  }
</script>

<Modal bind:this={modal} on:hide={onCancel}>
  <ModalContent
    title={$_(
      "components.backend.DatasourceNavigation.modals.UpdateDatasourceModal.Edit_Datasource"
    )}
    size="L"
    confirmText={$_(
      "components.backend.DatasourceNavigation.modals.UpdateDatasourceModal.Save"
    )}
    onConfirm={updateDatasource}
    disabled={error || !name || !datasource?.type}
  >
    <Input
      label={$_(
        "components.backend.DatasourceNavigation.modals.UpdateDatasourceModal.Datasource_Name"
      )}
      on:input={checkValid}
      bind:value={name}
      {error}
    />
  </ModalContent>
</Modal>
