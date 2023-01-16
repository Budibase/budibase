<script>
  import { auth } from "stores/portal"
  import { ActionMenu, Avatar, MenuItem, Icon, Modal } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import ProfileModal from "components/settings/ProfileModal.svelte"
  import ChangePasswordModal from "components/settings/ChangePasswordModal.svelte"
  import ThemeModal from "components/settings/ThemeModal.svelte"
  import APIKeyModal from "components/settings/APIKeyModal.svelte"

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

<ActionMenu align="right" dataCy="user-menu">
  <div slot="control" class="user-dropdown">
    <Avatar size="M" initials={$auth.initials} url={$auth.user.pictureUrl} />
    <Icon size="XL" name="ChevronDown" />
  </div>
  <MenuItem icon="Moon" on:click={() => themeModal.show()} dataCy="theme">
    Theme
  </MenuItem>
  <MenuItem
    icon="UserEdit"
    on:click={() => profileModal.show()}
    dataCy="user-info"
  >
    My profile
  </MenuItem>
  <MenuItem icon="LockClosed" on:click={() => updatePasswordModal.show()}>
    Update password
  </MenuItem>
  <MenuItem icon="Key" on:click={() => apiKeyModal.show()} dataCy="api-key">
    View API key
  </MenuItem>
  <MenuItem icon="UserDeveloper" on:click={() => $goto("../apps")}>
    Close developer mode
  </MenuItem>
  <MenuItem dataCy="user-logout" icon="LogOut" on:click={logout}>
    Log out
  </MenuItem>
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
