<script>
  import { getContext } from "svelte"
  import UserAvatar from "../../UserAvatar.svelte"

  const { users } = getContext("grid")

  $: uniqueUsers = unique($users)

  const unique = users => {
    let uniqueUsers = {}
    users?.forEach(user => {
      uniqueUsers[user.email] = user
    })
    return Object.values(uniqueUsers)
  }
</script>

<div class="users">
  {#each uniqueUsers as user}
    <UserAvatar {user} />
  {/each}
</div>

<style>
  .users {
    display: flex;
    flex-direction: row;
    gap: 4px;
  }
</style>
