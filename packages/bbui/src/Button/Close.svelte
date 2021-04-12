<script>
  export let onClose
  export let dark = false
  export let small = false
</script>

<button class:small class:dark on:click={onClose}>×</button>

<style>
  button {
    display: block;
    box-sizing: border-box;
    position: absolute;
    font-size: var(--font-size-l);
    z-index: 1000;
    top: var(--spacing-l);
    right: var(--spacing-l);
    margin: 0;
    padding: 0;
    width: 1.5rem;
    height: 1.5rem;
    border: 0;
    color: black;
    border-radius: var(--border-radius-xl);
    background: white;
    transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1),
      background 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
    -webkit-appearance: none;
    outline: none;
  }

  button:hover {
    background-color: var(--grey-2);
    cursor: pointer;
  }

  button:active {
    background-color: var(--grey-4);
    cursor: pointer;
  }
  .small {
    font-size: var(--font-size-m);
    line-height: 110%;
    width: 1.3rem;
    height: 1.3rem;
  }
  .dark {
    color: white;
    background: black;
  }
  .dark:hover {
    background-color: var(--grey-8);
    cursor: pointer;
  }
  .dark:active {
    background-color: var(--grey-9);
    cursor: pointer;
  }
</style>
