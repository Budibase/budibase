<script>
  import { UserAvatar } from "@budibase/frontend-core"

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
  {#each uniqueUsers as user}
    <UserAvatar {user} tooltipDirection="bottom" />
  {/each}
</div>

<style>
  .avatars {
    display: flex;
    gap: 4px;
  }
</style>
