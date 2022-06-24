<script>
  import Detail from "../Typography/Detail.svelte"

  export let title = null
</script>

<div>
  {#if title}
    <div class="title">
      <Detail>{title}</Detail>
    </div>
  {/if}
  <div class="list-items">
    <slot />
  </div>
</div>

<style>
  .title {
    margin-bottom: 6px;
  }
  .list-items {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
</style>
