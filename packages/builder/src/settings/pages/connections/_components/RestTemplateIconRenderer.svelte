<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import type { RestTemplate } from "@budibase/types"

  export let row: RestTemplate
</script>

<div class="template-icon">
  {#if row.icon}
    <img src={row.icon} alt="" />
  {:else}
    <Icon name="globe-simple" size="S" />
  {/if}
</div>

<style>
  .template-icon {
    display: flex;
    align-items: center;
  }

  img {
    width: 18px;
    height: 18px;
    object-fit: contain;
  }
</style>
