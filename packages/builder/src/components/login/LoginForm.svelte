<script>
  import { Button, Label, Input, TextArea, Spacer } from "@budibase/bbui"
  import { auth } from "stores/backend"

  let username = ""
  let password = ""

  async function login() {
    const json = await auth.login({
      username,
      password,
    })
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
</form>

<style>
  form {
    width: 60%;
  }
</style>
