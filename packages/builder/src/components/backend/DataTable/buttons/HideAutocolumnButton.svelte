<script>
  import { ActionButton } from "@budibase/bbui"

  export let hideAutocolumns

  function hideOrUnhide() {
    hideAutocolumns = !hideAutocolumns
  }
</script>

<ActionButton icon="MagicWand" primary size="S" quiet on:click={hideOrUnhide}>
  {#if hideAutocolumns}Show auto columns{:else}Hide auto columns{/if}
</ActionButton>
