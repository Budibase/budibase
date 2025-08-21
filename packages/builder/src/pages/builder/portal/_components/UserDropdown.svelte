<script>
  import { admin, auth } from "@/stores/portal"
  import { ActionMenu, MenuItem, Icon, Modal } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import ProfileModal from "@budibase/frontend-core/src/components/ProfileModal.svelte"
  import ChangePasswordModal from "@budibase/frontend-core/src/components/ChangePasswordModal.svelte"
  import ThemeModal from "@/components/settings/ThemeModal.svelte"
  import APIKeyModal from "@/components/settings/APIKeyModal.svelte"
  import { UserAvatar } from "@budibase/frontend-core"
  import { API } from "@/api"

  export let align = "right"
  export let isPortal = true

  let themeModal
  let profileModal
  let updatePasswordModal
  let apiKeyModal

  $: isOwner = $auth.accountPortalAccess && $admin.cloud

  const logout = async () => {
    try {
      await auth.logout()
    } catch (error) {
      // Swallow error and do nothing
    }
  }
</script>

<ActionMenu {align}>
  <svelte:fragment slot="control" let:open>
    {#if $$slots.default}
      <slot {open} />
    {:else}
      <div class="user-dropdown">
        <UserAvatar size="M" user={$auth.user} showTooltip={false} />
        <Icon size="L" name="caret-down" />
      </div>
    {/if}
  </svelte:fragment>

  <MenuItem icon="user-gear" on:click={() => profileModal.show()}>
    My profile
  </MenuItem>
  <MenuItem icon="moon" on:click={() => themeModal.show()}>Theme</MenuItem>
  {#if !$auth.isSSO}
    <MenuItem
      icon="lock"
      on:click={() => {
        if (isOwner) {
          window.location.href = `${$admin.accountPortalUrl}/portal/account`
        } else {
          updatePasswordModal.show()
        }
      }}
    >
      Update password
    </MenuItem>
  {/if}
  <MenuItem icon="key" on:click={() => apiKeyModal.show()}>
    View API key
  </MenuItem>
  {#if isPortal}
    <MenuItem icon="code" on:click={() => $goto("/builder/apps")}>
      Close developer mode
    </MenuItem>
  {/if}
  <MenuItem icon="sign-out" on:click={logout}>Log out</MenuItem>
</ActionMenu>

<Modal bind:this={themeModal}>
  <ThemeModal />
</Modal>
<Modal bind:this={profileModal}>
  <ProfileModal {API} user={$auth.user} on:save={() => auth.getSelf()} />
</Modal>
<Modal bind:this={updatePasswordModal}>
  <ChangePasswordModal
    {API}
    passwordMinLength={$admin.passwordMinLength}
    on:save={() => auth.getSelf()}
  />
</Modal>
<Modal bind:this={apiKeyModal}>
  <APIKeyModal />
</Modal>

<style>
  .user-dropdown {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-xs);
    transition: filter 130ms ease-out;
  }
  .user-dropdown:hover {
    cursor: pointer;
    filter: brightness(110%);
  }
</style>
