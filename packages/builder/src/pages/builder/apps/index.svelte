<script lang="ts">
  import { gradient } from "@/actions"
  import { API } from "@/api"
  import {
    admin,
    auth,
    clientAppsStore,
    licensing,
    organisation,
    translations,
  } from "@/stores/portal"
  import type { EnrichedApp } from "@/types"
  import type { User } from "@budibase/types"
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
  import { helpers, sdk, resolveTranslationGroup } from "@budibase/shared-core"
  import { processStringSync } from "@budibase/string-templates"
  import type { PublishedWorkspaceData } from "@budibase/types"
  import { goto } from "@roxi/routify"
  import Logo from "assets/bb-emblem.svg"
  import Spaceman from "assets/bb-space-man.svg"
  import { onMount } from "svelte"

  $goto // manually initialize the helper

  let loaded: boolean = false
  let chatAppsLoaded: boolean = false
  type PublishedChatAppData = {
    appId: string
    chatAppId: string
    name: string
    url: string
    updatedAt?: string
  }
  let liveChatApps: PublishedChatAppData[] = []
  let userInfoModal: Modal
  let changePasswordModal: Modal

  const { accountPortalAccountUrl } = helpers

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
      await Promise.all([
        clientAppsStore.load(),
        translations.init(),
        API.get<{ chatApps: PublishedChatAppData[] }>({
          url: "/api/client/chatapps",
        })
          .then(response => {
            liveChatApps = response.chatApps
            chatAppsLoaded = true
          })
          .catch(() => {
            notifications.error("Error loading chat apps")
            chatAppsLoaded = true
          }),
      ])
    } catch (error) {
      notifications.error("Error loading apps")
    }
    loaded = true
  })

  $: translationOverrides = (() => {
    if (!$translations.loaded) {
      return {}
    }
    const locale = $translations.config.defaultLocale
    return $translations.config.locales[locale]?.overrides ?? {}
  })()

  $: portalLabels = resolveTranslationGroup("portal", translationOverrides)
  $: profileLabels = resolveTranslationGroup(
    "profileModal",
    translationOverrides
  )
  $: passwordLabels = resolveTranslationGroup(
    "passwordModal",
    translationOverrides
  )
  $: menuLabels = resolveTranslationGroup("userMenu", translationOverrides)

  $: currentUser = $auth.user as User | undefined
  $: greetingText = processStringSync(portalLabels.greeting, {
    name: currentUser ? helpers.getUserLabel(currentUser) : "",
  })

  $: introText = processStringSync(portalLabels.intro, {
    company: $organisation.company || "Budibase",
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
                {menuLabels.profile}
              </MenuItem>
              <MenuItem
                icon="lock"
                on:click={() => {
                  if (isOwner) {
                    window.location.href = accountPortalAccountUrl(
                      $admin.accountPortalUrl
                    )
                  } else {
                    changePasswordModal.show()
                  }
                }}
              >
                {menuLabels.password}
              </MenuItem>
              {#if sdk.users.hasBuilderPermissions($auth.user)}
                <MenuItem icon="user-gear" on:click={() => $goto("/builder")}>
                  {menuLabels.portal}
                </MenuItem>
              {/if}
              <MenuItem icon="sign-out" on:click={logout}
                >{menuLabels.logout}</MenuItem
              >
            </ActionMenu>
          </div>
          <Layout noPadding gap="XS">
            <Heading size="M">{greetingText}</Heading>
            <Body>{introText}</Body>
          </Layout>
          <Divider />
          {#if $licensing.errUserLimit}
            <div>
              <Layout gap="S" justifyItems="center">
                <img class="spaceman" alt="spaceman" src={Spaceman} />
                <Heading size="M">{portalLabels.offlineHeading}</Heading>
                {portalLabels.offlineDescription}
              </Layout>
            </div>
          {:else}
            {#if userApps.length}
              <Heading>{portalLabels.appsHeading}</Heading>
              <div class="group">
                <Layout gap="S" noPadding>
                  {#each userApps as app (app.appId)}
                    <a
                      class="app"
                      target="_blank"
                      rel="noreferrer"
                      href={getUrl(app)}
                    >
                      <div
                        class="preview"
                        use:gradient={{ seed: app.name }}
                      ></div>
                      <div class="app-info">
                        <Heading size="XS">{app.name}</Heading>
                        <Body size="S">
                          {#if app.updatedAt}
                            {processStringSync(portalLabels.updatedAgo, {
                              time:
                                new Date().getTime() -
                                new Date(app.updatedAt).getTime(),
                            })}
                          {:else}
                            {portalLabels.neverUpdated}
                          {/if}
                        </Body>
                      </div>
                      <Icon name="caret-right" />
                    </a>
                  {/each}
                </Layout>
              </div>
            {/if}
            {#if userApps.length || !chatAppsLoaded || liveChatApps.length}
              <Heading size="S">Chat</Heading>
              <div class="group">
                <Layout gap="S" noPadding>
                  {#if !chatAppsLoaded}
                    <Body size="S">Loading chat apps...</Body>
                  {:else if liveChatApps.length}
                    {#each liveChatApps as chatApp (chatApp.chatAppId)}
                      <a
                        class="app"
                        target="_blank"
                        rel="noreferrer"
                        href={`/app-chat${chatApp.url}`}
                      >
                        <div
                          class="preview"
                          use:gradient={{ seed: chatApp.name }}
                        ></div>
                        <div class="app-info">
                          <Heading size="XS">{chatApp.name}</Heading>
                          <Body size="S">
                            {#if chatApp.updatedAt}
                              {processStringSync(portalLabels.updatedAgo, {
                                time:
                                  new Date().getTime() -
                                  new Date(chatApp.updatedAt).getTime(),
                              })}
                            {:else}
                              {portalLabels.neverUpdated}
                            {/if}
                          </Body>
                        </div>
                        <div class="icon-muted">
                          <Icon name="caret-right" />
                        </div>
                      </a>
                    {/each}
                  {:else}
                    <Body size="S">No live chat apps yet.</Body>
                  {/if}
                </Layout>
              </div>
            {/if}
            {#if !userApps.length && chatAppsLoaded && !liveChatApps.length}
              <Layout gap="XS" noPadding>
                <Heading size="S">{portalLabels.noAppsHeading}</Heading>
                <Body size="S">{portalLabels.noAppsDescription}</Body>
              </Layout>
            {/if}
          {/if}
        </Layout>
      </div>
    </Page>
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
      passwordMinLength={$admin.passwordMinLength}
      on:save={() => auth.getSelf()}
      labels={passwordLabels}
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
  .app.static {
    cursor: default;
  }
  .app.static:hover {
    background: var(--background);
  }
  .app .icon-muted {
    color: var(--spectrum-global-color-gray-500);
  }
  .preview {
    height: 40px;
    width: 60px;
    border-radius: var(--border-radius-s);
  }
</style>
