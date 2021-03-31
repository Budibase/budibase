<script>
  export let name = undefined
  export let text = ""
  export let checked = false
  export let disabled = false
  export let screenreader = true
  export let thin = false
</script>

<label for={name} class="container">
  <div class="toggle">
    <input
      id={name}
      {name}
      type="checkbox"
      class:screenreader
      {disabled}
      bind:checked
      on:change />
    <div class="track">
      <div class="thumb" />
    </div>
  </div>
  {#if text}<span class="text" class:thin>{text}</span>{/if}
</label>

<style>
  .container {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .container:disabled {
    background-color: var(--grey-2);
    cursor: not-allowed;
  }

  .toggle {
    position: relative;
    display: inline-block;
    align-self: center;
    cursor: pointer;
    -webkit-user-select: none;
    background: transparent;
  }

  .track {
    width: 32px;
    height: 18px;
    background-color: var(--grey-4);
    border-radius: 9px;
    transition-delay: 0.12s;
    transition-duration: 0.2s;
    transition-property: background;
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
    position: relative;
  }

  .thumb {
    cursor: pointer;
    position: absolute;
    transition-duration: 0.28s;
    transition-property: all;
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    background-color: white;
    border-radius: var(--border-radius-xl);
  }

  input[type="checkbox"]:checked ~ .track .thumb {
    transform: translateX(14px);
  }
  input[type="checkbox"]:checked ~ .track {
    background-color: var(--blue);
  }
  input[type="checkbox"]:disabled ~ .track {
    background-color: var(--grey-4);
    cursor: not-allowed;
  }
  input[type="checkbox"]:disabled ~ .track .thumb {
    background-color: var(--grey-2);
    cursor: not-allowed;
  }

  .screenreader {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .text {
    font-size: var(--font-size-s);
    font-family: var(--font-sans);
    cursor: pointer;
    user-select: none;
    color: var(--ink);
  }
  .text.thin {
    font-size: var(--font-size-xs);
  }
</style>
