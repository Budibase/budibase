<script>
  import { Button, Label, Input, Spacer } from "@budibase/bbui"
  import { notifier } from "builderStore/store/notifications"
  import { auth } from "stores/backend"

  let username = ""
  let password = ""

  async function login() {
    try {
      await auth.login({
        username,
        password,
      })
      notifier.success("Logged in successfully.")
    } catch (err) {
      console.error(err)
      notifier.danger("Invalid credentials")
    }
  }

  async function createTestUser() {
    try {
      await auth.createUser({
        email: "test@test.com",
        password: "test",
        roles: {},
        builder: {
          global: true,
        },
      })
      notifier.success("Test user created")
    } catch (err) {
      console.error(err)
      notifier.danger("Could not create test user")
    }
  }
</script>

<form on:submit|preventDefault data-cy="login-form">
  <Spacer large />
  <Label small>Email</Label>
  <Input outline bind:value={username} />
  <Spacer large />
  <Label small>Password</Label>
  <Input outline type="password" on:change bind:value={password} />
  <Spacer large />
  <Button primary on:click={login}>Login</Button>
  <Button secondary on:click={createTestUser}>Create Test User</Button>
</form>

<style>
  form {
    width: 60%;
  }
</style>
