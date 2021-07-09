<script>
  import {
    ModalContent,
    Body,
    Input,
    notifications,
    Toggle,
    Label,
  } from "@budibase/bbui"
  import { createValidationStore, emailValidator } from "helpers/validation"
  import { users } from "stores/portal"

  const [email, error, touched] = createValidationStore("", emailValidator)
  const password = Math.random().toString(36).substr(2, 20)
  let builder = false,
    admin = false

  async function createUser() {
    const res = await users.create({ email: $email, password, builder, admin })
    if (res.status) {
      notifications.error(res.message)
    } else {
      notifications.success("Successfully created user")
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
  <Body size="S">
    Below you will find the user’s username and password. The password will not
    be accessible from this point. Please save the credentials.
  </Body>
  <Input
    type="email"
    label="Username"
    bind:value={$email}
    error={$touched && $error}
  />
  <Input disabled label="Password" value={password} />
  <div>
    <div class="toggle">
      <Label size="L">Development access</Label>
      <Toggle text="" bind:value={builder} />
    </div>
    <div class="toggle">
      <Label size="L">Administration access</Label>
      <Toggle text="" bind:value={admin} />
    </div>
  </div>
</ModalContent>

<style>
  .toggle {
    display: grid;
    grid-template-columns: 78% 1fr;
    align-items: center;
    width: 50%;
  }
</style>
