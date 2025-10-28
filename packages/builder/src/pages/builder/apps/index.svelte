<script lang="ts">
  import { gradient } from "@/actions"
  import { API } from "@/api"
  import {
    admin,
    appsStore,
    auth,
    clientAppsStore,
    groups,
    licensing,
    organisation,
  } from "@/stores/portal"
  import type { EnrichedApp } from "@/types"
  import {
    ActionMenu,
    Body,
    Divider,
    Heading,
    Icon,
    Layout,
    MenuItem,
    Modal,
    notifications,
    Page,
  } from "@budibase/bbui"
  import {
    ChangePasswordModal,
    ProfileModal,
    UserAvatar,
  } from "@budibase/frontend-core"
  import { helpers, sdk } from "@budibase/shared-core"
  import { processStringSync } from "@budibase/string-templates"
  import type { PublishedWorkspaceData } from "@budibase/types"
  import { goto } from "@roxi/routify"
  import Logo from "assets/bb-emblem.svg"
  import Spaceman from "assets/bb-space-man.svg"
  import { onMount } from "svelte"

  let loaded: boolean = false
  let userInfoModal: Modal
  let changePasswordModal: Modal

  $: userApps = $clientAppsStore.apps
  $: isOwner = $auth.accountPortalAccess && $admin.cloud

  function getUrl(app: EnrichedApp | PublishedWorkspaceData) {
    if (app.url) {
      return `/app${app.url}`
    } else {
      return `/${app.prodId}`
    }
  }

  const logout = async () => {
    try {
      await auth.logout()
    } catch (error) {
      // Swallow error and do nothing
    }
  }

  onMount(async () => {
    try {
      await organisation.init()
      await appsStore.load()
      await clientAppsStore.load()
      await groups.init()
    } catch (error) {
      notifications.error("Error loading apps")
    }
    loaded = true
  })
</script>

{#if $auth.user && loaded}
  <div class="container">
    <Page narrow>
      <div class="content">
        <Layout noPadding>
          <div class="header">
            <img class="logo" alt="logo" src={$organisation.logoUrl || Logo} />
            <ActionMenu align="right">
              <div slot="control" class="avatar">
                <UserAvatar size="M" user={$auth.user} showTooltip={false} />
                <Icon size="L" name="caret-down" />
              </div>
              <MenuItem
                icon="user-circle-gear"
                on:click={() => userInfoModal.show()}
              >
                My profile
              </MenuItem>
              <MenuItem
                icon="lock"
                on:click={() => {
                  if (isOwner) {
                    window.location.href = `${$admin.accountPortalUrl}/portal/account`
                  } else {
                    changePasswordModal.show()
                  }
                }}
              >
                Update password
              </MenuItem>
              {#if sdk.users.hasBuilderPermissions($auth.user)}
                <MenuItem icon="user-gear" on:click={() => $goto("../portal")}>
                  Open developer mode
                </MenuItem>
              {/if}
              <MenuItem icon="sign-out" on:click={logout}>Log out</MenuItem>
            </ActionMenu>
          </div>
          <Layout noPadding gap="XS">
            <Heading size="M">
              Hey {helpers.getUserLabel($auth.user)}
            </Heading>
            <Body>
              Welcome to the {$organisation.company} portal. Below you'll find the
              list of apps that you have access to.
            </Body>
          </Layout>
          <Divider />
          {#if $licensing.errUserLimit}
            <div>
              <Layout gap="S" justifyItems="center">
                <img class="spaceman" alt="spaceman" src={Spaceman} />
                <Heading size="M">
                  {"Your apps are currently offline."}
                </Heading>
                Please contact the account holder to get them back online.
              </Layout>
            </div>
          {:else if userApps.length}
            <Heading>Apps</Heading>
            <div class="group">
              <Layout gap="S" noPadding>
                {#each userApps as app (app.appId)}
                  <a
                    class="app"
                    target="_blank"
                    rel="noreferrer"
                    href={getUrl(app)}
                  >
                    <div class="preview" use:gradient={{ seed: app.name }} />
                    <div class="app-info">
                      <Heading size="XS">{app.name}</Heading>
                      <Body size="S">
                        {#if app.updatedAt}
                          {processStringSync(
                            "Updated {{ duration time 'millisecond' }} ago",
                            {
                              time:
                                new Date().getTime() -
                                new Date(app.updatedAt).getTime(),
                            }
                          )}
                        {:else}
                          Never updated
                        {/if}
                      </Body>
                    </div>
                    <Icon name="caret-right" />
                  </a>
                {/each}
              </Layout>
            </div>
          {:else}
            <Layout gap="XS" noPadding>
              <Heading size="S">You don't have access to any apps yet.</Heading>
              <Body size="S">
                The apps you have access to will be listed here.
              </Body>
            </Layout>
          {/if}
        </Layout>
      </div>
    </Page>
  </div>
  <Modal bind:this={userInfoModal}>
    <ProfileModal {API} user={$auth.user} on:save={() => auth.getSelf()} />
  </Modal>
  <Modal bind:this={changePasswordModal}>
    <ChangePasswordModal
      {API}
      passwordMinLength={$admin.passwordMinLength}
      on:save={() => auth.getSelf()}
    />
  </Modal>
{/if}

<style>
  .container {
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 80px;
  }
  .content {
    width: 100%;
  }
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  img.logo {
    width: 40px;
    margin-bottom: -12px;
  }
  img.spaceman {
    width: 100px;
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
  .app {
    display: grid;
    grid-template-columns: auto 1fr auto;
    background-color: var(--background);
    padding: var(--spacing-xl);
    border-radius: var(--border-radius-s);
    align-items: center;
    grid-gap: var(--spacing-xl);
    color: inherit;
  }
  .app:hover {
    cursor: pointer;
    background: var(--spectrum-global-color-gray-200);
    transition: background-color 130ms ease-in-out;
  }
  .preview {
    height: 40px;
    width: 60px;
    border-radius: var(--border-radius-s);
  }
</style>
