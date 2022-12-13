<script>
  export let narrow = false
</script>

<div class="content">
  <div class="side-nav">
    <slot name="side-nav" />
  </div>
  <div class="main" class:narrow>
    <slot />
  </div>
</div>

<style>
  .content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    gap: 40px;
  }
  .side-nav {
    flex: 0 0 200px;
  }
  .main {
    flex: 1 1 auto;
  }
  .main.narrow {
    max-width: 600px;
  }
</style>
