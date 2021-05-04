<script>
  import { Select, Heading } from "@budibase/bbui"

  export let values
  export let errors
  export let touched
</script>

<div class="container">
  <Heading size="L">What's your role for this app?</Heading>
  <Select
    bind:value={$values.roleId}
    label="Role"
    options={[
      { label: "Admin", value: "ADMIN" },
      { label: "Power User", value: "POWER_USER" },
    ]}
    getOptionLabel={option => option.label}
    getOptionValue={option => option.value}
    error={$errors.roleId}
  />
</div>

<style>
  .container {
    display: grid;
    grid-gap: var(--spacing-xl);
  }
</style>
