<script>
  import { FilterBuilder } from "@budibase/frontend-core"

  export let schemaFields
  export let filters = []
  export let datasource
</script>

<FilterBuilder bind:filters {schemaFields} {datasource} filtersLabel={null}>
  <div slot="filtering-hero-content">
    Results are filtered to only those which match all of the following
    constraints.
  </div>
</FilterBuilder>
