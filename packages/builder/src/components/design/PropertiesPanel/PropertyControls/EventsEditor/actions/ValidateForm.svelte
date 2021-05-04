<script>
  import { Select, Label } from "@budibase/bbui"
  import { currentAsset, store } from "builderStore"
  import { getActionProviderComponents } from "builderStore/dataBinding"

  export let parameters

  $: actionProviders = getActionProviderComponents(
    $currentAsset,
    $store.selectedComponentId,
    "ValidateForm"
  )
</script>

<div class="root">
  <Label small>Form</Label>
  <Select
    bind:value={parameters.componentId}
    options={actionProviders}
<<<<<<< HEAD
    getOptionLabel={(x) => x._instanceName}
    getOptionValue={(x) => x._id}
=======
    getOptionLabel={x => x._instanceName}
    getOptionValue={x => x._id}
>>>>>>> 900637c221e4034babd21d69dcaa71b360a2adb2
  />
</div>

<style>
  .root {
    display: flex;
    flex-direction: row;
    align-items: center;
    max-width: 800px;
    margin: 0 auto;
  }

  .root :global(> div) {
    flex: 1;
    margin-left: var(--spacing-l);
  }
</style>
