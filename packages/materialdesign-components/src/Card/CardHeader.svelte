<script>
  import { H6, Sub2 } from "../Typography"
  import Icon from "../Common/Icon.svelte"
  export let _bb
  export let title = ""
  export let subtitle = ""
  export let icon = ""

  $: useIcon = !!icon
  $: useSubtitle = !!subtitle
</script>

<div class="card-header">
  {#if useIcon}
    <div class="card-header__icon">
      <Icon {icon} />
    </div>
  {/if}
  <div class="card-header__title">
    <H6 text={title} />
    {#if useSubtitle}
      <Sub2 text={subtitle} />
    {/if}
  </div>
</div>

<style>
  .card-header {
    display: flex;
    flex-flow: row nowrap;
    padding: 10px;
  }

  .card-header__icon {
    flex: 0;
    padding: 10px;
  }

  .card-header__title {
    display: flex;
    flex-flow: column nowrap;
    flex: 1;
  }
</style>
