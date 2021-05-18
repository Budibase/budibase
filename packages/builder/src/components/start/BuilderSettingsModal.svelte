<script>
  import {
    Heading,
    Divider,
    notifications,
    ModalContent,
    Toggle,
    Body,
  } from "@budibase/bbui"
  import ThemeEditor from "components/settings/ThemeEditor.svelte"
  import analytics from "analytics"

  $: analyticsDisabled = analytics.disabled()

  async function save() {
    notifications.success(`Settings saved.`)
  }

  function toggleAnalytics() {
    if (analyticsDisabled) {
      analytics.optIn()
    } else {
      analytics.optOut()
    }
  }
</script>

<ModalContent title="Builder settings" confirmText="Save" onConfirm={save}>
  <Heading size="XS">Theme</Heading>
  <ThemeEditor />
  <Divider noMargin noGrid />
  <Heading size="XS">Analytics</Heading>
  <Body size="S">
    If you would like to send analytics that help us make budibase better,
    please let us know below.
  </Body>
  <Toggle
    text="Send Analytics To Budibase"
    value={!analyticsDisabled}
    on:change={toggleAnalytics}
  />
</ModalContent>
