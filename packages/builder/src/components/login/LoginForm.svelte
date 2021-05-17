<script>
  import { goto } from "@roxi/routify"
  import {
    notifications,
    Input,
    Modal,
    ModalContent,
    Button,
    Divider,
  } from "@budibase/bbui"
  import GoogleButton from "./GoogleButton.svelte"
  import { auth } from "stores/backend"

  let username = ""
  let password = ""

  async function login() {
    try {
      await auth.login({
        username,
        password,
      })
      notifications.success("Logged in successfully")
      $goto("../portal")
    } catch (err) {
      console.error(err)
      notifications.error("Invalid credentials")
    }
  }

  async function forgot() {

  }
</script>

<Modal fixed>
  <ModalContent
    size="M"
    title="Log In"
    showCancelButton={false}
    showConfirmButton={false}
    showCloseIcon={false}
  >
    <Input label="Email" bind:value={username} />
    <Input label="Password" type="password" on:change bind:value={password} />
    <div class="login-buttons">
      <Button secondary on:click={forgot}>Forgot Password?</Button>
      <Button cta on:click={login}>Login</Button>
    </div>
    <div class="or-divide">
      <Divider noGrid />
      <div class="or-label">
        OR
      </div>
    </div>
    <div class="sso">
      <GoogleButton />
    </div>
  </ModalContent>
</Modal>

<style>
  .sso {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .login-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
  .login-buttons :global(>*:not(:last-child)) {
    margin-right: var(--spacing-xl);
  }
  .or-divide {
    position: relative;
  }
  .or-label {
    position: absolute;
    top: calc(50% - 2px);
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background-color: var(--background);
    padding: 0 var(--spacing-xl);
    font-weight: 500;
    font-size: var(--font-size-s);
    color: var(--spectrum-global-color-gray-600);
  }
</style>
