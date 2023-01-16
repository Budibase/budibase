<div class="split-page">
  <div class="left">
    <div class="content">
      <slot />
    </div>
  </div>
  <div class="right">
    <slot name="right" />
  </div>
</div>

<style>
  .split-page {
    height: 100%;
    display: grid;
    grid-template-columns: max(50%, 380px) 1fr;
    justify-content: stretch;
    overflow: hidden;
  }
  .left {
    background: var(--background);
    display: grid;
    place-items: center;
    padding: 40px;
    overflow-y: auto;
  }
  .right {
    background: linear-gradient(
      to bottom right,
      var(--spectrum-global-color-gray-300) 0%,
      var(--background) 100%
    );
  }
  .content {
    width: 100%;
    max-width: 400px;
  }

  @media (max-width: 740px) {
    .split-page {
      grid-template-columns: 1fr;
    }
    .left {
      padding: 20px;
    }
    .right {
      display: none;
    }
    .content {
      width: auto;
    }
  }
</style>
