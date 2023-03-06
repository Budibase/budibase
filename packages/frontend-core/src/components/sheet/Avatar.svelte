<script>
  export let user
</script>

<div class="user" style="background:{user.color};" title={user.email}>
  {user.email[0]}
</div>

<style>
  div {
    width: 24px;
    height: 24px;
    display: grid;
    place-items: center;
    color: white;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }
  div:hover {
    cursor: pointer;
  }
</style>
