<script>
  import { Select, Input } from "@budibase/bbui"
  import { PrettyRelationshipDefinitions } from "constants/backend"

  export let relationshipPart1
  export let relationshipPart2
  export let relationshipTableIdPrimary
  export let relationshipTableIdSecondary
  export let editableColumn
  export let linkEditDisabled
  export let tableOptions
  export let errors
  export let relationshipOpts1
  export let relationshipOpts2
</script>

<div class="relationship-container">
  <div class="relationship-part">
    <Select
      disabled={linkEditDisabled}
      bind:value={relationshipPart1}
      options={relationshipOpts1}
    />
  </div>
  <div class="relationship-label">in</div>
  <div class="relationship-part">
    <Select
      disabled
      options={[relationshipTableIdPrimary]}
      value={relationshipTableIdPrimary}
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
      options={tableOptions}
      getOptionLabel={table => table.name}
      getOptionValue={table => table._id}
    />
  </div>
</div>
<Input
  disabled={linkEditDisabled}
  label={`Column name in other table`}
  bind:value={editableColumn.fieldName}
  error={errors.relatedName}
/>

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
