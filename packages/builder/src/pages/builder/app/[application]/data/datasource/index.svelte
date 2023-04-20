<script>
  import { _ } from "../../../../../../../lang/i18n"
  import { datasources } from "stores/backend"
  import { redirect } from "@roxi/routify"
  import { onMount } from "svelte"

  onMount(async () => {
    const { list, selected } = $datasources
    if (selected) {
      $redirect(`./${selected?._id}`)
    } else {
      $redirect(`./${list[0]._id}`)
    }
  })
</script>

{#if !$datasources.list?.length}
  <i>{$_("pages.builder.app.application.data.datasource.index.Connect_your")}</i
  >
{:else}<i>{$_("pages.builder.app.application.data.datasource.index.Select")}</i
  >{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-5);
    margin-top: 2px;
  }
</style>
