<script>
  export let title
  export let icon

  export let primary
  export let secondary
  export let tertiary
</script>

<div on:click class:primary class:secondary class:tertiary>
  <i class={icon} />
  <span>{title}</span>
</div>

<style>
  div {
    height: 80px;
    border-radius: 3px;
    color: var(--ink);
    font-weight: 500;
    padding: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: 0.3s transform;
    background: var(--light-grey);
  }

  i {
    font-size: 30px;
  }
  
  span {
    font-size: 14px;
    text-align: center;
  }

  div:hover {
    cursor: pointer;
    transform: scale(1.1);
  }

  .primary {
    background: var(--ink);
    color: var(--white);
  }

  .secondary {
    background: var(--secondary);
  }

  .tertiary {
    background: var(--white);
  }

</style>
