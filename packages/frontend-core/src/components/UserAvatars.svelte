<script lang="ts">
  import { UserAvatar } from "@budibase/frontend-core"
  import { TooltipPosition, Avatar } from "@budibase/bbui"
  import type { UIUser } from "@budibase/types"

  type OrderType = "ltr" | "rtl"

  export let users: UIUser[] = []
  export let order: OrderType = "ltr"
  export let size: "XS" | "S" = "S"
  export let tooltipPosition: TooltipPosition = TooltipPosition.Top

  $: uniqueUsers = unique(users)
  $: avatars = getAvatars(uniqueUsers, order)

  const unique = (users: UIUser[]) => {
    const uniqueUsers: Record<string, UIUser> = {}
    users.forEach(user => {
      uniqueUsers[user.email] = user
    })
    return Object.values(uniqueUsers)
  }

  type Overflow = { _id: "overflow"; label: string }
  const getAvatars = (users: UIUser[], order: OrderType) => {
    const avatars: (Overflow | UIUser)[] = users.slice(0, 3)
    if (users.length > 3) {
      const overflow: Overflow = {
        _id: "overflow",
        label: `+${users.length - 3}`,
      }
      if (order === "ltr") {
        avatars.push(overflow)
      } else {
        avatars.unshift(overflow)
      }
    }

    return avatars.map((user, idx) => ({
      ...user,
      zIndex: order === "ltr" ? idx : uniqueUsers.length - idx,
    }))
  }

  function isUser(value: Overflow | UIUser): value is UIUser {
    return value._id !== "overflow"
  }
</script>

<div class="avatars">
  {#each avatars as user}
    <span style="z-index:{user.zIndex};">
      {#if !isUser(user)}
        <Avatar
          {size}
          initials={user.label}
          color="var(--spectrum-global-color-gray-500)"
        />
      {:else}
        <UserAvatar {size} {user} {tooltipPosition} />
      {/if}
    </span>
  {/each}
</div>

<style>
  .avatars {
    display: flex;
  }
  span:not(:first-of-type) {
    margin-left: -6px;
  }
  .avatars :global(.spectrum-Avatar) {
    border: 2px solid var(--avatars-background, var(--background));
  }
</style>
