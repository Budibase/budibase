<script>
  import {
    Body,
    Button,
    ButtonGroup,
    Layout,
    Heading,
    Page,
  } from "@budibase/bbui"
  import { flags } from "stores/backend"
  import { goto } from "@roxi/routify"

  function openFeedbackApp() {
    window.open(
      "https://bb.budibase.app/app/design-feedback-hub#/beta-questions"
    )
  }

  async function revertToOldBuilder() {
    await flags.toggleUiFeature("design_ui")
    $goto("../")
    window.location.reload()
  }
</script>

<Page maxWidth="90ch" wide={false}>
  <Layout noPadding>
    <Layout noPadding gap="S">
      <Heading size="S">Beta Builder</Heading>
      <Body>
        Your account has been given access to the budibase beta program. We
        would love to hear what you think and get your feedback and suggestions
        on the new Design UI.
      </Body>
    </Layout>
    <ButtonGroup>
      <Button cta on:click={openFeedbackApp}>Give Feedback</Button>
      <Button secondary on:click={revertToOldBuilder}
        >Revert back to old builder</Button
      >
    </ButtonGroup>
  </Layout>
</Page>
