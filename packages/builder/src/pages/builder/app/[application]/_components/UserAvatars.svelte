<script>
  import { UserAvatar } from "@budibase/frontend-core"
  import { TooltipPosition } from "@budibase/bbui"

  export let users = []

  $: uniqueUsers = unique(users)

  const unique = users => {
    let uniqueUsers = {}
    users?.forEach(user => {
      uniqueUsers[user.email] = user
    })
    return Object.values(uniqueUsers)
  }
</script>

<div class="avatars">
  {#each uniqueUsers as user, idx}
    <span style="z-index:{100 - idx};">
      <UserAvatar {user} tooltipPosition={TooltipPosition.Bottom} />
    </span>
  {/each}
</div>

<style>
  .avatars {
    display: flex;
  }
  .avatars :global(> *:not(:first-child)) {
    margin-left: -12px;
  }
  .avatars :global(.spectrum-Avatar) {
    border: 2px solid var(--background);
  }
</style>
