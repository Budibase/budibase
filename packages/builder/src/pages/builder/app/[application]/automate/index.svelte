<script>
  import { redirect } from "@roxi/routify"
  import { onMount } from "svelte"
  import { automationStore } from "builderStore"

  onMount(() => {
    if ($automationStore.automations?.length) {
      $redirect(`./${$automationStore.automations[0]._id}`)
    }
  })
</script>
