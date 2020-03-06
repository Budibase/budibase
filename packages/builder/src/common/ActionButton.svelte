<script>
  export let disabled = false
  export let hidden = false
  export let primary = true
  export let cancel = false
  export let alert = false
  export let warning = false
</script>

<button
  on:click
  class="button"
  class:hidden
  class:primary
  class:alert
  class:cancel
  class:warning
  {disabled}>
  <slot />
</button>

<style>
  .primary {
    background: #0055ff;
    color: #fff;
  }

  .alert {
    color: rgba(255, 0, 31, 1);
    background: rgba(255, 0, 31, 0.1);
  }

  .cancel {
    background: transparent;
    color: rgba(22, 48, 87, 0.6);
    padding: 0px !important;
  }

  .button {
    font-size: 14px;
    font-weight: bold;
    border-radius: 5px;
    border: none;
    min-width: 120px;
    height: 45px;
  }

  .button:hover {
    cursor: pointer;
  }

  .button:disabled {
    color: rgba(22, 48, 87, 0.2);
    cursor: default;
    background: transparent;
  }

  .hidden {
    visibility: hidden;
  }
</style>
