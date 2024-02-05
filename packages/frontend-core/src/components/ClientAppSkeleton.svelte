<div id="clientAppSkeletonLoader" class="skeleton">
  <div class="animation" />
  <div class="devTools">
  </div>
  <div class="header" />
  <div class="body">
    <div class="bodyVerticalPadding" />
    <div class="bodyHorizontal">
      <div class="bodyHorizontalPadding" />
      <svg
        class="svg"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="240"
        height="256"
      >
        <mask id="mask">
          <rect x="0" y="0" width="240" height="256" fill="white" />
          <rect x="0" y="0" width="240" height="32" rx="6" fill="black" />
          <rect x="0" y="56" width="240" height="32" rx="6" fill="black" />
          <rect x="0" y="112" width="240" height="32" rx="6" fill="black" />
          <rect x="0" y="168" width="240" height="32" rx="6" fill="black" />
          <rect x="71" y="224" width="98" height="32" rx="6" fill="black" />
        </mask>

        <rect
          x="0"
          y="0"
          width="240"
          height="256"
          fill="black"
          mask="url(#mask)"
        />
      </svg>
      <div class="bodyHorizontalPadding" />
    </div>
    <div class="bodyVerticalPadding" />
  </div>
</div>

<style>
  .skeleton {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: var(--spectrum-global-color-gray-200);
  }

  .animation {
    position: absolute;
    height: 100%;
    width: 100%;
    background: linear-gradient(
      to right,
      transparent 0%,
      var(--spectrum-global-color-gray-300) 20%,
      transparent 40%,
      transparent 100%
    );
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: shimmer;
    animation-timing-function: linear;
  }

  .devTools {
    background-color: black;
    height: 60px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    z-index: 1;
    flex-shrink: 0;
  }

  .devTools :global(h1) {
    font-weight: 600;
  }

  .header {
    flex-shrink: 0;
    width: 100%;
    height: 150px;
    background-color: transparent;
  }

  .body {
    z-index: 2;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
  }

  .body :global(svg > rect) {
    fill: var(--spectrum-alias-background-color-primary);
  }

  .body :global(svg) {
    flex-shrink: 0;
  }

  .bodyHorizontal {
    display: flex;
    flex-shrink: 0;
  }

  .bodyHorizontalPadding {
    height: 100%;
    flex-grow: 1;
    background-color: var(--spectrum-alias-background-color-primary);
  }

  .bodyVerticalPadding {
    width: 100%;
    flex-grow: 1;
    background-color: var(--spectrum-alias-background-color-primary);
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }

    100% {
      left: 100%;
    }
  }
</style>
