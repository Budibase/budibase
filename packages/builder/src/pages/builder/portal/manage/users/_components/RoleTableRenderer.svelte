<script>
  import { Select } from "@budibase/bbui"

  const options = [
    { label: "App User", value: "appUser" },
    { label: "Developer", value: "developer" },
    { label: "Admin", value: "admin" },
  ]
</script>

<div class="align">
  <Select
    on:click={e => e.stopPropagation()}
    value={"Admin"}
    quiet
    {options}
    placeholder="Admin"
  />
</div>

<style>
  .align {
    display: flex;
    z-index: 1000;
  }
</style>
