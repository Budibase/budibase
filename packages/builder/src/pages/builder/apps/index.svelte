<script>
  import {
    Heading,
    Layout,
    Divider,
    ActionMenu,
    MenuItem,
    Avatar,
    Page,
    Icon,
    Body,
    Modal,
    notifications,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { apps, organisation, auth } from "stores/portal"
  import { goto } from "@roxi/routify"
  import { AppStatus } from "constants"
  import { gradient } from "actions"
  import UpdateUserInfoModal from "components/settings/UpdateUserInfoModal.svelte"
  import ChangePasswordModal from "components/settings/ChangePasswordModal.svelte"
  import { processStringSync } from "@budibase/string-templates"
  import Logo from "assets/bb-emblem.svg"

  let loaded = false
  let userInfoModal
  let changePasswordModal

  onMount(async () => {
    try {
      await organisation.init()
      await apps.load()
    } catch (error) {
      notifications.error("Error loading apps")
    }
    loaded = true
  })

  const publishedAppsOnly = app => app.status === AppStatus.DEPLOYED

  $: publishedApps = $apps.filter(publishedAppsOnly)
  $: userApps = $auth.user?.builder?.global
    ? publishedApps
    : publishedApps.filter(app =>
        Object.keys($auth.user?.roles).includes(app.prodId)
      )

  function getUrl(app) {
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
</script>

{#if $auth.user && loaded}
  <div class="container">
    <Page>
      <div class="content">
        <Layout noPadding>
          <div class="header">
            <img alt="logo" src={$organisation.logoUrl || Logo} />
            <ActionMenu align="right" dataCy="user-menu">
              <div slot="control" class="avatar">
                <Avatar
                  size="M"
                  initials={$auth.initials}
                  url={$auth.user.pictureUrl}
                />
                <Icon size="XL" name="ChevronDown" />
              </div>
              <MenuItem icon="UserEdit" on:click={() => userInfoModal.show()}>
                Update user information
              </MenuItem>
              <MenuItem
                icon="LockClosed"
                on:click={() => changePasswordModal.show()}
              >
                Update password
              </MenuItem>
              {#if $auth.isBuilder}
                <MenuItem
                  icon="UserDeveloper"
                  on:click={() => $goto("../portal")}
                >
                  Open developer mode
                </MenuItem>
              {/if}
              <MenuItem icon="LogOut" on:click={logout}>Log out</MenuItem>
            </ActionMenu>
          </div>
          <Layout noPadding gap="XS">
            <Heading size="M">
              Hey {$auth.user.firstName || $auth.user.email}
            </Heading>
            <Body>
              Welcome to the {$organisation.company} portal. Below you'll find the
              list of apps that you have access to.
            </Body>
          </Layout>
          <Divider />
          {#if userApps.length}
            <Heading>Apps</Heading>
            <div class="group">
              <Layout gap="S" noPadding>
                {#each userApps as app, idx (app.appId)}
                  <a class="app" target="_blank" href={getUrl(app)}>
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
                    <Icon name="ChevronRight" />
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
    <UpdateUserInfoModal />
  </Modal>
  <Modal bind:this={changePasswordModal}>
    <ChangePasswordModal />
  </Modal>
{/if}

<style>
  .container {
    height: 100%;
    overflow: auto;
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
  img {
    width: 40px;
    margin-bottom: -12px;
  }
  .avatar {
    display: grid;
    grid-template-columns: auto auto;
    place-items: center;
    grid-gap: var(--spacing-xs);
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
