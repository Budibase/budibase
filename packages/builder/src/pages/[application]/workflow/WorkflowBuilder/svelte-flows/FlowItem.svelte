<script>
  export let onSelect
  export let block

  function selectBlock() {
    onSelect(block);
  }
</script>

<div class="hoverable" on:click={selectBlock}>
  <header>{block.heading}</header>
  <hr />
  <p>{block.body}</p>
</div>

<style>
  div {
    border: 1px solid black;
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

  div:hover {
    transform: scale(1.05);
  }
</style>
