<script>
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"

  export let value

  const groupAppsContext = getContext("groupApps")

  const onClick = e => {
    e.stopPropagation()
    groupAppsContext.removeApp(value)
  }
</script>

<ActionButton
  disabled={groupAppsContext.getReadonly?.()}
  size="S"
  on:click={onClick}
>
  Remove
</ActionButton>
