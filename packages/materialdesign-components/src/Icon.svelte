<script>
  import { getContext } from "svelte"

  export let icon = ""

  let iconContext = getContext("BBMD:icon:context")
  let cls = iconContext
    ? `material-icons mdc-${iconContext}__icon`
    : "material-icons"
</script>

<i class={cls}>{icon}</i>
