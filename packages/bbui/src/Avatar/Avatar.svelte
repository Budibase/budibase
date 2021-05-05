<script>
  import "@spectrum-css/avatar/dist/index-vars.css"
  let sizes = new Map([
    ["XXS", "--spectrum-alias-avatar-size-50"],
    ["XS", "--spectrum-alias-avatar-size-75"],
    ["S", "--spectrum-alias-avatar-size-200"],
    ["M", "--spectrum-alias-avatar-size-300"],
    ["L", "--spectrum-alias-avatar-size-500"],
    ["XL", "--spectrum-alias-avatar-size-600"],
    ["XXL", "--spectrum-alias-avatar-size-700"],
  ])
  export let size = "M"
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
    style="width: var({sizes.get(size)}); height: var({sizes.get(size)});"
  />
{:else}
  <div
    style="width: var({sizes.get(size)}); height: var({sizes.get(
      size
    )}); font-size: calc(var({sizes.get(size)}) / 2)"
  >
    {initials}
  </div>
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
    overflow: hidden;
  }
</style>
