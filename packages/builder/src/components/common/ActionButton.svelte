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
    color: #ffffff;
    background: #0055ff;
  }

  .alert {
    color: rgba(255, 0, 31, 1);
    background: rgba(255, 0, 31, 0.1);
  }

  .cancel {
    color: var(--secondary40);
    background: none;
  }

  .button {
    font-size: 14px;
    font-weight: 600;
    border-radius: 5px;
    border: none;
    padding: 10px 20px;
    height: 45px;
  }

  .button:hover {
    cursor: pointer;
    font-weight: 600;
    filter:saturate(90%);
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
