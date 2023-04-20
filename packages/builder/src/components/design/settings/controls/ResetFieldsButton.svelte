<script>
  import { _ } from "../../../../../lang/i18n"
  import { ActionButton, notifications } from "@budibase/bbui"
  import { currentAsset, store } from "builderStore"
  import { findClosestMatchingComponent } from "builderStore/componentUtils"
  import { makeDatasourceFormComponents } from "builderStore/store/screenTemplates/utils/commonComponents"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let componentInstance

  let confirmResetFieldsDialog

  const resetFormFields = async () => {
    const form = findClosestMatchingComponent(
      $currentAsset?.props,
      componentInstance._id,
      component => component._component.endsWith("/form")
    )
    const dataSource = form?.dataSource
    const fields = makeDatasourceFormComponents(dataSource)
    try {
      await store.actions.components.updateSetting(
        "_children",
        fields.map(field => field.json())
      )
    } catch (error) {
      notifications.error(
        $_(
          "components.design.settings.controls.ResetFieldsButton.Error_resetting"
        )
      )
    }
  }
</script>

<div>
  <ActionButton
    secondary
    wide
    on:click={() => confirmResetFieldsDialog?.show()}
  >
    {$_("components.design.settings.controls.ResetFieldsButton.Update_fields ")}
  </ActionButton>
</div>

<ConfirmDialog
  bind:this={confirmResetFieldsDialog}
  body={`${$_(
    "components.design.settings.controls.ResetFieldsButton.component_deleted"
  )}`}
  okText={$_("components.design.settings.controls.ResetFieldsButton.Update")}
  onOk={resetFormFields}
  title={$_(
    "components.design.settings.controls.ResetFieldsButton.Confirm_Form"
  )}
/>
