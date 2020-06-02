<script>
  import { fly } from "svelte/transition"
  export let item
</script>

<div class="item-item" in:fly={{ y: 100, duration: 1000 }} on:click>
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
    margin-bottom: 8px;
    padding: 8px 0px 16px 0px;
    width: 110px;
    height: 80px;
    justify-content: center;
    align-items: center;
    margin-right: 8px;
    background-color: var(--grey-light);
    border-radius: 3px;
  }

  .item-item:hover {
    background: var(--grey);
    border-radius: 3px;
    transition: all 0.2s;
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
  }

  i {
    font-size: 24px;
    color: var(--ink-light);
  }
</style>
