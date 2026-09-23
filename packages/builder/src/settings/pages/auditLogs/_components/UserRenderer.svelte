<script lang="ts">
  import { UserAvatar } from "@budibase/frontend-core"
  import type { AuditLogEnriched } from "@budibase/types"

  interface Props {
    row: AuditLogEnriched
  }

  let { row }: Props = $props()
  const user = $derived(row.user)
  const displayUser = $derived(
    user.email ? { ...user, email: user.email } : undefined
  )
</script>

<UserAvatar user={displayUser} />
