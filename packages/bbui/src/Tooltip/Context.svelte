<script>
  import Portal from "svelte-portal"
  import { fade } from 'svelte/transition';

  export let currentTooltip
  export let previousTooltip
  export let anchor
  export let visible = false
  export let hovering = false

  let previousX = 0
  let previousY = 0
  let currentX = 0
  let currentY = 0

  let currentTooltipWidth = 0
  let currentTooltipHeight = 0

  let previousTooltipWidth = 0
  let previousTooltipHeight = 0

  const updatePositionOnVisibilityChange = (visible, hovering) => {
    if (!visible && !hovering) {
      previousX = 0;
      previousY = 0;

      previousTooltipWidth = 0
      previousTooltipHeight = 0
    } }

  const updatePosition = (anchor, currentTooltip, previousTooltip) => {
    requestAnimationFrame(() => {
      if (anchor == null || currentTooltip == null || previousTooltip == null) {
        return;
      }

      const rect = anchor.getBoundingClientRect();

      currentTooltipWidth = currentTooltip.clientWidth
      currentTooltipHeight = currentTooltip.clientHeight

      previousTooltipWidth = previousTooltip.clientWidth
      previousTooltipHeight = previousTooltip.clientHeight

      if (previousTooltipWidth === 0) {
        previousTooltipWidth = currentTooltipWidth;
      }

      if (previousTooltipHeight === 0) {
        previousTooltipHeight = currentTooltipHeight;
      }

      previousX = currentX
      previousY = currentY

      // - width to align to left side of anchor
      currentX = rect.x - currentTooltipWidth
      currentY = rect.y

      if (previousX === 0) {
        previousX = currentX
      }

      if (previousY === 0) {
        previousY = currentY
      }
    })
  }

  /*
  const getNormalizedTime = (startTime, endTime, currentTime) => {
    const distanceFromStart = currentTime - startTime;
    const timeDiff = endTime - startTime;

    return distanceFromStart / timeDiff;
  }

  const cubicBezierInterpolation = (p1, p2, p3, p4, currentTime) => {
    return (
      (Math.pow(1 - currentTime, 3) * p1) +
      (3 * Math.pow(1 - currentTime, 2) * currentTime * p2) +
      (3 * (1 - currentTime) * Math.pow(currentTime, 2) * p3) +
      (Math.pow(currentTime, 3) * p4)
    )
  }

  // Made to match the interface of the css bezier curve function
  const cubicBezierEasing = (a, b, c, d, t) => {
    // CSS bezier curve function implicitly provides p1 and p4
    const p1 = { x: 0, y: 0 }
    const p2 = { x: a, y: b }
    const p3 = { x: c, y: d }
    const p4 = { x: 1, y: 1 }

    return {
      x: cubicBezierInterpolation(p1.x, p2.x, p3.x, p4.x, t),
      y: cubicBezierInterpolation(p1.y, p2.y, p3.y, p4.y, t)
    }
  }

  const linearInterpolation = (p1, p2, t) => {
    return p1 + t * (p2 - p1);
  }

  const animate = (invokedAnimationStartTime, frameTime) => {
    if (invokedAnimationStartTime !== animationStartTime) {
      console.log("CANCEL ANIMATION ", invokedAnimationStartTime, " ", animationStartTime);
      return;
    }

    const animationDuration = 300
    const normalizedTime = getNormalizedTime(invokedAnimationStartTime, invokedAnimationStartTime + animationDuration, frameTime)

    if (normalizedTime >= 1) {
      console.log("exiting");
      return;
    }

    const easing = cubicBezierEasing(0.25, 0.1, 0.25, 1, normalizedTime)

    x = linearInterpolation(startX, endX, easing.x)
    y = linearInterpolation(startY, endY, easing.y)
    w = linearInterpolation(previousTooltipWidth, currentTooltipWidth, easing.x)

    requestAnimationFrame((newFrameTime) => animate(invokedAnimationStartTime, newFrameTime))
  }*/

  $: updatePosition(anchor, currentTooltip, previousTooltip)
  $: updatePositionOnVisibilityChange(visible, hovering)
  /*$: requestAnimationFrame((frameTime) => animate(animationStartTime, frameTime))*/

  const handleMouseenter = (e) => {
    hovering = true;
  }

  const handleMouseleave = (e) => {
    hovering = false;
  }
</script>

<Portal target=".spectrum">
  <div
    on:mouseenter={handleMouseenter}
    on:mouseleave={handleMouseleave}
    style:width={`${currentTooltipWidth}px`}
    style:height={`${currentTooltipHeight}px`}
    style:left={`${currentX}px`}
    style:top={`${currentY}px`}
    class="tooltip"
    class:visible={visible || hovering}
  >
  <div class="screenSize"
    style:left={`${-currentX}px`}
    style:top={`${-currentY}px`}
    >
      <div
        style:left={`${currentX}px`}
        style:top={`${currentY}px`}
        bind:this={currentTooltip}
        class="currentContent"
      >
        <slot />
      </div>
      <div
        bind:this={previousTooltip}
        class="previousContent"
        style:left={`${previousX}px`}
        style:top={`${previousY}px`}
      >
        <slot name="previous"/>
      </div>
    </div>
  </div>
</Portal>

<style>
  /* Screen width absolute parent for tooltip content so that'd the applied width and height 
     to the root doesn't affect their size */
  .screenSize {
    position: absolute;
    width: 100vw;
    height: 100vh;
    transition: top 300ms ease-in, left 300ms ease-in;
  }

  .tooltip {
    position: absolute;
    z-index: 9999;
    pointer-events: none;
    background-color: red;
    opacity: 0;
    overflow: hidden;
    transition: width 300ms ease-in, height 300ms ease-in, top 300ms ease-in, left 300ms ease-in;
  }

  .visible {
    opacity: 1;
    pointer-events: auto;
  }

  .currentContent {
    position: absolute;
    z-index: 10000;
  }

  .previousContent {
    position: absolute;
    z-index: 10000;
  }
</style>
