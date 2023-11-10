<script>
  import { UserAvatar } from "@budibase/frontend-core"
  import { TooltipPosition, Avatar } from "@budibase/bbui"

  export let users = []
  export let order = "ltr"
  export let size = "S"
  export let tooltipPosition = TooltipPosition.Top

  $: uniqueUsers = unique(users, order)
  $: avatars = getAvatars(uniqueUsers, order)

  const unique = users => {
    let uniqueUsers = {}
    users?.forEach(user => {
      uniqueUsers[user.email] = user
    })
    return Object.values(uniqueUsers)
  }

  const getAvatars = (users, order) => {
    const avatars = users.slice(0, 3)
    if (users.length > 3) {
      const overflow = {
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
</script>

<div class="avatars">
  {#each avatars as user}
    <span style="z-index:{user.zIndex};">
      {#if user._id === "overflow"}
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
