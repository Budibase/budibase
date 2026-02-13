<script>
  import { Icon } from "@budibase/bbui"

  export let row

  $: icon = row?.icon
</script>

<!-- lock-simple default -->
<div class="connection-icon">
  {#if icon?.type == "icon"}
    <Icon name={icon.value} />
  {:else if icon?.type == "asset"}
    <img src={icon.value} alt="icon" height={18} width={18} />
  {:else}
    <Icon name="lock-simple" />
  {/if}
</div>
