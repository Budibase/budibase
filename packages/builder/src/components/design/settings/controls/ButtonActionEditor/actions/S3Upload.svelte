<script>
  import { Select, Label } from "@budibase/bbui"
  import { currentAsset } from "builderStore"
  import { findAllMatchingComponents } from "builderStore/componentUtils"

  import { _ } from "../../../../../../../lang/i18n"

  export let parameters

  $: components = findAllMatchingComponents($currentAsset?.props, component =>
    component._component.endsWith("s3upload")
  )
</script>

<div class="root">
  <Label small
    >{$_(
      "components.design.settings.controls.ButtonActionEditor.actions.S3Upload.Upload_Component"
    )}</Label
  >
  <Select
    bind:value={parameters.componentId}
    options={components}
    getOptionLabel={x => x._instanceName}
    getOptionValue={x => x._id}
  />
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 120px 1fr;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
  }
</style>
