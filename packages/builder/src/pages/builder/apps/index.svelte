<script>
  import {
    Heading,
    Layout,
    Select,
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

  let loaded = false
  let userInfoModal
  let changePasswordModal

  onMount(async () => {
    await organisation.init()
    await apps.load(AppStatus.DEV)
    loaded = true
  })
</script>

{#if $auth.user && loaded}
  <div class="container">
    <Page>
      <div class="content">
        asdas
        <Layout noPadding>
          <img src={$organisation.logoUrl} />
          <div class="info-title">
            <Layout noPadding gap="XS">
              <Heading size="L">
                Hey {$auth.user.firstName || $auth.user.email}
              </Heading>
              <Body>
                Welcome to the {$organisation.company} portal. Below you'll find
                the list of apps that you have access to.
              </Body>
            </Layout>
            <ActionMenu align="right">
              <div slot="control" class="avatar">
                <Avatar size="M" name="John Doe" />
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
              <MenuItem
                icon="UserDeveloper"
                on:click={() => $goto("../portal")}
              >
                Open developer mode
              </MenuItem>
              <MenuItem icon="LogOut" on:click={auth.logout}>Log out</MenuItem>
            </ActionMenu>
          </div>
          <Divider />
          {#if $apps.length}
            <Heading>Apps</Heading>
            <div class="group">
              <Layout gap="S" noPadding>
                {#each $apps as app, idx (app.appId)}
                  <a class="app" target="_blank" href={`/${app.appId}`}>
                    <div class="preview" use:gradient={{ seed: app.name }} />
                    <div class="app-info">
                      <Heading size="XS">{app.name}</Heading>
                      <Body size="S">
                        Edited {Math.round(Math.random() * 10 + 1)} months ago
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
    padding: 60px 0;
    width: 100%;
  }
  img {
    width: 40px;
    margin-bottom: -12px;
  }
  .info-title {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: var(--spacing-xl);
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
    margin-top: var(--spacing-s);
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
