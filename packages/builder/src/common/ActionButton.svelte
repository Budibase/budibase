<script>
  export let visible = true;
  export let disabled = false;
</script>

<style>
  .action-button {
    color: #0055ff;
    background: rgb(54, 133, 249, 0.1);
    font-size: 18px;
    font-weight: bold;
    border-radius: 5px;
    border: none;
    width: 167px;
    height: 64px;
  }

  .action-button:hover {
    cursor: pointer;
  }

  .action-button:disabled {
    color: #163057;
    cursor: default;
    background: transparent;
  }

  .hidden {
    visibility: hidden;
  }
</style>

<button on:click class="action-button {!visible && 'hidden'}" {disabled}>
  <slot />
</button>
