<script>
  import { Button, Label, Input, TextArea, Spacer } from "@budibase/bbui"
  import { notifier } from "builderStore/store/notifications"
  import { auth } from "stores/backend"

  let username = ""
  let password = ""

  async function login() {
    try {
      const json = await auth.login({
        username,
        password,
      })
      if (json.success) {
        notifier.success("Logged in successfully.")
      } else {
        notifier.danger("Invalid credentials")
      }
    } catch (err) {
      console.error(err)
      notifier.danger(`Error logging in: ${err}`)
    }
  }

  async function createTestUser() {
    try {
      const json = await auth.createUser({
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
    }
  }
</script>

<form on:submit|preventDefault>
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
