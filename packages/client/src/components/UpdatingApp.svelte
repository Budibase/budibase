<script>
  import { Updating } from "@budibase/frontend-core"
  import { API } from "../api"

  async function isMigrationDone() {
    const response = await API.getMigrationStatus()
    return response.migrated
  }

  async function onMigrationDone() {
    window.location.reload()
  }
</script>

<Updating {isMigrationDone} {onMigrationDone} />
