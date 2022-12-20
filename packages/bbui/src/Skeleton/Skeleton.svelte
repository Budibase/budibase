<div class="skeleton">
  <div class="children">
    <slot />
  </div>
</div>

<style>
  .skeleton {
    height: 100%;
    width: 100%;
    opacity: 0;
    background-color: var(--spectrum-global-color-gray-200) !important;
    border-radius: 7px;
    overflow: hidden;
    position: relative;
    animation: fadeIn 130ms ease 0s 1 normal forwards;
  }

  .children {
    pointer-events: none;
    opacity: 0;
  }

  .skeleton::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.15) 20%,
      rgba(255, 255, 255, 0.3) 60%,
      rgba(255, 255, 255, 0)
    );
    animation: shimmer 2s infinite;
    content: "";
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.75;
    }
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
</style>
