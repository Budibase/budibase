<script>
  import { Select, Label } from "@budibase/bbui"
  import { selectedScreen } from "@/stores/builder"
  import { findAllMatchingComponents } from "@/helpers/components"

  export let parameters

  $: components = findAllMatchingComponents($selectedScreen?.props, component =>
    component._component.endsWith("s3upload")
  )
</script>

<div class="root">
  <Label small>S3 Upload Component</Label>
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
