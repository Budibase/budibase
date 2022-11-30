<script>
  import { datasources } from "stores/backend"
  import { DEFAULT_BB_DATASOURCE_ID } from "constants/backend"

  datasources.select(DEFAULT_BB_DATASOURCE_ID)
</script>

<slot />
