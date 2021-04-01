<script>
<<<<<<< HEAD
  import { params } from "@roxi/routify"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import * as api from "./api"
=======
>>>>>>> d803aa0bd7a74220e432f4a1b338abdd7fbe9b7d
  import Table from "./Table.svelte"

  export let query = {}
  export let data = []

  let loading = false
  let error = false
</script>

{#if error}
  <div class="errors">{error}</div>
{/if}
<Table title={''} schema={query.schema} {data} {loading} />

<style>
  .errors {
    color: var(--red);
    background: var(--red-light);
    padding: var(--spacing-m);
    border-radius: var(--border-radius-m);
    margin-bottom: var(--spacing-m);
  }
</style>
