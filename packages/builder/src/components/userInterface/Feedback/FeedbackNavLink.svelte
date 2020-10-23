<script>
  import { FeedbackIcon } from "components/common/Icons/"
  import { Popover } from "@budibase/bbui"
  import { store } from "builderStore"

  import FeedbackIframe from "./FeedbackIframe.svelte"
  import analytics from "analytics"

  let iconContainer
  let popover

  setInterval(() => {
    $store.highlightFeedbackIcon = analytics.highlightFeedbackIcon()
  }, 300000 /*check every 5 minutes*/)
</script>

<span
  class="container"
  bind:this={iconContainer}
  on:click={popover.show}
  class:highlight={$store.highlightFeedbackIcon}>
  <FeedbackIcon />
</span>
<Popover bind:this={popover} anchor={iconContainer} align="right">
  <FeedbackIframe on:finished={popover.hide} />
</Popover>

<style>
  .container {
    cursor: pointer;
    color: var(--grey-7);
    margin: 0 20px 0 0;
    font-weight: 500;
    font-size: 1rem;
    height: 100%;
    display: flex;
    flex: 1;
    align-items: center;
    box-sizing: border-box;
  }

  .container:hover {
    color: var(--ink);
    font-weight: 500;
  }

  .highlight {
    color: var(--blue);
  }

  .highlight > :global(svg) {
    filter: drop-shadow(0 0 20px var(--blue));
  }
</style>
