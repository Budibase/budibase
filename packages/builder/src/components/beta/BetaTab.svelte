<script>
  import { Body, Button, Layout, Heading } from "@budibase/bbui"
  import { CookieUtils } from "@budibase/frontend-core"

  function openFeedbackApp() {
    window.open(`https://bb.budibase.app/betauifeedback`)
  }

  function revertToOldBuilder() {
    CookieUtils.removeCookie("beta:new_design_ui")
    window.location.reload()
  }
</script>

<Layout>
  <Heading size="M">Beta Builder</Heading>
  <Body>
    Your account has been given access to the budibase beta program. We would
    love to hear what you think and get your feedback and suggestions on the new
    Design UI.
  </Body>
  <Button cta on:click={openFeedbackApp}>Give Feedback</Button>
  <Button secondary on:click={revertToOldBuilder}
    >Revert back to old builder</Button
  >
</Layout>
