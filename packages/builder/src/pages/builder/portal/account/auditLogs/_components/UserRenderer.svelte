<script>
  import { Tooltip } from "@budibase/bbui"
  import { UserAvatar } from "@budibase/frontend-core"

  export let row

  let showTooltip
</script>

{#if row?.user?.email}
  <div
    class="container"
    on:mouseover={() => (showTooltip = true)}
    on:focus={() => (showTooltip = true)}
    on:mouseleave={() => (showTooltip = false)}
  >
    <UserAvatar user={row.user} />
  </div>
  {#if showTooltip}
    <div class="tooltip">
      <Tooltip textWrapping text={row.user.email} direction="bottom" />
    </div>
  {/if}
{/if}

<style>
  .container {
    position: relative;
  }
  .tooltip {
    z-index: 1;
    position: absolute;
    top: 75%;
    left: 120%;
    transform: translateX(-100%) translateY(-50%);
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 130px;
    pointer-events: none;
  }
</style>
