<script>
  import analytics from "analytics"
  import { createEventDispatcher } from "svelte"
  import { store } from "builderStore"

  const dispatch = createEventDispatcher()
  const feedbackUrl = "https://feedback.budibase.com"

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
        analytics.submitFeedback(ev.data.data)
        $store.highlightFeedbackIcon = false
        dispatch("finished")
      }
    },
    false
  )
</script>

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

<style>
  iframe {
    border-style: none;
    height: auto;
    overflow-y: hidden;
    overflow-x: hidden;
    min-width: 500px;
  }
</style>
