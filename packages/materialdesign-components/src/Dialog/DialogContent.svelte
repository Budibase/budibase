<script>
  let dialogContent
  export let _bb

  $: dialogContent && _bb.attachChildren(dialogContent)
</script>

<div
  class="mdc-dialog__content"
  bind:this={dialogContent}
  id="my-dialog-content" />
