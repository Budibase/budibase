<script>
  export let noWrap = false
</script>
<div class="line">
  <span class="bullet">•</span>
  <div class="content" class:noWrap>
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
    min-width: 0;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
  }

  .noWrap {
    display: flex;
    flex-wrap: nowrap;
  }
</style>
