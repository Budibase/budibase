<script>
  import { fly } from "svelte/transition"
  export let item
</script>

<div
  data-cy={item.name}
  class="item-item"
  in:fly={{ y: 100, duration: 1000 }}
  on:click>
  <div class="item-icon">
    <i class={item.icon} />
  </div>
  <div class="item-text">
    <div class="item-name">{item.name}</div>
  </div>
</div>

<style>
  .item-item {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    padding: 12px 16px 16px 16px;
    height: 80px;
    justify-content: center;
    align-items: center;
    background-color: var(--grey-1);
    border-radius: 5px;
  }

  .item-item:hover {
    background: var(--grey-2);
    transition: all 0.3s;
  }

  .item-icon {
    border-radius: 3px;
    display: flex;
  }

  .item-text {
    display: flex;
    flex-direction: column;
  }

  .item-name {
    font-size: 14px;
    font-weight: 400;
    text-align: center;
  }

  i {
    font-size: 24px;
    color: var(--grey-7);
  }
</style>
