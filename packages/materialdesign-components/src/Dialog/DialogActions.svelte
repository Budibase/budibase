<script>
  import { onMount } from "svelte"
  export let _bb
  let dialogActions

  onMount(() => {
    _bb.setContext("BBMD:button:context", "mdc-dialog__button")
  })

  $: dialogActions && _bb.attachChildren(dialogActions)
</script>

<footer bind:this={dialogActions} class="mdc-dialog__actions" />
