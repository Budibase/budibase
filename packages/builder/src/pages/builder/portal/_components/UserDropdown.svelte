<script>
  import { auth } from "stores/portal"
  import { ActionMenu, Avatar, MenuItem, Icon, Modal } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import ProfileModal from "components/settings/ProfileModal.svelte"
  import ChangePasswordModal from "components/settings/ChangePasswordModal.svelte"
  import ThemeModal from "components/settings/ThemeModal.svelte"
  import APIKeyModal from "components/settings/APIKeyModal.svelte"

  import { _ } from "lang/i18n"

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
    <Avatar size="M" initials={$auth.initials} url={$auth.user.pictureUrl} />
    <Icon size="XL" name="ChevronDown" />
  </div>
  <MenuItem icon="UserEdit" on:click={() => profileModal.show()}>
    {$_("pages.builder.portal._components.UserDropdown.My_profile")}
  </MenuItem>
  <MenuItem icon="Moon" on:click={() => themeModal.show()}
    >{$_("pages.builder.portal._components.UserDropdown.Theme")}</MenuItem
  >
  {#if !$auth.isSSO}
    <MenuItem icon="LockClosed" on:click={() => updatePasswordModal.show()}>
      {$_("pages.builder.portal._components.UserDropdown.Update_password")}
    </MenuItem>
  {/if}
  <MenuItem icon="Key" on:click={() => apiKeyModal.show()}>
    {$_("pages.builder.portal._components.UserDropdown.View_API_key")}
  </MenuItem>
  <MenuItem icon="UserDeveloper" on:click={() => $goto("../apps")}>
    {$_("pages.builder.portal._components.UserDropdown.Close_developer_mode")}
  </MenuItem>
  <MenuItem icon="LogOut" on:click={logout}
    >{$_("pages.builder.portal._components.UserDropdown.Log_out")}</MenuItem
  >
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
