<script lang="ts">
  import { ActionMenu, Icon, MenuItem, Modal } from "@budibase/bbui"
  import {
    UserAvatar,
    ProfileModal,
    ChangePasswordModal,
  } from "@budibase/frontend-core"
  import { getContext } from "svelte"
  import { type User, type ContextUser, isSSOUser } from "@budibase/types"
  import {
    helpers,
    sdk,
    resolveTranslationGroup,
    resolveWorkspaceTranslations,
  } from "@budibase/shared-core"
  import { API } from "@/api"

  export let compact: boolean = false
  export let collapsed: boolean = false

  const { authStore, environmentStore, notificationStore, appStore } =
    getContext("sdk")

  let profileModal: any
  let changePasswordModal: any

  $: text = getText($authStore)
  $: isBuilder = sdk.users.hasBuilderPermissions($authStore)
  $: isSSO = $authStore != null && isSSOUser($authStore)
  $: isOwner = $authStore?.accountPortalAccess && $environmentStore.cloud
  $: embedded = $appStore.embedded || $appStore.inIframe
  $: translationOverrides = resolveWorkspaceTranslations(
    $appStore.application?.translationOverrides
  )
  $: userMenuLabels = resolveTranslationGroup("userMenu", translationOverrides)
  $: profileLabels = resolveTranslationGroup(
    "profileModal",
    translationOverrides
  )
  $: passwordLabels = resolveTranslationGroup(
    "passwordModal",
    translationOverrides
  )

  const { accountPortalAccountUrl, builderWorkspacesUrl, builderAppsUrl } =
    helpers

  const getText = (user?: User | ContextUser): string => {
    if (!user) {
      return ""
    }
    if (user.firstName) {
      let text = user.firstName
      if (user.lastName) {
        text += ` ${user.lastName}`
      }
      return text
    } else {
      return user.email
    }
  }

  const goToPortal = () => {
    const builderBaseUrl = $environmentStore.accountPortalUrl
    const targetUrl = isBuilder
      ? builderWorkspacesUrl(builderBaseUrl)
      : builderAppsUrl(builderBaseUrl)
    window.location.href = targetUrl
  }

  $: user = $authStore as User
</script>

{#if $authStore}
  <ActionMenu align={compact ? "right" : "left"}>
    <svelte:fragment slot="control">
      <div class="container">
        <UserAvatar {user} size="M" showTooltip={false} />
        {#if !collapsed}
          {#if !compact}
            <div class="text">
              <div class="name">
                {text}
              </div>
            </div>
          {/if}
          <Icon size="S" name="caret-down" color="var(--navTextColor)" />
        {/if}
      </div>
    </svelte:fragment>

    <MenuItem icon="user-gear" on:click={() => profileModal?.show()}>
      {userMenuLabels.profile}
    </MenuItem>
    {#if !isSSO}
      <MenuItem
        icon="lock"
        on:click={() => {
          if (isOwner) {
            window.location.href = accountPortalAccountUrl(
              $environmentStore.accountPortalUrl
            )
          } else {
            changePasswordModal?.show()
          }
        }}
      >
        {userMenuLabels.password}
      </MenuItem>
    {/if}

    <MenuItem icon="squares-four" on:click={goToPortal} disabled={embedded}>
      {userMenuLabels.portal}
    </MenuItem>
    <MenuItem
      icon="sign-out"
      on:click={authStore.actions.logOut}
      disabled={embedded}
    >
      {userMenuLabels.logout}
    </MenuItem>
  </ActionMenu>

  <Modal bind:this={profileModal}>
    <ProfileModal
      {API}
      user={$authStore}
      on:save={() => authStore.actions.fetchUser()}
      notifySuccess={notificationStore.actions.success}
      notifyError={notificationStore.actions.error}
      labels={profileLabels}
    />
  </Modal>
  <Modal bind:this={changePasswordModal}>
    <ChangePasswordModal
      {API}
      passwordMinLength={$environmentStore.passwordMinLength}
      on:save={() => authStore.actions.logOut()}
      notifySuccess={notificationStore.actions.success}
      notifyError={notificationStore.actions.error}
      labels={passwordLabels}
    />
  </Modal>
{/if}

<style>
  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-xs);
    transition: filter 130ms ease-out;
    overflow: hidden;
  }
  .text {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    color: var(--navTextColor);
    display: flex;
    margin-left: var(--spacing-xs);
    overflow: hidden;
  }
  .name {
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
  }
  .container:hover {
    cursor: pointer;
    filter: brightness(110%);
  }
</style>
