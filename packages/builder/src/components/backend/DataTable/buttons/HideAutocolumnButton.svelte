<script>
  import { ActionButton } from "@budibase/bbui"
  import { _ as t } from "svelte-i18n"

  export let hideAutocolumns

  function hideOrUnhide() {
    hideAutocolumns = !hideAutocolumns
  }
</script>

<ActionButton icon="MagicWand" primary size="S" quiet on:click={hideOrUnhide}>
  {#if hideAutocolumns}{$t("show-auto-columns")}{:else}{$t(
      "hide-auto-columns"
    )}{/if}
</ActionButton>
