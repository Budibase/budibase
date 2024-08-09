<script>
  export let sideNav = false
  export let hideDevTools = false
  export let hideFooter = false
  export let noAnimation = false
</script>

<div class:sideNav id="clientAppSkeletonLoader" class="skeleton">
  <div class="animation" class:noAnimation />

  {#if !hideDevTools}
    <div class="devTools" />
  {/if}
  <div class="main">
    <div class="nav" />
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
  {#if !hideFooter}
    <div class="footer" />
  {/if}
</div>

<style>
  .skeleton {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
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
    animation-duration: 1.3s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: shimmer;
    animation-timing-function: linear;
  }

  .noAnimation {
    animation-name: none;
    background: transparent;
  }

  .devTools {
    display: flex;
    box-sizing: border-box;
    background-color: black;
    height: 60px;
    padding: 1px 24px 1px 20px;
    display: flex;
    align-items: center;
    z-index: 1;
    flex-shrink: 0;

    color: white;
    mix-blend-mode: multiply;
    background: rgb(0 0 0);
    font-size: 30px;
    font-family: Source Sans Pro;
    -webkit-font-smoothing: antialiased;
  }

  .main {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 720px) {
    #clientAppSkeletonLoader .main {
      flex-direction: column;
      width: initial;
    }
  }

  @container (max-width: 720px) {
    #clientAppSkeletonLoader .main {
      flex-direction: column;
      width: initial;
    }
  }

  .sideNav .main {
    flex-direction: row;
    width: 100%;
  }

  .nav {
    flex-shrink: 0;
    width: 100%;
    height: 141px;
    background-color: transparent;
  }

  @media (max-width: 720px) {
    #clientAppSkeletonLoader .nav {
      height: 61px;
      width: initial;
    }
  }

  @container (max-width: 720px) {
    #clientAppSkeletonLoader .nav {
      height: 61px;
      width: initial;
    }
  }

  .sideNav .nav {
    height: 100%;
    width: 251px;
  }

  .body {
    z-index: 2;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
  }

  @media (max-width: 720px) {
    #clientAppSkeletonLoader .body {
      width: initial;
      height: 100%;
    }
  }

  @container (max-width: 720px) {
    #clientAppSkeletonLoader .body {
      width: initial;
      height: 100%;
    }
  }

  .sideNav .body {
    width: 100%;
    height: initial;
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

  .footer {
    flex-shrink: 0;
    box-sizing: border-box;
    z-index: 1;
    height: 52px;
    width: 100%;
  }

  @media (max-width: 720px) {
    #clientAppSkeletonLoader .footer {
      border-top: none;
    }
  }

  @container (max-width: 720px) {
    #clientAppSkeletonLoader .footer {
      border-top: none;
    }
  }

  .sideNav .footer {
    border-top: 3px solid var(--spectrum-alias-background-color-primary);
  }

  @keyframes shimmer {
    0% {
      left: -170%;
    }

    100% {
      left: 170%;
    }
  }
</style>
