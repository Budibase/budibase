<script>
  import { Select } from "@budibase/bbui"

  const options = [
    { label: "App User", value: true },
    { label: "Developer", value: false },
    { label: "Admin", value: false },
  ]
</script>

<div class="align">
  <Select {options} />
</div>

<style>
  .align {
    display: flex;
  }
</style>
