<script>
  import { Input, Select } from "@budibase/bbui"
  export let validationErrors

  let blurred = { email: false, password: false }
</script>

<h2>Create your first User</h2>
<div class="container">
  <Input
    on:input={() => (blurred.email = true)}
    label="Email"
    name="email"
    placeholder="Email"
    type="email"
    error={blurred.email && validationErrors.email} />
  <Input
    on:input={() => (blurred.password = true)}
    label="Password"
    name="password"
    placeholder="Password"
    type="password"
    error={blurred.password && validationErrors.password} />
  <Select label="Access Level" secondary name="accessLevelId">
    <option value="ADMIN">Admin</option>
    <option value="POWER_USER">Power User</option>
  </Select>
</div>

<style>
  .container {
    display: grid;
    grid-gap: var(--spacing-xl);
  }
</style>
