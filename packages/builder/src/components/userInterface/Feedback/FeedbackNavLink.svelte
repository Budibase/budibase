<script>
  import { Popover } from "@budibase/bbui"
  import { store } from "builderStore"

  import FeedbackIframe from "./FeedbackIframe.svelte"
  import analytics from "analytics"

  const FIVE_MINUTES = 300000

  let iconContainer
  let popover

  setInterval(() => {
    $store.highlightFeedbackIcon = analytics.highlightFeedbackIcon()
  }, FIVE_MINUTES)
</script>

<div class="container" bind:this={iconContainer} on:click={popover.show}>
  <i class="ri-feedback-line" class:highlight={$store.highlightFeedbackIcon} />
</div>
<div class="iframe">
  <Popover bind:this={popover} anchor={iconContainer} align="right">
    <FeedbackIframe on:finished={popover.hide} />
  </Popover>
</div>

<style>
  i {
    font-size: 18px;
    color: var(--grey-7);
  }
  i.highlight {
    color: var(--blue);
    filter: drop-shadow(0 0 20px var(--blue));
  }

  .container {
    cursor: pointer;
    color: var(--grey-7);
    margin: 0 12px 0 0;
    font-weight: 500;
    font-size: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 24px;
    width: 24px;
  }
  .container:hover i {
    color: var(--ink);
  }

  .iframe :global(.menu-container) {
    background-color: white;
  }
</style>
