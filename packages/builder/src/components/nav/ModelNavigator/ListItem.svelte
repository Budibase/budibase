<script>
  export let icon
  export let className
  export let title
  export let selected
  export let indented
</script>

<div class:selected on:click class={className}>
  <i class:indented class={icon} />
  <span>{title}</span>
</div>

<style>
  .indented {
    margin-left: 20px;
  }

  div {
    padding: 0 10px 0 10px;
    width: 260px;
    height: 40px;
    border-radius: 3px;
    font-weight: bold;
    display: flex;
    align-items: center;
    transition: 0.3s background-color;
    color: var(--ink);
    font-size: 16px;
  }

  .selected {
    background-color: var(--secondary);
  }

  div:hover {
    background-color: var(--secondary);
    cursor: pointer;
  }

  i {
    color: var(--dark-grey);
    font-size: 20px;
    margin-right: 8px;
  }
</style>
