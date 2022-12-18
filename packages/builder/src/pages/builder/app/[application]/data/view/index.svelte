<script>
  import { onMount } from "svelte"
  import { views } from "stores/backend"
  import { redirect } from "@roxi/routify"

  onMount(async () => {
    const { list, selected } = $views
    if (selected) {
      $redirect(`./${selected?.name}`)
    } else if (list?.length) {
      $redirect(`./${list[0].name}`)
    } else {
      $redirect("../")
    }
  })
</script>
