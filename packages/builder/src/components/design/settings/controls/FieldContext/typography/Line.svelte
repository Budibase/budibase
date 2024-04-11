<script>
  export let wrap = false
</script>
<div class="line">
  <span class="bullet">•</span>
  <div class="content" class:wrap>
    <slot />
  </div>
</div>

<style>
  .line {
    background-color: var(--background-alt);
    color: var(--ink);
    align-items: flex-start;
    display: flex;

    margin-bottom: 10px;
  }

  .bullet {
    color: var(--grey-6);
    font-size: 17px;
    display: inline block;
    margin-right: 10px;
    line-height: 26px;
  }

  .content {
    display: flex;
    min-width: 0;
    align-items: center;
  }

  .wrap {
    display: block;
  }
</style>
