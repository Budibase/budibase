<script lang="ts">
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { auth } from "@/stores/portal/auth"
  import { sdk } from "@budibase/shared-core"
  import type { User } from "@budibase/types"

  interface Props {
    value: string
    row: User
  }

  interface GroupContext {
    removeGroup: (groupId: string) => void | Promise<void>
  }

  let { value, row }: Props = $props()

  const groupContext = getContext<GroupContext>("groups")

  const onClick = (event: MouseEvent) => {
    event.stopPropagation()
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
