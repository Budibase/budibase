<script>
  import { datasources } from "stores/backend"
  import { goto } from "@roxi/routify"
  import { onMount } from "svelte"
  import { _ as t } from "svelte-i18n"

  onMount(async () => {
    // navigate to first table in list, if not already selected
    $datasources.list.length > 0 && $goto(`./${$datasources.list[0]._id}`)
  })
</script>

{#if $datasources.list.length === 0}
  <i>{$t("connect-your-first-datasource-to-start-building")}</i>
{:else}<i>{$t("select-a-datasource-to-edit")}</i>{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-5);
    margin-top: 2px;
  }
</style>
