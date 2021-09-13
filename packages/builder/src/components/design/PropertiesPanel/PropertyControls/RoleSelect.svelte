<script>
  import { Select } from "@budibase/bbui"
  import { roles } from "stores/backend"
  import { _ as t } from "svelte-i18n"
  export let value
</script>

<Select
  bind:value
  on:change
  placeholder={$t("choose-an-option")}
  options={$roles}
  getOptionLabel={role => role.name}
  getOptionValue={role => role._id}
/>
