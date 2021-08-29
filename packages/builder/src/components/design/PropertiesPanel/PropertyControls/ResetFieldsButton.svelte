<script>
  import { ActionButton } from "@budibase/bbui"
  import { currentAsset, store } from "builderStore"
  import { findClosestMatchingComponent } from "builderStore/storeUtils"
  import { makeDatasourceFormComponents } from "builderStore/store/screenTemplates/utils/commonComponents"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { _ as t } from "svelte-i18n"

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
    { $t('update-form-fields') }
  </ActionButton>
</div>

<ConfirmDialog
  bind:this={confirmResetFieldsDialog}
  body={$t('all-components-inside-this-group-will-be-deleted-and-replaced-with-fields-to-match-the-schema-are-you-sure-you-want-to-update-this-field-group')}
  okText={ $t('update') }
  onOk={resetFormFields}
  title={ $t('confirm-form-field-update') }
/>
