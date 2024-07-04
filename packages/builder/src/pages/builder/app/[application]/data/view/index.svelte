<script>
import { redirect } from "@roxi/routify"
import { views, viewsV2 } from "stores/builder"
import { onMount } from "svelte"

onMount(async () => {
  if ($viewsV2.selected) {
    $redirect(`./v2/${$viewsV2.selected.id}`)
  } else if ($viewsV2.list?.length) {
    $redirect(`./v2/${$viewsV2.list[0].id}`)
  } else if ($views.selected) {
    $redirect(`./${encodeURIComponent($views.selected?.name)}`)
  } else if ($views.list?.length) {
    $redirect(`./${encodeURIComponent($views.list[0].name)}`)
  } else {
    $redirect("../")
  }
})
</script>
