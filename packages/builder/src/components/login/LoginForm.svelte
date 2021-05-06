<script>
  import { goto } from "@roxi/routify"
  import {
    notifications,
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
      $goto("../portal")
    } catch (err) {
      console.error(err)
      notifications.error("Invalid credentials")
    }
  }
</script>

<Modal fixed>
  <ModalContent
    size="M"
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
