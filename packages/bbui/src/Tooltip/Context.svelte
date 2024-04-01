<script>
  import Portal from "svelte-portal"
  import { fade } from 'svelte/transition';

  export let tooltip
  export let anchor
  export let visible = false
  export let hovering = false

  let startX = 0
  let startY = 0
  let endX = 0
  let endY = 0

  let x = 0;
  let y = 0;
  let animationStartTime = 0;

  const updatePositionOnVisibilityChange = (visible, hovering) => {
    if (!visible && !hovering) {
      x = 0;
      y = 0;
    }
  }

  const updatePosition = (anchor, tooltip) => {
    if (anchor == null) {
      return;
    }

    const rect = anchor.getBoundingClientRect();
    const tooltipWidth = tooltip?.getBoundingClientRect()?.width ?? 0;

    startX = x
    startY = y

    endX = rect.x - tooltipWidth
    endY = rect.y

    animationStartTime = document.timeline.currentTime

    if (x === 0 && y === 0) {
      startX = endX
      startY = endY
    }
  }

  const getNormalizedTime = (startTime, endTime, currentTime) => {
    const distanceFromStart = currentTime - startTime;
    const timeDiff = endTime - startTime;

    return distanceFromStart / timeDiff;
  }

  const cubicBezierInterpolation = (p1, p2, p3, p4, t) => {
    return Math.pow(1 - t, 3) * p1 +
    3 * Math.pow(1 - t, 2) * t * p2 +
    3 * (1 - t) * Math.pow(t, 2) * p3 +
    Math.pow(t, 3) * p4;
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

    const animationDuration = 200
    const normalizedTime = getNormalizedTime(invokedAnimationStartTime, invokedAnimationStartTime + animationDuration, frameTime)

    if (normalizedTime >= 1) {
      console.log("exiting");
      return;
    }

    const easing = cubicBezierEasing(0.25, 0.1, 0.25, 1, normalizedTime)

    x = linearInterpolation(startX, endX, easing.x)
    y = linearInterpolation(startY, endY, easing.y)

    requestAnimationFrame((newFrameTime) => animate(invokedAnimationStartTime, newFrameTime))
  }

  $: updatePosition(anchor, tooltip)
  $: updatePositionOnVisibilityChange(visible, hovering)
  $: requestAnimationFrame((frameTime) => animate(animationStartTime, frameTime))

  const handleMouseenter = (e) => {
    hovering = true;
  }

  const handleMouseleave = (e) => {
    hovering = false;
  }
</script>

<Portal target=".spectrum">
  <div
    bind:this={tooltip} 
    on:mouseenter={handleMouseenter}
    on:mouseleave={handleMouseleave}
    style:top={`${y}px`}
    style:left={`${x}px`}
    class="tooltip"
    class:visible={visible || hovering}
  >
    <slot />
  </div>
  <slot name="previous" />
</Portal>

<style>
  .tooltip {
    position: absolute;
    z-index: 9999;
    opacity: 0;
    pointer-events: none;
  }

  .visible {
    opacity: 1;
    pointer-events: auto;
  }
</style>
