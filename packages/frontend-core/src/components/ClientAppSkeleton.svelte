<script>
  export let sideNav = false;
  export let hideDevTools = false;
  export let hideFooter = false;
</script>

<div class:sideNav id="clientAppSkeletonLoader" class="skeleton mobile">
  <div class="animation" />

  {#if !hideDevTools}
    <div class="devTools" >
      <p class="title">Preview</p>

      <div class="button viewButton">
        <p>View as yourself</p>
        <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18">
          <defs>
            <style>
              .fill {
                fill: white;
              }
            </style>
          </defs>
          <title>S ChevronDown 18 N</title>
          <rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18" /><path class="fill" d="M4,7.01a1,1,0,0,1,1.7055-.7055l3.289,3.286,3.289-3.286a1,1,0,0,1,1.437,1.3865l-.0245.0245L9.7,11.7075a1,1,0,0,1-1.4125,0L4.293,7.716A.9945.9945,0,0,1,4,7.01Z" />
        </svg>
      </div>

      <div class="button devToolsButton">
        <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18">
          <defs>
            <style>
              .fill {
                fill: white;
              }
            </style>
          </defs>
          <title>S Code 18 N</title>
          <rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18" /><path class="fill" d="M17.7465,9.5305l-4.0965,4.16a.5.5,0,0,1-.70709.00541l-.00541-.00541-.4465-.4535a.503.503,0,0,1,0-.7L15.9715,9,12.492,5.4645a.503.503,0,0,1,0-.7l.4465-.4535a.5.5,0,0,1,.70709-.00541L13.651,4.311l4.0955,4.16A.76151.76151,0,0,1,17.7465,9.5305Z" />
          <path class="fill" d="M.2535,8.4695,4.35,4.3095a.5.5,0,0,1,.70709-.00541l.00541.00541.4465.4535a.503.503,0,0,1,0,.7L2.0285,9,5.508,12.5355a.503.503,0,0,1,0,.7l-.4465.4535a.5.5,0,0,1-.70709.00541L4.349,13.689.2535,9.5305A.76151.76151,0,0,1,.2535,8.4695Z" />
          <path class="fill" d="M7.7445,14.8435h-.572a.5.5,0,0,1-.483-.6295L9.7855,2.6935a.5.5,0,0,1,.483-.3705h.5525a.5.5,0,0,1,.483.627L8.2275,14.473A.5.5,0,0,1,7.7445,14.8435Z" />
        </svg>
        <p>DevTools</p>
      </div>
    </div>
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
    animation-duration: 1.3s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: shimmer;
    animation-timing-function: linear;
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

  .title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 17px;
  }

  .button {
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  .viewButton {
    margin-left: auto;
  }

  .viewButton p {
    margin-right: 8px;
  }

  .devToolsButton {
    margin-left: 33px;
    margin-right: 5px;
  }

  .devToolsButton p {
    margin-left: 8px;
  }

  .devToolsButton svg {
    width: 16px;
  }

  @media (max-width: 720px) {
    .mobile .devToolsButton {
      display: none;
    }
  }

  .main {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .sideNav .main {
    flex-direction: row;
    width: 100%;
  }

  @media (max-width: 720px) {
    .mobile .main {
      flex-direction: column;
      width: initial;
    }
  }

  .nav {
    flex-shrink: 0;
    width: 100%;
    height: 141px;
    background-color: transparent;
  }

  .sideNav .nav {
    height: 100%;
    width: 251px;
  }

  @media (max-width: 720px) {
    .mobile .nav {
      height: 61px;
      width: initial;
    }
  }

  .body {
    z-index: 2;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
  }

  .sideNav .body {
    width: 100%;
    height: initial;
  }

  @media (max-width: 720px) {
    .mobile .body {
      width: initial;
      height: 100%;
    }
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

  .sideNav .footer {
    border-top:3px solid var(--spectrum-alias-background-color-primary);
  }

  @media (max-width: 720px) {
    .mobile .footer {
      border-top: none;
    }
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
