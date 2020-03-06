<script>
  export let style = ""
</script>

<div class="root" {style}>
  <slot />
</div>

<style>
  .root {
    display: flex;
    justify-content: flex-end;
    margin-top: 40px; 
  }
</style>
