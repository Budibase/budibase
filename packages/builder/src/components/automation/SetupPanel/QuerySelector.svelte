<script>
  import { queries } from "stores/backend"
  import { Select } from "@budibase/bbui"
  import { _ as t } from "svelte-i18n"

  export let value
</script>

<div class="block-field">
  <Select bind:value secondary extraThin>
    <option value="">{$t("choose-an-option")}</option>
    {#each $queries.list as query}
      <option value={query._id}>{query.name}</option>
    {/each}
  </Select>
</div>
