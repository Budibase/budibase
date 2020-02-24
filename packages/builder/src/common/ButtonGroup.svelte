<script>
  export let style = ""
</script>

<div class="root" {style}>
  <slot />
</div>

<style>
  .root {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 5px;
    width: 50%;
  }
</style>
