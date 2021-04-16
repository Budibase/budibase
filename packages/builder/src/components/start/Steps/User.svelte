<script>
  import { Input, Select } from "@budibase/bbui"
</script>

<h2>What's your role for this app?</h2>
<div class="container">
  <Select label="Role" secondary name="roleId">
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
