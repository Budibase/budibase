<script>
  import { Input, Select, Heading } from "@budibase/bbui"

  export let values
  export let errors
  export let touched
</script>

<div class="container">
  <Heading l h2>Create your first User</Heading>
  <Input
    bind:value={$values.email}
    on:change={() => ($touched.email = true)}
    label="Email"
    placeholder="Email"
    type="email"
    error={$touched.email && $errors.email} />
  <Input
    bind:value={$values.password}
    on:change={() => ($touched.password = true)}
    label="Password"
    placeholder="Password"
    type="password"
    error={$touched.password && $errors.password} />
  <Select
    bind:value={$values.roleId}
    label="Role"
    options={[{ label: 'Admin', value: 'ADMIN' }, { label: 'Power User', value: 'POWER_USER' }]}
    getOptionLabel={option => option.label}
    getOptionValue={option => option.value}
    error={$errors.roleId} />
</div>

<style>
  .container {
    display: grid;
    grid-gap: var(--spacing-xl);
  }
</style>
