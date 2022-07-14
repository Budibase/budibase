<script>
  import { Select } from "@budibase/bbui"

  const options = [
    { label: "App User", value: "appUser" },
    { label: "Developer", value: "developer" },
    { label: "Admin", value: "admin" },
  ]
</script>

<div on:click|stopPropagation>
  <Select value={"appUser"} {options} placeholder="Admin" autoWidth quiet />
</div>

<style>
  div {
    overflow: visible;
    text-overflow: ellipsis;
    white-space: nowrap;
    z-index: 1000;
    position: relative;
  }
</style>
