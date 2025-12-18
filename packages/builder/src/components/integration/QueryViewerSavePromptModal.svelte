<script>
  import { goto, beforeUrlChange } from "@roxi/routify"
  import { Body, Modal, ModalContent } from "@budibase/bbui"

  export let checkIsModified = () => {}
  export let attemptSave = () => {}
  let modal
  let navigateTo
  let override = false

  $beforeUrlChange(event => {
    if (checkIsModified() && !override) {
      navigateTo = event.type == "pushstate" ? event.url : null
      modal.show()
      return false
    } else return true
  })

  const resumeNavigation = () => {
    if (typeof navigateTo == "string") {
      $goto(typeof navigateTo == "string" ? `${navigateTo}` : navigateTo)
    }
  }
</script>

<Modal
  bind:this={modal}
  on:hide={() => {
    navigateTo = null
  }}
>
  <ModalContent
    title="You have unsaved changes"
    confirmText="Save and Continue"
    cancelText="Discard Changes"
    size="L"
    onConfirm={async () => {
      try {
        await attemptSave()
        override = true
        resumeNavigation()
      } catch (e) {
        navigateTo = false
      }
    }}
    onCancel={async () => {
      override = true
      resumeNavigation()
    }}
  >
    <Body>Leaving this section will mean losing any changes to your query</Body>
  </ModalContent>
</Modal>
