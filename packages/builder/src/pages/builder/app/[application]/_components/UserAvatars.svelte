<script>
  export let users = []
</script>

<div class="avatars">
  {#each users as user}
    <div class="avatar" style="background:{user.color};" title={user.email}>
      {user.email[0]}
    </div>
  {/each}
</div>

<style>
  .avatars {
    display: flex;
    gap: 4px;
  }
  .avatar {
    width: 24px;
    height: 24px;
    display: grid;
    place-items: center;
    color: white;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    line-height: 0;
  }
  .avatar:hover {
    cursor: pointer;
  }
</style>
