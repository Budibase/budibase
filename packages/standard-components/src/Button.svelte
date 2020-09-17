<script>
  export let className = "default"
  export let disabled = false
  export let text

  export let _bb
  let theButton

  $: if (_bb.props._children && _bb.props._children.length > 0)
    theButton && _bb.attachChildren(theButton)

  const clickHandler = () => {
    _bb.call("onClick")
  }
</script>

<button
  bind:this={theButton}
  class="default"
  disabled={disabled || false}
  on:click={clickHandler}>
  {#if !_bb.props._children || _bb.props._children.length === 0}{text}{/if}
</button>

<style>
  .default {
    align-items: center;
    font-size: 16px;
    padding: 0px 16px;
    box-sizing: border-box;
    border-radius: 4px;
    outline: none;
    height: 40px;
    cursor: pointer;
    transition: all 0.2s ease 0s;
    overflow: hidden;
    outline: none;
    user-select: none;
    white-space: nowrap;
    text-align: center;
  }

  .border {
    border: var(--border);
  }

  .color {
    color: var(--color);
  }

  .background {
    background: var(--background);
  }

  .hoverBorder:hover {
    border: var(--hoverBorder);
  }

  .hoverColor:hover {
    color: var(--hoverColor);
  }

  .hoverBack:hover {
    background: var(--hoverBackground);
  }
</style>
