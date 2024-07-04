<script>
import { Label, Select } from "@budibase/bbui"
import { getActionProviders } from "dataBinding"
import { componentStore, selectedScreen } from "stores/builder"

export let parameters
export let nested

$: actionProviders = getActionProviders(
  $selectedScreen,
  $componentStore.selectedComponentId,
  "ClearForm",
  { includeSelf: nested }
)
</script>

<div class="root">
  <Label small>Form</Label>
  <Select
    bind:value={parameters.componentId}
    options={actionProviders}
    getOptionLabel={x => x.readableBinding}
    getOptionValue={x => x.runtimeBinding}
  />
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
  }
</style>
