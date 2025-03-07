<script>
  import { Label, Select, Body } from "@budibase/bbui"
  import { findAllMatchingComponents } from "@/helpers/components"
  import { selectedScreen } from "@/stores/builder"
  import { InlineAlert } from "@budibase/bbui"

  export let parameters

  $: tables = findAllMatchingComponents($selectedScreen?.props, component =>
    component._component.endsWith("table")
  ).map(table => ({
    label: table._instanceName,
    value: table._id,
  }))
  $: tableBlocks = findAllMatchingComponents(
    $selectedScreen?.props,
    component => component._component.endsWith("tableblock")
  ).map(block => ({
    label: block._instanceName,
    value: `${block._id}-table`,
  }))
  $: componentOptions = tables.concat(tableBlocks)
</script>

<div class="root">
  <Body size="S">Clear the row selection from the selected table.</Body>
  <div class="params">
    <Label small>Table</Label>
    <Select bind:value={parameters.componentId} options={componentOptions} />
  </div>
  <InlineAlert
    header="Legacy action"
    message="This action is only compatible with the (deprecated) Table Block. Please see the documentation for further info."
    link="https://docs.budibase.com/docs/data-actions#clear-row-selection"
    linkText="Budibase Documentation"
  />
</div>

<style>
  .root {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xl);
  }

  .root :global(p) {
    line-height: 1.5;
  }

  .params {
    display: grid;
    column-gap: var(--spacing-xs);
    row-gap: var(--spacing-s);
    grid-template-columns: 90px 1fr;
    align-items: center;
  }
</style>
