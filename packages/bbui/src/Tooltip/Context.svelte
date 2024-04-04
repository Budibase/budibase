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

  const updatePosition = (anchor, currentTooltip, previousTooltip, wrapper) => {
    requestAnimationFrame(() => {
      if (anchor == null || currentTooltip == null || previousTooltip == null || wrapper == null) {
        return;
      }

      const rect = anchor.getBoundingClientRect();
      const previousStyles = window.getComputedStyle(previousTooltip?.firstChild)
      const currentStyles = window.getComputedStyle(currentTooltip?.firstChild)

      console.log(previousStyles.backgroundColor);
      console.log(currentStyles.backgroundColor);
      console.log("")

      currentTooltipWidth = currentTooltip.clientWidth
      currentTooltipHeight = currentTooltip.clientHeight

      previousX = currentX
      previousY = currentY

      // - width to align to left side of anchor
      currentX = rect.x - currentTooltipWidth - offset
      currentY = rect.y
      const fadeIn = [{ opacity: "0" }, { opacity: "1" }];
      const fadeOut = [{ opacity: "1" }, { opacity: "0" }];
      const color = [{ backgroundColor: previousStyles.backgroundColor }, { backgroundColor: currentStyles.backgroundColor }];

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

      const colorTiming = {
        duration: 300,
        iterations: 1,
        easing: "ease-in"
      };

      currentTooltip.animate(fadeIn, fadeInTiming);
      previousTooltip.animate(fadeOut, fadeOutTiming);
      wrapper.animate(color, colorTiming);

      // Bypass animations if the tooltip has only just been opened
      if (initialShow) {
        initialShow = false;

        previousTooltip.style.visibility = "hidden"

        wrapper.style.transition = "none";
        //wrapper.style.width = `${currentTooltipWidth}px`
        //wrapper.style.height = `${currentTooltipHeight}px`
        wrapper.style.top = `${currentY}px`
        wrapper.style.left = `${currentX}px`


        requestAnimationFrame(() => {
          wrapper.style.removeProperty("transition");
        })
      } else {
        previousTooltip.style.removeProperty("visibility");
      }
    })
  }

  $: updatePosition(anchor, currentTooltip, previousTooltip, wrapper)
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
    style:left={`${currentX}px`}
    style:top={`${currentY}px`}
    style:width={`${currentTooltipWidth}px`}
    style:height={`${currentTooltipHeight}px`}
    class="tooltip"
    class:visible={visible || hovering}
  >
  <!-- absolutely position element with the opposite positioning, so that the tooltip elements can be positioned
    using the same values as the root wrapper, while still being occluded by it.
  -->
    <div class="screenSizeAbsoluteWrapper"
      style:left={`${-currentX}px`}
      style:top={`${-currentY}px`}
      >
      <div
        bind:this={currentTooltip}
        class="currentContent"
        style:left={`${currentX}px`}
        style:top={`${currentY}px`}
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
    width: 200vw;
    height: 200vh;
    position: absolute;
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
