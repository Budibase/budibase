<script lang="ts">
  export let onConfirm: () => unknown = () => {}
  export let title = ""
  export let confirmText = "Confirm"
  export let disabled = false
  export let disableCancelOnConfirm = false

  let loading = false

  const confirm = async () => {
    loading = true
    await onConfirm()
    loading = false
  }
</script>

<div data-disable-cancel={disableCancelOnConfirm}>
  <h1>{title}</h1>
  <slot />
  <button on:click={confirm} disabled={disabled || loading}>
    {loading ? "Importing" : confirmText}
  </button>
</div>
