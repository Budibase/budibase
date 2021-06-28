<script>
  import { ActionButton } from "@budibase/bbui"
  import { currentAsset, store } from "builderStore"
  import { findClosestMatchingComponent } from "builderStore/storeUtils"
  import { makeDatasourceFormComponents } from "builderStore/store/screenTemplates/utils/commonComponents"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let componentInstance

  let confirmResetFieldsDialog

  const resetFormFields = () => {
    const form = findClosestMatchingComponent(
      $currentAsset.props,
      componentInstance._id,
      component => component._component.endsWith("/form")
    )
    const dataSource = form?.dataSource
    const fields = makeDatasourceFormComponents(dataSource)
    store.actions.components.updateProp(
      "_children",
      fields.map(field => field.json())
    )
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
