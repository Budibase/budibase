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
    height: 36px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    transition: 0.3s background-color;
    color: var(--ink);
    font-weight: 400;
    font-size: 14px;
    margin-top: 4px;
    margin-bottom: 4px;
  }

  .selected {
    background-color: var(--grey-2);
  }

  div:hover {
    background-color: var(--grey-1);
    cursor: pointer;
  }

  i {
    color: var(--grey-7);
    font-size: 20px;
    margin-right: 8px;
  }
</style>
