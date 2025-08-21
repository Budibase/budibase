<script lang="ts">
  import { ActionMenu, Icon, MenuItem, Modal } from "@budibase/bbui"
  import {
    UserAvatar,
    ProfileModal,
    ChangePasswordModal,
  } from "@budibase/frontend-core"
  import { getContext } from "svelte"
  import { type User, type ContextUser, isSSOUser } from "@budibase/types"
  import { sdk } from "@budibase/shared-core"
  import { API } from "@/api"

  export let compact: boolean = false

  const { authStore, environmentStore, notificationStore, appStore } =
    getContext("sdk")

  let profileModal: any
  let changePasswordModal: any

  $: text = getText($authStore)
  $: isBuilder = sdk.users.hasBuilderPermissions($authStore)
  $: isSSO = $authStore != null && isSSOUser($authStore)
  $: isOwner = $authStore?.accountPortalAccess && $environmentStore.cloud
  $: embedded = $appStore.embedded || $appStore.inIframe

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
    window.location.href = isBuilder ? "/builder/portal/apps" : "/builder/apps"
  }

  $: user = $authStore as User
</script>

{#if $authStore}
  <ActionMenu align={compact ? "right" : "left"}>
    <svelte:fragment slot="control">
      <div class="container">
        <UserAvatar {user} size="M" showTooltip={false} />
        {#if !compact}
          <div class="text">
            <div class="name">
              {text}
            </div>
          </div>
        {/if}
        <Icon size="S" name="caret-down" color="var(--navTextColor)" />
      </div>
    </svelte:fragment>

    <MenuItem icon="user-gear" on:click={() => profileModal?.show()}>
      My profile
    </MenuItem>
    {#if !isSSO}
      <MenuItem
        icon="lock"
        on:click={() => {
          if (isOwner) {
            window.location.href = `${$environmentStore.accountPortalUrl}/portal/account`
          } else {
            changePasswordModal?.show()
          }
        }}
      >
        Update password
      </MenuItem>
    {/if}

    <MenuItem icon="squares-four" on:click={goToPortal} disabled={embedded}>
      Go to portal
    </MenuItem>
    <MenuItem
      icon="sign-out"
      on:click={authStore.actions.logOut}
      disabled={embedded}
    >
      Log out
    </MenuItem>
  </ActionMenu>

  <Modal bind:this={profileModal}>
    <ProfileModal
      {API}
      user={$authStore}
      on:save={() => authStore.actions.fetchUser()}
      notifySuccess={notificationStore.actions.success}
      notifyError={notificationStore.actions.error}
    />
  </Modal>
  <Modal bind:this={changePasswordModal}>
    <ChangePasswordModal
      {API}
      passwordMinLength={$environmentStore.passwordMinLength}
      on:save={() => authStore.actions.logOut()}
      notifySuccess={notificationStore.actions.success}
      notifyError={notificationStore.actions.error}
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
