<script>
  import { DetailSummary, ActionButton } from "@budibase/bbui"
  import { currentAsset, store } from "builderStore"
  import { findClosestMatchingComponent } from "builderStore/storeUtils"
  import { makeDatasourceFormComponents } from "builderStore/store/screenTemplates/utils/commonComponents"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let openSection
  export let componentDefinition
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

<DetailSummary name="Actions" on:open show={openSection === "actions"}>
  <ActionButton secondary wide on:click={store.actions.components.resetStyles}>
    Reset styles
  </ActionButton>
  {#if componentDefinition?.component?.endsWith("/fieldgroup")}
    <ActionButton
      secondary
      wide
      on:click={() => confirmResetFieldsDialog?.show()}
    >
      Update form fields
    </ActionButton>
  {/if}
</DetailSummary>

<ConfirmDialog
  bind:this={confirmResetFieldsDialog}
  body={`All components inside this group will be deleted and replaced with fields to match the schema. Are you sure you want to update this Field Group?`}
  okText="Update"
  onOk={resetFormFields}
  title="Confirm Form Field Update"
/>
