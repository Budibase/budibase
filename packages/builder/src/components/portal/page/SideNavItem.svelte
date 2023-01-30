<script>
  export let text
  export let url
  export let active = false
</script>

<a on:click href={url} class:active>
  {text || ""}
</a>

<style>
  a {
    padding: var(--spacing-s) var(--spacing-m);
    color: var(--spectrum-global-color-gray-900);
    border-radius: 4px;
    transition: background 130ms ease-out;
  }
  .active,
  a:hover {
    background-color: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }
</style>
