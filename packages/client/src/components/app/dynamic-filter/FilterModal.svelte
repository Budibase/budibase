<script>
  import { FilterBuilder } from "@budibase/frontend-core"

  export let schemaFields
  export let filters = []
  export let datasource
</script>

<FilterBuilder bind:filters {schemaFields} {datasource} />
