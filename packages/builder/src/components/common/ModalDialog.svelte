<script>
  import { getContext } from "svelte"
  export let message
  export let hasForm = false
  export let onCancel = () => {}
  export let onOkay = () => {}

  const { close } = getContext("simple-modal")

  let value
  let onChange = () => {}

  function _onCancel() {
    onCancel()
    close()
  }

  function _onOkay() {
    onOkay(value)
    close()
  }

  $: onChange(value)
</script>

<h2>{message}</h2>

{#if hasForm}
  <input type="text" bind:value on:keydown={e => e.which === 13 && _onOkay()} />
{/if}

<div class="buttons">
  <button on:click={_onCancel}>Cancel</button>
  <button on:click={_onOkay}>Okay</button>
</div>

<style>
  h2 {
    font-size: 2rem;
    text-align: center;
  }

  input {
    width: 100%;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
  }
</style>
