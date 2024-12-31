<script>
  import { ActionButton, notifications } from "@budibase/bbui"
  import { selectedScreen, componentStore } from "@/stores/builder"
  import { findClosestMatchingComponent } from "@/helpers/components"
  import { makeDatasourceFormComponents } from "@/templates/commonComponents"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"

  export let componentInstance

  let confirmResetFieldsDialog

  const resetFormFields = async () => {
    const form = findClosestMatchingComponent(
      $selectedScreen?.props,
      componentInstance._id,
      component => component._component.endsWith("/form")
    )
    const dataSource = form?.dataSource
    const fields = makeDatasourceFormComponents(dataSource)
    try {
      await componentStore.updateSetting(
        "_children",
        fields.map(field => field.json())
      )
    } catch (error) {
      notifications.error("Error resetting form fields")
    }
  }
</script>

<div>
  <ActionButton
    secondary
    wide
    on:click={() => confirmResetFieldsDialog?.show()}
  >
    Update form fields
  </ActionButton>
</div>

<ConfirmDialog
  bind:this={confirmResetFieldsDialog}
  body={`All components inside this group will be deleted and replaced with fields to match the schema. Are you sure you want to update this Field Group?`}
  okText="Update"
  onOk={resetFormFields}
  title="Confirm Form Field Update"
/>
