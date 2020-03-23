<script>
  import { onMount } from "svelte"
  import { fade } from "svelte/transition"
  import { MDCDialog } from "@material/dialog"
  import ClassBuilder from "../ClassBuilder.js"

  let dialog
  let dialogSurface
  let instance

  export let _bb
  // TODO: may not be the best way to instantiate the dialog. Check how this will work Budibase side
  export let open = true

  onMount(() => {
    instance = new MDCDialog(dialog)
    return () => {
      instance && instance.destroy()
    }
  })

  $: dialogSurface && _bb.attachChildren(dialogSurface)

  $: {
    if (open) {
      instance && instance.open()
    } else {
      instance && instance.close()
    }
  }
</script>

<div bind:this={dialog} class="mdc-dialog">
  <div class="mdc-dialog__container">
    <div
      bind:this={dialogSurface}
      class="mdc-dialog__surface"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="my-dialog-title"
      aria-describedby="my-dialog-content" />
  </div>
  <div class="mdc-dialog__scrim" on:click={() => (open = false)} />
</div>
