<script>
  export let onSelect
  export let block

  function selectBlock() {
    onSelect(block)
  }

  console.log(block)
</script>

<div class={`${block.type} hoverable`} on:click={selectBlock}>
  <header>{block.heading}</header>
  <hr />
  <p>
    {@html block.body}
  </p>
</div>

<style>
  div {
    width: 320px;
    padding: 20px;
    margin-bottom: 60px;
    border-radius: 5px;
    transition: 0.3s all;
    box-shadow: 0 4px 30px 0 rgba(57, 60, 68, 0.08);
    background-color: var(--font);
    font-size: 16px;
    color: var(--white);
  }

  .ACTION {
    background-color: var(--white);
    color: var(--font);
  }

  .TRIGGER {
    background-color: var(--font);
    color: var(--white);
  }

  .LOGIC {
    background-color: var(--secondary);
    color: var(--font);
  }

  div:hover {
    transform: scale(1.05);
  }
</style>
