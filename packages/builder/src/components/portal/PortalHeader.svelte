<script lang="ts">
  import { API } from "@/api"
  import { admin, auth, organisation, translations } from "@/stores/portal"
  import { ActionMenu, Icon, MenuItem, Modal } from "@budibase/bbui"
  import {
    ChangePasswordModal,
    ProfileModal,
    UserAvatar,
  } from "@budibase/frontend-core"
  import { helpers, sdk, resolveTranslationGroup } from "@budibase/shared-core"
  import Logo from "assets/bb-emblem.svg"

  interface Props {
    active: "apps" | "requests"
  }

  let { active }: Props = $props()

  let userInfoModal: Modal | undefined = $state()
  let changePasswordModal: Modal | undefined = $state()

  const { accountPortalAccountUrl } = helpers

  const links = [
    { id: "apps", label: "Apps", href: "/apps" },
    { id: "requests", label: "Requests", href: "/requests" },
  ]

  let isOwner = $derived($auth.accountPortalAccess && $admin.cloud)
  let translationOverrides = $derived.by(() => {
    if (!$translations.loaded) {
      return {}
    }
    const locale = $translations.config.defaultLocale
    return $translations.config.locales[locale]?.overrides ?? {}
  })
  let profileLabels = $derived(
    resolveTranslationGroup("profileModal", translationOverrides)
  )
  let passwordLabels = $derived(
    resolveTranslationGroup("passwordModal", translationOverrides)
  )
  let menuLabels = $derived(
    resolveTranslationGroup("userMenu", translationOverrides)
  )

  const logout = async () => {
    try {
      await auth.logout()
    } catch (error) {
      // Swallow error and do nothing
    }
  }

  const changePassword = () => {
    if (isOwner) {
      window.location.href = accountPortalAccountUrl($admin.accountPortalUrl)
    } else {
      changePasswordModal?.show()
    }
  }
</script>

<div class="header">
  <div class="left">
    <img class="logo" alt="logo" src={$organisation.logoUrl || Logo} />
    <nav class="links">
      {#each links as link (link.id)}
        <a class="link" class:active={active === link.id} href={link.href}>
          {link.label}
        </a>
      {/each}
    </nav>
  </div>
  <ActionMenu align="right">
    <div slot="control" class="avatar">
      <UserAvatar size="M" user={$auth.user} showTooltip={false} />
      <Icon size="L" name="caret-down" />
    </div>
    <MenuItem icon="user-circle-gear" on:click={() => userInfoModal?.show()}>
      {menuLabels.profile}
    </MenuItem>
    <MenuItem icon="lock" on:click={changePassword}>
      {menuLabels.password}
    </MenuItem>
    {#if sdk.users.hasBuilderPermissions($auth.user)}
      <MenuItem
        icon="code"
        on:click={() => (window.location.href = "/builder")}
      >
        {menuLabels.builder}
      </MenuItem>
    {/if}
    <MenuItem icon="sign-out" on:click={logout}>{menuLabels.logout}</MenuItem>
  </ActionMenu>
</div>

<Modal bind:this={userInfoModal}>
  <ProfileModal
    {API}
    user={$auth.user}
    on:save={() => auth.getSelf()}
    labels={profileLabels}
  />
</Modal>
<Modal bind:this={changePasswordModal}>
  <ChangePasswordModal
    {API}
    passwordPolicy={$admin.passwordPolicy}
    on:save={() => auth.getSelf()}
    labels={passwordLabels}
  />
</Modal>

<style>
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .left {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
  }
  img.logo {
    width: 40px;
  }
  .links {
    display: flex;
    gap: var(--spacing-xs);
  }
  .link {
    padding: var(--spacing-s) var(--spacing-m);
    border-radius: var(--border-radius-s);
    color: var(--spectrum-global-color-gray-700);
    font-size: var(--font-size-m);
    transition: background-color 130ms ease-in-out;
  }
  .link:hover {
    color: var(--spectrum-global-color-gray-900);
  }
  .link.active {
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-900);
    font-weight: 600;
  }
  .avatar {
    display: grid;
    grid-template-columns: auto auto;
    place-items: center;
    grid-gap: var(--spacing-xs);
    transition: filter 130ms ease-out;
  }
  .avatar:hover {
    cursor: pointer;
    filter: brightness(110%);
  }
</style>
