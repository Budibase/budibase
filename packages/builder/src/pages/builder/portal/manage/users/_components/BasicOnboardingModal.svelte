<script>
  import { ModalContent, Body, Input, ActionButton } from "@budibase/bbui"

  export let email
</script>

<ModalContent
  size="M"
  title="Basic user onboarding"
  confirmText="Continue"
  cancelText="Cancel"
  showCloseIcon={false}
>
  <Body noPadding
    >Below you will find the user’s username and password. The password will not
    be accessible from this point. Please download the credentials.</Body
  >
  <Input type="email" disabled label="Username" value={email} />
  <Input disabled label="Password" value="asduiayewkjh3243i5oucy" />
  <div class="download">
    <ActionButton icon="Download">Download user credentials</ActionButton>
  </div>
</ModalContent>
