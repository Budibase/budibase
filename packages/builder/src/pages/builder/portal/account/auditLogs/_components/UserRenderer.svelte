<script>
  import { Avatar, Tooltip } from "@budibase/bbui"
  export let row

  let showTooltip
  const getInitials = user => {
    let initials = ""
    initials += user.firstName ? user.firstName[0] : ""
    initials += user.lastName ? user.lastName[0] : ""

    return initials === "" ? user.email[0] : initials
  }
</script>

{#if row?.user?.email}
  <div
    class="container"
    on:mouseover={() => (showTooltip = true)}
    on:focus={() => (showTooltip = true)}
    on:mouseleave={() => (showTooltip = false)}
  >
    <Avatar size="M" initials={getInitials(row.user)} />
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
