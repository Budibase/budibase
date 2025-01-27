<script>
  import { onMount } from "svelte"
  import { queries } from "@/stores/builder"
  import { redirect } from "@roxi/routify"

  onMount(async () => {
    const { list, selected } = $queries
    if (selected) {
      $redirect(`./${selected?._id}`)
    } else if (list?.length) {
      $redirect(`./${list[0]._id}`)
    } else {
      $redirect("../")
    }
  })
</script>
