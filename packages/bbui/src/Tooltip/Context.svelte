<script>
  import Portal from "svelte-portal"
  import { getContext } from "svelte"
  import Context from "../context"

  export let anchor
  export let visible = false
  export let offset = 0;
  export let noAnimation = false

  $: target = getContext(Context.PopoverRoot) || "#app"

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


      const windowOffset = (window.innerHeight - offset) - (currentTooltip.clientHeight + rect.y)

      currentTooltipWidth = currentTooltip.clientWidth
      currentTooltipHeight = currentTooltip.clientHeight

      previousX = currentX
      previousY = currentY

      // - width to align to left side of anchor
      currentX = rect.x - currentTooltipWidth - offset
      currentY = windowOffset < 0 ? rect.y + windowOffset : rect.y
      const fadeIn = [{ opacity: "0" }, { opacity: "1" }];
      const fadeOut = [{ opacity: "1" }, { opacity: "0" }];

      const fadeInTiming = {
        duration: 200,
        delay: 100,
        iterations: 1,
        easing: "ease-in",
        fill: "both"
      };
      const fadeOutTiming = {
        duration: 200,
        iterations: 1,
        easing: "ease-in",
        fill: "forwards"
      };

      if (!noAnimation) {
      currentTooltip.animate(fadeIn, fadeInTiming);
      previousTooltip.animate(fadeOut, fadeOutTiming);
      }

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
    class:noAnimation
  >
  <!-- absolutely position element with the opposite positioning, so that the tooltip elements can be positioned
    using the same values as the root wrapper, while still being occluded by it.
  -->
    <div class="screenSizeAbsoluteWrapper"
      style:left={`${-currentX}px`}
      style:top={`${-currentY}px`}
    class:noAnimation
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
    background-color: var(--background-alt);
    box-shadow: 2px 2px 5px 0px rgba(0,0,0,0.42);

    border-radius: 5px;
    box-sizing: border-box;
    opacity: 0;
    overflow: hidden;
    border: 1px solid var(--grey-4);

    transition: width 300ms ease-in, height 300ms ease-in, top 300ms ease-in, left 300ms ease-in;
  }

  .screenSizeAbsoluteWrapper {
    width: 200vw;
    height: 100vh;
    position: absolute;
    transition: top 300ms ease-in, left 300ms ease-in;
  }

  .noAnimation {
    transition: none;
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
