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
    await organisation.init()
    await apps.load()
    loaded = true
  })

  const publishedAppsOnly = app => app.status === AppStatus.DEPLOYED

  $: publishedApps = $apps.filter(publishedAppsOnly)
</script>

{#if $auth.user && loaded}
  <div class="container">
    <Page>
      <div class="content">
        <Layout noPadding>
          <div class="header">
            <img alt="logo" src={$organisation.logoUrl || Logo} />
            <ActionMenu align="right">
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
              <MenuItem icon="LogOut" on:click={auth.logout}>Log out</MenuItem>
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
          {#if publishedApps.length}
            <Heading>Apps</Heading>
            <div class="group">
              <Layout gap="S" noPadding>
                {#each publishedApps as app, idx (app.appId)}
                  <a class="app" target="_blank" href={`/${app.prodId}`}>
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
  .group {
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
