<script>
  import "@spectrum-css/avatar/dist/index-vars.css"
  export let url = ""
  export let disabled = false
  export let initials = "KA"
</script>

{#if url}
  <img
    class:is-disabled={disabled}
    class="spectrum-Avatar"
    src={url}
    alt="Avatar"
  />
{:else}
  <div>{initials}</div>
{/if}

<style>
  div {
    color: white;
    display: grid;
    place-items: center;
    font-weight: bold;
    background: rgb(63, 94, 251);
    background: linear-gradient(
      155deg,
      rgba(63, 94, 251, 1) 0%,
      rgba(53, 199, 86, 1) 47%
    );
    border-radius: 50%;
    width: 32px;
    height: 32px;
  }
</style>
