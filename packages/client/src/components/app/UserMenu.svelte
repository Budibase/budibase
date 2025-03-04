<script lang="ts">
  import { ActionMenu, Icon, MenuItem } from "@budibase/bbui"
  import { UserAvatar } from "@budibase/frontend-core"
  import { getContext } from "svelte"

  export let compact: boolean = false

  const { authStore } = getContext("sdk")

  const requestChangeDetails = () => {}

  const requestChangePassword = () => {
    // if (isOwner) {
    //   window.location.href = `${$admin.accountPortalUrl}/portal/account`
    // } else {
    //   changePasswordModal.show()
    // }
  }

  const goToPortal = () => {
    window.location.href = "/builder/apps"
  }
</script>

{#if $authStore}
  <ActionMenu align={compact ? "right" : "left"}>
    <svelte:fragment slot="control" let:open>
      <div class="container" class:open>
        <UserAvatar user={$authStore} size="M" showTooltip={false} />
        {#if !compact}
          <div class="text">
            <div class="name">
              {$authStore.firstName}
              {$authStore.lastName}
            </div>
          </div>
        {/if}
        <Icon size="L" name="ChevronDown" />
      </div>
    </svelte:fragment>
    <MenuItem icon="UserEdit" on:click={requestChangeDetails}>
      My profile
    </MenuItem>
    <MenuItem icon="LockClosed" on:click={requestChangePassword}>
      Update password
    </MenuItem>
    <MenuItem icon="Apps" on:click={goToPortal}>Go to portal</MenuItem>
    <MenuItem icon="LogOut" on:click={authStore.actions.logOut}>
      Log out
    </MenuItem>
  </ActionMenu>
{/if}

<style>
  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-xs);
    transition: filter 130ms ease-out;
  }
  .text {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    color: var(--navTextColor);
    display: flex;
  }
  .name {
    font-weight: 600;
    font-size: 14px;
  }
  .container:hover {
    cursor: pointer;
    filter: brightness(110%);
  }
</style>
