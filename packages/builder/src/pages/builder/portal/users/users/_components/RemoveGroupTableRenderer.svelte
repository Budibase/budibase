<script>
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { auth } from "@/stores/portal"
  import { sdk } from "@budibase/shared-core"

  export let value
  export let row

  const groupContext = getContext("groups")

  const onClick = e => {
    e.stopPropagation()
    groupContext.removeGroup(value)
  }

  $: disabled = !sdk.users.isAdmin($auth.user) || row?.scimInfo?.isSync
  $: tooltip = row?.scimInfo?.isSync && "This group is managed via your AD"
</script>

<ActionButton {disabled} size="S" on:click={onClick} {tooltip}
  >Remove</ActionButton
>
