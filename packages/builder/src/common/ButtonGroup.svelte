<script>
  export let style = ""
</script>

<div class="root" {style}>
  <slot />
</div>

<style>
  .root {
    display: flex;
  }

  .root:last-child {
    border-radius: 0 var(--borderradius) var(--borderradius) 0;
  }

  .root:first-child {
    border-radius: var(--borderradius) 0 0 var(--borderradius);
  }

  .root:not(:first-child):not(:last-child) {
    border-radius: 0;
  }
</style>
