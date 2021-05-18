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
    notifications,
    Body,
  } from "@budibase/bbui"
  import api, { del } from "builderStore/api"
  import analytics from "analytics"
  import { onMount } from "svelte"
  import { apps, organisation } from "stores/portal"
  import { auth } from "stores/backend"
  import download from "downloadjs"
  import { goto } from "@roxi/routify"
  import { AppStatus } from "constants"
  import { gradient } from "actions"

  let layout = "grid"
  let template
  let appToDelete
  let creationModal
  let deletionModal
  let creatingApp = false
  let loaded = false

  const checkKeys = async () => {
    const response = await api.get(`/api/keys/`)
    const keys = await response.json()
    if (keys.userId) {
      analytics.identify(keys.userId)
    }
  }

  const initiateAppCreation = () => {
    creationModal.show()
    creatingApp = true
  }

  const initiateAppImport = () => {
    template = { fromFile: true }
    creationModal.show()
    creatingApp = true
  }

  const stopAppCreation = () => {
    template = null
    creatingApp = false
  }

  const openApp = app => {
    $goto(`../../app/${app._id}`)
  }

  const exportApp = app => {
    try {
      download(
        `/api/backups/export?appId=${app._id}&appname=${encodeURIComponent(
          app.name
        )}`
      )
      notifications.success("App export complete")
    } catch (err) {
      console.error(err)
      notifications.error("App export failed")
    }
  }

  const deleteApp = app => {
    appToDelete = app
    deletionModal.show()
  }

  const confirmDeleteApp = async () => {
    if (!appToDelete) {
      return
    }
    await del(`/api/applications/${appToDelete?._id}`)
    await apps.load()
    appToDelete = null
  }

  onMount(async () => {
    checkKeys()
    await apps.load(AppStatus.DEV)
    loaded = true
  })

  $: console.log($auth.user)
</script>

<div class="container">
  <Page>
    <div class="content">
      <Layout noPadding>
        <img src={$organisation.logoUrl} />
        <div class="info-title">
          <Layout noPadding gap="XS">
            <Heading size="L">Hey {$auth.user.email}</Heading>
            <Body noPadding>
              Welcome to the {$organisation.company} portal. Below you'll find the
              list of apps that you have access to, as well as company news and the
              employee handbook.
            </Body>
          </Layout>
          <ActionMenu align="right">
            <div slot="control" class="avatar">
              <Avatar size="M" name="John Doe" />
              <Icon size="XL" name="ChevronDown" />
            </div>
            <MenuItem icon="UserEdit" on:click={auth.logout}>
              Update user information
            </MenuItem>
            <MenuItem icon="LockClosed" on:click={auth.logout}>
              Update password
            </MenuItem>
            <MenuItem icon="UserDeveloper" on:click={() => $goto("../portal")}>
              Open developer mode
            </MenuItem>
            <MenuItem icon="LogOut" on:click={auth.logout}>Log out</MenuItem>
          </ActionMenu>
        </div>
        <Divider />
        <div class="apps-title">
          <Heading>Apps</Heading>
          <Select placeholder="Filter by groups" />
        </div>
        <div class="group">
          <Layout gap="S" noPadding>
            <div class="group-title">
              <Body weight="500" noPadding size="XS">GROUP</Body>
              {#if $auth.user?.builder?.global}
                <Icon name="Settings" hoverable />
              {/if}
            </div>
            {#each $apps as app, idx (app.appId)}
              <div class="app" on:click={() => $goto(`../app/${app.appId}`)}>
                <div class="preview" use:gradient={{ seed: app.name }} />
                <div class="app-info">
                  <Heading size="XS">{app.name}</Heading>
                  <Body noPadding size="S">
                    Edited {Math.round(Math.random() * 10 + 1)} months ago
                  </Body>
                </div>
                <Icon name="ChevronRight" />
              </div>
            {/each}
          </Layout>
        </div>
      </Layout>
    </div>
  </Page>
</div>

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
  .apps-title {
    display: grid;
    grid-template-columns: 1fr 150px;
    grid-gap: var(--spacing-xl);
  }
  .group {
    margin-top: 20px;
  }
  .group-title {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: var(--spacing-xl);
    align-items: center;
  }
  .app {
    display: grid;
    grid-template-columns: auto 1fr auto;
    background-color: var(--background);
    padding: var(--spacing-xl);
    border-radius: var(--border-radius-s);
    align-items: center;
    grid-gap: var(--spacing-xl);
  }
  .app:hover {
    cursor: pointer;
    background: var(--spectrum-global-color-gray-200);
    transition: background-color 130ms ease-in-out;
  }
  .preview {
    height: 40px;
    width: 40px;
    border-radius: var(--border-radius-s);
  }
</style>
