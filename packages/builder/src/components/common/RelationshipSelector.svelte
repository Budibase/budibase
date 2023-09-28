<script>
  import { Select, Input } from "@budibase/bbui"

  export let relationshipPart1
  export let relationshipPart2
  export let relationshipTableIdPrimary
  export let relationshipTableIdSecondary
  export let editableColumn
  export let linkEditDisabled = false
  export let tableOptions
  export let errors
  export let relationshipOpts1
  export let relationshipOpts2
  export let primaryTableChanged
  export let secondaryTableChanged
  export let primaryDisabled = true
</script>

<div class="relationship-container">
  <div class="relationship-part">
    <Select
      disabled={linkEditDisabled}
      bind:value={relationshipPart1}
      options={relationshipOpts1}
      bind:error={errors.relationshipType}
    />
  </div>
  <div class="relationship-label">in</div>
  <div class="relationship-part">
    <Select
      disabled={primaryDisabled}
      options={tableOptions}
      getOptionLabel={table => table.name}
      getOptionValue={table => table._id}
      bind:value={relationshipTableIdPrimary}
      on:change={primaryTableChanged}
      bind:error={errors.fromTable}
    />
  </div>
</div>
<div class="relationship-container">
  <div class="relationship-part">
    <Select
      disabled={linkEditDisabled}
      bind:value={relationshipPart2}
      options={relationshipOpts2}
      getOptionLabel={option => "To " + option.toLowerCase()}
    />
  </div>
  <div class="relationship-label">in</div>
  <div class="relationship-part">
    <Select
      disabled={linkEditDisabled}
      bind:value={relationshipTableIdSecondary}
      bind:error={errors.toTable}
      options={tableOptions.filter(
        table => table._id !== relationshipTableIdPrimary
      )}
      getOptionLabel={table => table.name}
      getOptionValue={table => table._id}
      on:change={secondaryTableChanged}
    />
  </div>
</div>
{#if editableColumn}
  <Input
    disabled={linkEditDisabled}
    label={`Column name in other table`}
    bind:value={editableColumn.fieldName}
    error={errors.relatedName}
  />
{/if}

<style>
  .relationship-container {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .relationship-part {
    flex-basis: 60%;
  }
</style>
