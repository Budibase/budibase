<script>
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { createValidationStore, emailValidator } from "helpers/validation"
  import { users } from "stores/portal"

  const [email, error, touched] = createValidationStore("", emailValidator)
  const password = Math.random().toString(36).substr(2, 20)

  async function createUser() {
    const res = await users.create({ email: $email, password })
    if (res.status) {
      notifications.error(res.message)
    } else {
      notifications.success("Succesfully created user")
    }
  }
</script>

<ModalContent
  onConfirm={createUser}
  size="M"
  title="Basic user onboarding"
  confirmText="Continue"
  cancelText="Cancel"
  disabled={$error}
  error={$touched && $error}
  showCloseIcon={false}
>
  <Body noPadding
    >Below you will find the user’s username and password. The password will not
    be accessible from this point. Please download the credentials.</Body
  >
  <Input
    type="email"
    label="Username"
    bind:value={$email}
    error={$touched && $error}
  />
  <Input disabled label="Password" value={password} />
</ModalContent>
