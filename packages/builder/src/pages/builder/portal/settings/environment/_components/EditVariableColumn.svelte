<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { environment } from "stores/portal"
  import CreateEditVariableModal from "components/portal/environment/CreateEditVariableModal.svelte"

  import { _ } from "../../../../../../../lang/i18n"

  export let row

  let editVariableModal
  let deleteDialog

  const save = async data => {
    await environment.updateVariable(data)
    editVariableModal.hide()
  }
</script>

<ActionButton size="S" on:click={editVariableModal.show}
  >{$_(
    "pages.builder.portal.settings.enviroment._components.EditVariableColumn.Edit"
  )}</ActionButton
>

<Modal bind:this={editVariableModal}>
  <CreateEditVariableModal {row} {save} />
</Modal>

<ConfirmDialog
  bind:this={deleteDialog}
  onOk={async () => {
    await environment.deleteVariable(row.name)
  }}
  okText={$_(
    "pages.builder.portal.settings.enviroment._components.EditVariableColumn.Delete_Environment"
  )}
  title={$_(
    "pages.builder.portal.settings.enviroment._components.EditVariableColumn.Confirm_Deletion"
  )}
>
  {$_(
    "pages.builder.portal.settings.enviroment._components.EditVariableColumn.delete_environment"
  )}
  <i>{row.name}?</i>
  {$_(
    "pages.builder.portal.settings.enviroment._components.EditVariableColumn.action_undone"
  )}
</ConfirmDialog>
