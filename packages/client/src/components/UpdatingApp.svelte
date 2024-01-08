<script>
  import { Updating } from "@budibase/frontend-core"

  async function onMigrationDone() {
    window.location.reload()
  }
</script>

<Updating {onMigrationDone} />
