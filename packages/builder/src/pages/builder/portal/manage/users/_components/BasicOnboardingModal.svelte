<script>
  import { ModalContent, Body, Input, ActionButton } from "@budibase/bbui"
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
  <Input disabled label="Username" value="joebudibase" />
  <Input disabled label="Password" value="kjhfweiufqohy87t23" />
  <div class="download">
    <ActionButton icon="Download">Download user credentials</ActionButton>
  </div>
</ModalContent>
