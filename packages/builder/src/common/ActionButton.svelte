<script>
  export let disabled = false
  export let hidden = false
  export let primary = true
  export let alert = false
  export let warning = false
</script>

<button
  on:click
  class="button"
  class:hidden
  class:primary
  class:alert
  class:warning
  {disabled}>
  <slot />
</button>

<style>
  .primary {
    color: #0055ff;
    background: rgb(54, 133, 249, 0.1);
  }

  .alert {
    color: rgba(255, 0, 31, 1);
    background: rgba(255, 0, 31, 0.1);
  }

  .button {
    font-size: 18px;
    font-weight: bold;
    border-radius: 5px;
    border: none;
    width: 167px;
    height: 64px;
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
