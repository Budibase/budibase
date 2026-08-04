<svelte:options runes={true} />

<script>
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { auth } from "@/stores/portal/auth"
  import { sdk } from "@budibase/shared-core"

  let { value, row } = $props()

  const groupContext = getContext("groups")

  const onClick = e => {
    e.stopPropagation()
    groupContext.removeGroup(value)
  }

  const disabled = $derived(
    !sdk.users.isAdmin($auth.user) || row?.scimInfo?.isSync
  )
  const tooltip = $derived(
    row?.scimInfo?.isSync && "This group is managed via your AD"
  )
</script>

<ActionButton {disabled} size="S" on:click={onClick} {tooltip}
  >Remove</ActionButton
>
