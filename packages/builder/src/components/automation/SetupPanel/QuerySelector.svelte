<script>
  import { queries } from "stores/backend"
  import { Select } from "@budibase/bbui"
  import { _ } from "../../../../lang/i18n"

  export let value
</script>

<div class="block-field">
  <Select on:change bind:value secondary extraThin>
    <option value=""
      >{$_("components.automation.SetupPanel.QuerySelector")}</option
    >
    {#each $queries.list as query}
      <option value={query._id}>{query.name}</option>
    {/each}
  </Select>
</div>
