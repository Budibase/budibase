<script>
  import { FeedbackIcon } from "components/common/Icons/"
  import { Popover } from "@budibase/bbui"
  import FeedbackIframe from "./FeedbackIframe.svelte"

  let iconContainer
  let popover
</script>

<span class="container" bind:this={iconContainer} on:click={popover.show}>
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
</style>
