<script>
  import { getContext } from "svelte"
  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let height = "500px"
  export let width = "100%"

  let styles

  $: {
    styles = JSON.parse(JSON.stringify($component.styles))

    if (!styles.normal.height) {
      // The height and width props provided to this component can either be numbers or strings set by users (ex. '100%', '100px', '100'). A string of '100' wouldn't be a valid CSS property, but some of our components respect that input, so we need to handle it here also, hence the `!isNaN` check.
      styles.normal.height = !isNaN(height) ? `${height}px` : height
    }

    if (!styles.normal.width) {
      styles.normal.width = !isNaN(width) ? `${width}px` : width
    }
  }
</script>

<div use:styleable={styles} class="skeleton" />

<style>
  .skeleton {
    background-color: var(--spectrum-global-color-gray-300) !important;
    border-radius: 7px;
    overflow: hidden;
    position: relative;
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
      rgba(255, 255, 255, 0.2) 20%,
      rgba(255, 255, 255, 0.5) 60%,
      rgba(255, 255, 255, 0)
    );
    animation: shimmer 2s infinite;
    content: "";
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
</style>
