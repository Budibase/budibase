<script>
  import { auth } from "@/stores/portal"
  import { ActionMenu, MenuItem, Icon, Modal } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import ProfileModal from "@/components/settings/ProfileModal.svelte"
  import ChangePasswordModal from "@/components/settings/ChangePasswordModal.svelte"
  import ThemeModal from "@/components/settings/ThemeModal.svelte"
  import APIKeyModal from "@/components/settings/APIKeyModal.svelte"
  import { UserAvatar } from "@budibase/frontend-core"

  let themeModal
  let profileModal
  let updatePasswordModal
  let apiKeyModal

  const logout = async () => {
    try {
      await auth.logout()
    } catch (error) {
      // Swallow error and do nothing
    }
  }
</script>

<ActionMenu align="right">
  <div slot="control" class="user-dropdown">
    <UserAvatar user={$auth.user} showTooltip={false} />
    <Icon size="XL" name="ChevronDown" />
  </div>
  <MenuItem icon="UserEdit" on:click={() => profileModal.show()}>
    My profile
  </MenuItem>
  <MenuItem icon="Moon" on:click={() => themeModal.show()}>Theme</MenuItem>
  {#if !$auth.isSSO}
    <MenuItem icon="LockClosed" on:click={() => updatePasswordModal.show()}>
      Update password
    </MenuItem>
  {/if}
  <MenuItem icon="Key" on:click={() => apiKeyModal.show()}>
    View API key
  </MenuItem>
  <MenuItem icon="UserDeveloper" on:click={() => $goto("../apps")}>
    Close developer mode
  </MenuItem>
  <MenuItem icon="LogOut" on:click={logout}>Log out</MenuItem>
</ActionMenu>

<Modal bind:this={themeModal}>
  <ThemeModal />
</Modal>
<Modal bind:this={profileModal}>
  <ProfileModal />
</Modal>
<Modal bind:this={updatePasswordModal}>
  <ChangePasswordModal />
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
    gap: var(--spacing-s);
  }
  .user-dropdown:hover {
    cursor: pointer;
    filter: brightness(110%);
  }
</style>
