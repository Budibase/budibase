<script>
  import { Icon, Popover } from "@budibase/bbui"
  import { store } from "builderStore"
  import { onMount } from "svelte"

  import FeedbackIframe from "./FeedbackIframe.svelte"
  import analytics from "analytics"

  const FIVE_MINUTES = 300000

  let iconContainer
  let popover

  onMount(() => {
    const interval = setInterval(() => {
      store.update(state => {
        state.highlightFeedbackIcon = analytics.highlightFeedbackIcon()
        return state
      })
    }, FIVE_MINUTES)
    return () => clearInterval(interval)
  })
</script>

<div class="container" bind:this={iconContainer} on:click={popover.show}>
  <Icon hoverable name="Feedback" />
</div>
<div class="iframe">
  <Popover bind:this={popover} anchor={iconContainer} align="right">
    <FeedbackIframe on:finished={popover.hide} />
  </Popover>
</div>

<style>
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

  .iframe :global(.menu-container) {
    background-color: white;
  }
</style>
