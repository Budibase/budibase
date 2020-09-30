<script>
  import { Input, Select } from "@budibase/bbui"
  export let validationErrors

  let blurred = { username: false, password: false }
</script>

<h2>Create new user</h2>
<div class="container">
  <Input
    on:input={() => (blurred.username = true)}
    label="Username"
    name="username"
    placeholder="Username"
    type="name"
    error={blurred.username && validationErrors.username} />
  <Input
    on:input={() => (blurred.password = true)}
    label="Password"
    name="password"
    placeholder="Password"
    type="pasword"
    error={blurred.password && validationErrors.password} />
  <Select secondary name="accessLevelId">
    <option value="">Choose an option</option>
    <option value="ADMIN">Admin</option>
    <option value="POWER_USER">Power User</option>
  </Select>
</div>

<style>
  .container {
    display: grid;
    grid-gap: 40px;
  }
</style>
