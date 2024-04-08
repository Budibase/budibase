<div class="line">
  <span class="bullet">•</span>
  <slot />
</div>

<style>
  .bullet {
    color: var(--grey-6);
    font-size: 17px;
    display: inline block;
    margin-right: 10px;
  }

  .line {
    background-color: var(--background-alt);
    color: var(--ink);
    align-items: center;
    display: flex;

    margin-bottom: 10px;
  }
</style>
