<script>
  import Portal from "svelte-portal"
  import { getContext } from "svelte"
  import Context from "../context"

  export let anchor
  export let visible = false
  export let offset = 0;

  $: target = getContext(Context.PopoverRoot) || ".spectrum"

  let hovering = false
  let wrapper
  let resetWrapper
  let currentTooltip
  let previousTooltip

  let initialShow = true;
  let previousX = 0
  let previousY = 0
  let currentX = 0
  let currentY = 0

  let currentTooltipWidth = 0
  let currentTooltipHeight = 0

  const handleVisibilityChange = (visible, hovering) => {
    if (!visible && !hovering) {
      initialShow = true;
    }
  }

  const updatePosition = (anchor, currentTooltip, previousTooltip, wrapper, resetWrapper) => {
    requestAnimationFrame(() => {
      if (anchor == null || currentTooltip == null || previousTooltip == null || wrapper == null || resetWrapper == null) {
        return;
      }

      const rect = anchor.getBoundingClientRect();

      currentTooltipWidth = currentTooltip.clientWidth
      currentTooltipHeight = currentTooltip.clientHeight

      previousX = currentX
      previousY = currentY

      // - width to align to left side of anchor
      currentX = rect.x - currentTooltipWidth - offset
      currentY = rect.y
      const fadeIn = [{ opacity: "0" }, { opacity: "1" }];
      const fadeOut = [{ opacity: "1" }, { opacity: "0" }];

      const fadeInTiming = {
        duration: 150,
        delay: 150,
        iterations: 1,
        easing: "ease-in",
        fill: "both"
      };
      const fadeOutTiming = {
        duration: 150,
        iterations: 1,
        easing: "ease-in",
        fill: "forwards"
      };

      currentTooltip.animate(fadeIn, fadeInTiming);
      previousTooltip.animate(fadeOut, fadeOutTiming);

      // Bypass animations if the tooltip has only just been opened
      if (initialShow) {
        initialShow = false;

        previousTooltip.style.visibility = "hidden"

        wrapper.style.transition = "none";
        wrapper.style.width = `${currentTooltipWidth}px`
        wrapper.style.height = `${currentTooltipHeight}px`
        wrapper.style.top = `${currentY}px`
        wrapper.style.left = `${currentX}px`

        resetWrapper.style.transition = "none";
        resetWrapper.style.top = `${-currentY}px`
        resetWrapper.style.left = `${-currentX}px`

        requestAnimationFrame(() => {
          wrapper.style.removeProperty("transition");
          resetWrapper.style.removeProperty("transition");
        })
      } else {
        previousTooltip.style.removeProperty("visibility");
      }
    })
  }

  $: updatePosition(anchor, currentTooltip, previousTooltip, wrapper, resetWrapper)
  $: handleVisibilityChange(visible, hovering)

  const handleMouseenter = (e) => {
    hovering = true;
  }

  const handleMouseleave = (e) => {
    hovering = false;
  }
</script>

<Portal {target}>
  <div
    bind:this={wrapper}
    on:mouseenter={handleMouseenter}
    on:mouseleave={handleMouseleave}
    style:width={`${currentTooltipWidth}px`}
    style:height={`${currentTooltipHeight}px`}
    style:left={`${currentX}px`}
    style:top={`${currentY}px`}
    class="tooltip"
    class:visible={visible || hovering}
  >
  <!-- absolutely position element with the opposite positioning, so that the tooltip elements can be positioned
    using the same values as the root wrapper, while still being occluded by it.
  -->
  <div class="screenSizeAbsoluteWrapper"
    bind:this={resetWrapper}
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
        class="previousContent"
        style:left={`${previousX}px`}
        style:top={`${previousY}px`}
        bind:this={previousTooltip}
      >
        <slot name="previous"/>
      </div>
    </div>
  </div>
</Portal>

<style>
  .tooltip {
    position: absolute;
    z-index: 9999;
    pointer-events: none;
    background-color: var(--spectrum-global-color-gray-200);
    border-radius: 5px;
    box-sizing: border-box;

    opacity: 0;
    overflow: hidden;
    transition: width 300ms ease-in, height 300ms ease-in, top 300ms ease-in, left 300ms ease-in;
  }

  .screenSizeAbsoluteWrapper {
    position: absolute;
    width: 100vw;
    height: 100vh;
    transition: top 300ms ease-in, left 300ms ease-in;
  }

  .visible {
    opacity: 1;
    pointer-events: auto;
  }

  .currentContent {
    position: absolute;
    z-index: 10001;
  }

  .previousContent {
    position: absolute;
    z-index: 10000;
  }
</style>
