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
    margin-left: 10px;
  }

  div {
    padding: 0 10px 0 10px;
    width: 90%;
    height: 40px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    transition: 0.3s background-color;
    color: var(--ink);
    font-weight: 500;
    font-size: 16px;
    margin-top: 4px;
    margin-bottom: 4px;
  }

  .selected {
    background-color: var(--blue-light);
  }

  div:hover {
    background-color: var(--blue-light);
    cursor: pointer;
  }

  i {
    color: var(--dark-grey);
    font-size: 20px;
    margin-right: 8px;
  }
</style>
