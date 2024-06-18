<script>
  export let rowIdx

  $: idx = rowIdx + 1
  $: width = 50 + ((idx * idx * 123) % 17) * 5
</script>

<div class="placeholder-cell">
  <div class="placeholder-outer" style="width:{width}px">
    <div class="placeholder-inner" />
  </div>
</div>

<style>
  .placeholder-cell {
    display: flex;
    gap: 8px;
    height: var(--default-row-height);
    align-items: center;
    padding: var(--cell-padding);
    overflow: hidden;
  }
  .placeholder-outer {
    position: relative;
    background-color: var(--spectrum-global-color-gray-300);
    overflow: hidden;
    border-radius: 4px;
    height: 20px;
    max-width: 100%;
  }
  .placeholder-inner {
    position: absolute;
    left: -50%;
    height: 100%;
    width: 50%;
    animation: shimmer 1.5s infinite;
    position: relative;
    overflow: hidden;
    background: linear-gradient(
      to right,
      var(--spectrum-global-color-gray-300) 0%,
      var(--spectrum-global-color-gray-400) 40%,
      var(--spectrum-global-color-gray-400) 60%,
      var(--spectrum-global-color-gray-300) 100%
    );
  }

  @keyframes shimmer {
    0% {
      left: -50%;
    }
    100% {
      left: 100%;
    }
  }
</style>
