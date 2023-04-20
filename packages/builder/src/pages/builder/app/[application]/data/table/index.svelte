<script>
  import { _ } from "../../../../../../../lang/i18n"
  import { onMount } from "svelte"
  import { tables } from "stores/backend"
  import { redirect } from "@roxi/routify"

  onMount(async () => {
    const { list, selected } = $tables
    if (selected) {
      $redirect(`./${selected?._id}`)
    } else if (list?.length) {
      $redirect(`./${list[0]._id}`)
    }
  })
</script>

{#if !$tables.list?.length}
  <i>{$_("pages.builder.app.application.data.table.index.Create_your_first")}</i
  >
{:else}<i>{$_("pages.builder.app.application.data.table.index.Select")}</i>{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-5);
    margin-top: 2px;
  }
</style>
