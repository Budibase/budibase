<script>
  import { Updating } from "@budibase/frontend-core"

  async function onMigrationDone() {
    window.location.reload()
  }
</script>

<div class="updating">
  <Updating {onMigrationDone} />
</div>

<style>
  .updating {
    font-family: var(--font-sans);
  }
</style>
