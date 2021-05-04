<script>
  import {
    notifications,
    Button,
    Link,
    Input,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import { auth } from "stores/backend"

  let username = ""
  let password = ""

  async function login() {
    try {
      await auth.login({
        username,
        password,
      })
      notifications.success("Logged in successfully.")
    } catch (err) {
      console.error(err)
      notifications.error("Invalid credentials")
    }
  }

  async function createTestUser() {
    try {
      await auth.firstUser()
      notifications.success("Test user created")
    } catch (err) {
      console.error(err)
      notifications.error("Could not create test user")
    }
  }
</script>

<Modal fixed>
  <ModalContent
    size="L"
    title="Log In"
    onConfirm={login}
    confirmText="Log In"
    showCancelButton={false}
    showCloseIcon={false}
  >
    <Input label="Email" bind:value={username} />
    <Input label="Password" type="password" on:change bind:value={password} />
    <div class="footer" slot="footer">
      <Link target="_blank" href="/api/admin/auth/google">
        Sign In With Google
      </Link>
      <Button secondary on:click={createTestUser}>Create Test User</Button>
    </div>
  </ModalContent>
</Modal>

<style>
  .footer {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
  .footer :global(a) {
    margin-right: var(--spectrum-global-dimension-static-size-200);
  }
</style>
