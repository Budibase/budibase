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
  import { apps, organisation, auth, groups, licensing } from "stores/portal"
  import { goto } from "@roxi/routify"
  import { AppStatus } from "constants"
  import { gradient } from "actions"
  import ProfileModal from "components/settings/ProfileModal.svelte"
  import ChangePasswordModal from "components/settings/ChangePasswordModal.svelte"
  import { processStringSync } from "@budibase/string-templates"
  import Spaceman from "assets/bb-space-man.svg"
  import Logo from "assets/bb-emblem.svg"

  import { _ } from "lang/i18n"

  let loaded = false
  let userInfoModal
  let changePasswordModal

  onMount(async () => {
    try {
      await organisation.init()
      await apps.load()
      await groups.actions.init()
    } catch (error) {
      notifications.error($_("pages.builder.apps.index.notificationsError"))
    }
    loaded = true
  })
  const publishedAppsOnly = app => app.status === AppStatus.DEPLOYED

  $: userGroups = $groups.filter(group =>
    group.users.find(user => user._id === $auth.user?._id)
  )
  let userApps = []
  $: publishedApps = $apps.filter(publishedAppsOnly)

  $: {
    if (!Object.keys($auth.user?.roles).length && $auth.user?.userGroups) {
      userApps =
        $auth.user?.builder?.global || $auth.user?.admin?.global
          ? publishedApps
          : publishedApps.filter(app => {
              return userGroups.find(group => {
                return groups.actions
                  .getGroupAppIds(group)
                  .map(role => apps.extractAppId(role))
                  .includes(app.appId)
              })
            })
    } else {
      userApps =
        $auth.user?.builder?.global || $auth.user?.admin?.global
          ? publishedApps
          : publishedApps.filter(app =>
              Object.keys($auth.user?.roles)
                .map(x => apps.extractAppId(x))
                .includes(app.appId)
            )
    }
  }

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
    <Page narrow>
      <div class="content">
        <Layout noPadding>
          <div class="header">
            <img class="logo" alt="logo" src={$organisation.logoUrl || Logo} />
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
                {$_("pages.builder.apps.index.Page.menuItemProfile")}
              </MenuItem>
              <MenuItem
                icon="LockClosed"
                on:click={() => changePasswordModal.show()}
              >
                {$_("pages.builder.apps.index.Page.menuItemUpdatePassword")}
              </MenuItem>
              {#if $auth.isBuilder}
                <MenuItem
                  icon="UserDeveloper"
                  on:click={() => $goto("../portal")}
                >
                  {$_("pages.builder.apps.index.Page.menuItemDeveloper")}
                </MenuItem>
              {/if}
              <MenuItem icon="LogOut" on:click={logout}
                >{$_("pages.builder.apps.index.Page.Log_out")}</MenuItem
              >
            </ActionMenu>
          </div>
          <Layout noPadding gap="XS">
            <Heading size="M">
              {$_("pages.builder.apps.index.Page.menuHeading")}
              {$auth.user.firstName || $auth.user.email}
            </Heading>
            <Body>
              {$_("pages.builder.apps.index.Page.menuBodyPt1")}
              {$organisation.company}
              {$_("pages.builder.apps.index.Page.menuBodyPt2")}
            </Body>
          </Layout>
          <Divider />
          {#if $licensing.usageMetrics?.dayPasses >= 100}
            <div>
              <Layout gap="S" justifyItems="center">
                <img class="spaceman" alt="spaceman" src={Spaceman} />
                <Heading size="M">
                  {$_("pages.builder.apps.index.Page.menuHeadingOffline")}
                </Heading>
                {$_("pages.builder.apps.index.Page.menuLayout")}
              </Layout>
            </div>
          {:else if userApps.length}
            <Heading
              >{$_("pages.builder.apps.index.Page.menuHeadingApps")}</Heading
            >
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
                            `${$_(
                              "pages.builder.apps.index.Page.menuTimeHeadingPt1"
                            )} {{ duration time 'millisecond' }} ${$_(
                              "pages.builder.apps.index.Page.menuTimeHeadingPt2"
                            )}`,
                            {
                              time:
                                new Date().getTime() -
                                new Date(app.updatedAt).getTime(),
                            }
                          )}
                        {:else}
                          {$_("pages.builder.apps.index.Page.menuTimeNoUpdate")}
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
              <Heading size="S">{$_("pages.builder.apps.index.Page.menuLayoutHeading")}</Heading>
              <Body size="S">
                {$_("pages.builder.apps.index.Page.menuLayoutBody")}
              </Body>
            </Layout>
          {/if}
        </Layout>
      </div>
    </Page>
  </div>
  <Modal bind:this={userInfoModal}>
    <ProfileModal />
  </Modal>
  <Modal bind:this={changePasswordModal}>
    <ChangePasswordModal />
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
