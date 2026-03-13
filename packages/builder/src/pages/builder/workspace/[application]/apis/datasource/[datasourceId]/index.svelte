<script>
  import { params, redirect } from "@roxi/routify"
  import { queries } from "@/stores/builder"

  $redirect

  $: firstQuery = $queries.list.find(
    q => q.datasourceId === $params.datasourceId
  )
  $: {
    if (firstQuery) {
      $redirect(`../../query/${firstQuery._id}`)
    } else {
      $redirect("../../query/new")
    }
  }
</script>
