<script>
  export let disabled = false
  export let hidden = false
  export let secondary = false
  export let primary = true
  export let cancel = false
  export let alert = false
  export let warning = false
</script>

<button
  on:click
  class="button"
  class:hidden
  class:secondary
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
    background: var(--blue);
    border: solid 1px var(--blue);
  }

  .alert {
    color: white;
    background: #E26D69;
    border: solid 1px #E26D69;
  }

  .cancel {
    color: var(--secondary40);
    background: none;
  }

  .secondary {
    color: var(--ink);
    border: solid 1px var(--grey-dark);
    background: white;
  }

  .button {
    font-size: 14px;
    font-weight: 500;
    border-radius: 3px;
    padding: 10px 20px;
    height: 40px;
  }

  .button:hover {
    cursor: pointer;
    filter: saturate(90%);
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
