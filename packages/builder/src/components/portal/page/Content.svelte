<script>
  export let narrow = false
  export let showMobileNav = false
</script>

<div class="content">
  <div class="side-nav" class:show-mobile={showMobileNav}>
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

  @media (max-width: 640px) {
    .content {
      flex-direction: column;
    }
    .side-nav:not(.show-mobile) {
      display: none;
    }
  }
</style>
