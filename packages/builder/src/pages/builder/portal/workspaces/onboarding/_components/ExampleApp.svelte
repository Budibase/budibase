<script lang="ts">
  import { onMount } from "svelte"

  let container: HTMLDivElement
  let panel: HTMLImageElement
  let panelWidth: number = 0
  let containerWidth: number = 0
  let isPanelCutOff: boolean = false

  // side panel screenshot is overlaid over grid screenshot
  // it should be anchored to the right until the screen is too narrow
  function checkPanelVisibility(): void {
    if (container && panel) {
      containerWidth = container.clientWidth
      panelWidth = panel.clientWidth

      isPanelCutOff = panelWidth > containerWidth
    }
  }

  onMount(() => {
    checkPanelVisibility()
    window.addEventListener("resize", checkPanelVisibility)

    return () => {
      window.removeEventListener("resize", checkPanelVisibility)
    }
  })
</script>

<div tabindex="-1" class="exampleApp">
  <div class="mockupContainer" bind:this={container}>
    <img
      class="baseScreen"
      alt="Base app screen"
      src={"/builder/onboarding/grid.png"}
    />
    <img
      class="overlayPanel"
      class:leftAnchored={isPanelCutOff}
      bind:this={panel}
      alt="Side panel overlay"
      src={"/builder/onboarding/sidebar.png"}
    />
  </div>
</div>

<style>
  .exampleApp {
    box-sizing: border-box;
    height: 100vh;
    padding: 100px 0 100px 5vw;
    pointer-events: none;
  }

  @media (max-width: 980px) {
    .exampleApp {
      padding-left: 2vw;
    }
  }

  .mockupContainer {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .baseScreen {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: left;
  }

  .overlayPanel {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: auto;
    object-fit: cover;
    box-shadow: -4px 0 25px rgba(0, 0, 0, 0.1);
  }

  .overlayPanel.leftAnchored {
    right: auto;
    left: 0;
  }
</style>
