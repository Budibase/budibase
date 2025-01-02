<script>
  import { StatusLight } from "@budibase/bbui"
  import { roles } from "@/stores/builder"

  export let id
  export let size = "M"
  export let disabled = false

  $: color =
    $roles.find(x => x._id === id)?.color ||
    "var(--spectrum-global-color-static-magenta-400)"
</script>

<StatusLight square {disabled} {size} {color} />
