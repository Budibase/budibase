<script>
</script>

<section>
  <div class="header">
    <div class="controls">
      <slot name="controls" />
    </div>
    <div class="tooltip">
      <slot name="tooltip" />
    </div>
  </div>
  <div>
    <slot />
  </div>
</section>

<style>
  .header {
    display: flex;
    margin-bottom: 15px;
  }

  .tooltip {
    margin-left: auto;
  }
</style>
