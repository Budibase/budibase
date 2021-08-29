<script>
  import { goto } from "@roxi/routify"
  import { onMount } from "svelte"
  import { tables } from "stores/backend"
  import { _ as t } from "svelte-i18n"

  onMount(async () => {
    $tables.list.length > 0 && $goto(`./${$tables.list[0]._id}`)
  })
</script>

{#if $tables.list.length === 0}
  <i>{$t("create-your-first-table-to-start-building")}</i>
{:else}<i>{$t("select-a-table-to-edit")}</i>{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-5);
    margin-top: 2px;
  }
</style>
