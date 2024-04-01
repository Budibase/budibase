<script>
  import Portal from "svelte-portal"

  export let tooltip
  export let anchor
  export let visible = false
  export let hovering = false

  let targetX = 0
  let targetY = 0

  let animationId = 0;

  let x = 0;
  let y = 0;

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

    targetX = rect.x - tooltipWidth
    targetY = rect.y
    animationId += 1

    if (x === 0 && y === 0) {
      x = targetX
      y = targetY
    }
  }

  const animate = (invokedAnimationId, xRate = null, yRate = null) => {
    if (invokedAnimationId !== animationId) {
      console.log("CANCEL ANIMATION ", invokedAnimationId, " ", animationId);
      return;
    }
    console.log("animating");

    const animationDurationInFrames = 10;

    const xDelta = targetX - x
    const yDelta = targetY - y

    if (xRate === null) {
      xRate = Math.abs(xDelta) / animationDurationInFrames
    }

    if (yRate === null) {
      yRate = Math.abs(yDelta) / animationDurationInFrames
    }


    if (xDelta === 0 && yDelta === 0) return;

    if (
      (xDelta > 0 && xDelta <= xRate) ||
      (xDelta < 0 && xDelta >= -xRate)
    ) {
      x = targetX;
    } else if (xDelta > 0) {
      x = x + xRate;
    } else if (xDelta < 0) {
      x = x - xRate;
    }

    if (
      (yDelta > 0 && yDelta <= yRate) ||
      (yDelta < 0 && yDelta >= -yRate)
    ) {
      y = targetY;
    } else if (yDelta > 0) {
      y = y + yRate;
    } else if (yDelta < 0) {
      y = y - yRate;
    }

    requestAnimationFrame(() => animate(invokedAnimationId, xRate, yRate))
  }

  $: updatePosition(anchor, tooltip)
  $: updatePositionOnVisibilityChange(visible, hovering)
  $: requestAnimationFrame(() => animate(animationId))

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
