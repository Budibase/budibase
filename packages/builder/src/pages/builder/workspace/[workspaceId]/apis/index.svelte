<script lang="ts">
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"
  import { datasources, queries } from "@/stores/builder"
  import { IntegrationTypes } from "@/constants/backend"

  onMount(() => {
    const restDatasources = ($datasources.list || [])
      .filter(datasource => datasource.source === IntegrationTypes.REST)
      .sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", undefined, {
          sensitivity: "base",
        })
      )

    if (!restDatasources.length) {
      $redirect("./new")
      return
    }

    // Prefer the first alphabetical datasource that has queries
    for (const ds of restDatasources) {
      const firstQuery = $queries.list.find(q => q.datasourceId === ds._id)
      if (firstQuery) {
        $redirect(`./query/${firstQuery._id}`)
        return
      }
    }

    // Has connections but no queries — go to new query
    $redirect("./query/new")
  })
</script>
