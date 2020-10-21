<script>
  import { FeedbackIcon } from "components/common/Icons/"
  import { Popover } from "@budibase/bbui"
  import analytics from "analytics"

  const feedbackUrl = "https://feedback.budibase.com"

  let iconContainer
  let popover
  let iframe

  // the app @ feedback.budibase.com expects to be loaded
  // in an iframe, and posts messages back.
  // this means that we can submit using the Builder's posthog setup
  window.addEventListener(
    "message",
    function(ev) {
      if (ev.origin !== feedbackUrl) return

      if (ev.data.type === "loaded") {
        iframe.setAttribute(
          "style",
          `height:${ev.data.height}px; width:${ev.data.width}px`
        )
      } else if (ev.data.type === "submitted") {
        analytics.captureEvent("Feedback Submitted", ev.data.data)
      }
    },
    false
  )
</script>

<span class="container" bind:this={iconContainer} on:click={popover.show}>
  <FeedbackIcon />
</span>
<Popover bind:this={popover} anchor={iconContainer} align="right">
  <iframe src={feedbackUrl} title="feedback" bind:this={iframe}>
    <html lang="html">
      <style>
        body {
          display: flex;
          height: 100%;
          width: 100%;
          justify-content: center;
          align-items: center;
        }
      </style>
      <body>
        <div>Loading...</div>
      </body>
    </html>
  </iframe>
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

  iframe {
    border-style: none;
    height: auto;
    overflow-y: hidden;
    overflow-x: hidden;
    min-width: 500px;
  }
</style>
