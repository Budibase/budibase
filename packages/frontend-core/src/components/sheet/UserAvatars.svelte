<script>
  import { getContext } from "svelte"
  import Avatar from "./Avatar.svelte"

  const { users } = getContext("sheet")
</script>

<div class="users">
  {#each $users as user}
    <Avatar {user} />
  {/each}
</div>

<style>
  .users {
    display: flex;
    flex-direction: row;
    padding: 0 10px;
    gap: 8px;
  }
</style>
