<script>
  export let style = ""
</script>

<div class="root" {style}>
  <slot />
</div>

<style>
  .root {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
