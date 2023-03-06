<script>
  import { url, isActive, goto } from "@roxi/routify"
  import {
    Page,
    Layout,
    Button,
    Icon,
    ActionMenu,
    MenuItem,
    Helpers,
    Input,
    Modal,
    notifications,
  } from "@budibase/bbui"
  import {
    Content,
    SideNav,
    SideNavItem,
    Breadcrumbs,
    Breadcrumb,
    Header,
  } from "components/portal/page"
  import { apps, auth, overview } from "stores/portal"
  import { AppStatus } from "constants"
  import analytics, { Events, EventSource } from "analytics"
  import { store } from "builderStore"
  import AppLockModal from "components/common/AppLockModal.svelte"
  import EditableIcon from "components/common/EditableIcon.svelte"
  import { API } from "api"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import ExportAppModal from "components/start/ExportAppModal.svelte"
  import { syncURLToState } from "helpers/urlStateSync"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"

  // Keep URL and state in sync for selected screen ID
  const stopSyncing = syncURLToState({
    urlParam: "appId",
    stateKey: "selectedAppId",
    validate: id => $apps.some(app => app.devId === id),
    fallbackUrl: "../../",
    store: overview,
    routify,
  })

  let exportModal
  let deletionModal
  let exportPublishedVersion = false
  let deletionConfirmationAppName

  $: app = $overview.selectedApp
  $: appId = $overview.selectedAppId
  $: initialiseApp(appId)
  $: isPublished = app?.status === AppStatus.DEPLOYED
  $: appLocked = !!app?.lockedBy
  $: lockedByYou = $auth.user.email === app?.lockedBy?.email

  const initialiseApp = async appId => {
    try {
      const pkg = await API.fetchAppPackage(appId)
      await store.actions.initialise(pkg)
      await API.syncApp(appId)
    } catch (error) {
      notifications.error("Error initialising app overview")
      $goto("../../")
    }
  }

  const viewApp = () => {
    if (isPublished) {
      analytics.captureEvent(Events.APP_VIEW_PUBLISHED, {
        appId: $store.appId,
        eventSource: EventSource.PORTAL,
      })
      window.open(`/app${app?.url}`, "_blank")
    }
  }

  const editApp = () => {
    if (appLocked && !lockedByYou) {
      const identifier = app?.lockedBy?.firstName || app?.lockedBy?.email
      notifications.warning(
        `App locked by ${identifier}. Please allow lock to expire or have them unlock this app.`
      )
      return
    }
    $goto(`../../../app/${app.devId}`)
  }

  const exportApp = opts => {
    exportPublishedVersion = !!opts?.published
    exportModal.show()
  }

  const copyAppId = async () => {
    await Helpers.copyToClipboard(app.prodId)
    notifications.success("App ID copied to clipboard")
  }

  const deleteApp = async () => {
    try {
      await API.deleteApp(app?.devId)
      apps.load()
      notifications.success("App deleted successfully")
      $goto("../../")
    } catch (err) {
      notifications.error("Error deleting app")
    }
  }

  onDestroy(() => {
    stopSyncing()
    store.actions.reset()
  })
</script>

{#key appId}
  <Page>
    <Layout noPadding gap="L">
      <Breadcrumbs>
        <Breadcrumb url={$url("../")} text="Apps" />
        <Breadcrumb text={app?.name} />
      </Breadcrumbs>
      <Header title={app?.name} wrap={false}>
        <div slot="icon">
          <EditableIcon
            {app}
            autoSave
            size="XL"
            name={app?.icon?.name || "Apps"}
            color={app?.icon?.color}
          />
        </div>
        <div slot="buttons">
          <AppLockModal {app} />
          <span class="desktop">
            <Button
              size="M"
              quiet
              secondary
              disabled={!isPublished}
              on:click={viewApp}
            >
              View
            </Button>
          </span>
          <span class="desktop">
            <Button
              size="M"
              cta
              disabled={appLocked && !lockedByYou}
              on:click={editApp}
            >
              Edit
            </Button>
          </span>
          <ActionMenu align="right">
            <span slot="control" class="app-overview-actions-icon">
              <Icon hoverable name="More" />
            </span>
            <span class="mobile">
              <MenuItem icon="Globe" disabled={!isPublished} on:click={viewApp}>
                View
              </MenuItem>
            </span>
            <span class="mobile">
              <MenuItem
                icon="Edit"
                disabled={appLocked && !lockedByYou}
                on:click={editApp}
              >
                Edit
              </MenuItem>
            </span>
            <MenuItem
              on:click={() => exportApp({ published: false })}
              icon="DownloadFromCloud"
            >
              Export latest
            </MenuItem>
            {#if isPublished}
              <MenuItem
                on:click={() => exportApp({ published: true })}
                icon="DownloadFromCloudOutline"
              >
                Export published
              </MenuItem>
              <MenuItem on:click={copyAppId} icon="Copy">Copy app ID</MenuItem>
            {/if}
            {#if !isPublished}
              <MenuItem on:click={deletionModal.show} icon="Delete">
                Delete
              </MenuItem>
            {/if}
          </ActionMenu>
        </div>
      </Header>
      <Content showMobileNav>
        <SideNav slot="side-nav">
          <SideNavItem
            text="Overview"
            url={$url("./overview")}
            active={$isActive("./overview")}
          />
          <SideNavItem
            text="Access"
            url={$url("./access")}
            active={$isActive("./access")}
          />
          <SideNavItem
            text="Automation History"
            url={$url("./automation-history")}
            active={$isActive("./automation-history")}
          />
          <SideNavItem
            text="Backups"
            url={$url("./backups")}
            active={$isActive("./backups")}
          />
          <SideNavItem
            text="Name and URL"
            url={$url("./name-and-url")}
            active={$isActive("./name-and-url")}
          />
          <SideNavItem
            text="Version"
            url={$url("./version")}
            active={$isActive("./version")}
          />
        </SideNav>
        <slot />
      </Content>
    </Layout>
  </Page>

  <Modal bind:this={exportModal} padding={false}>
    <ExportAppModal {app} published={exportPublishedVersion} />
  </Modal>
  <ConfirmDialog
    bind:this={deletionModal}
    title="Delete app"
    okText="Delete"
    onOk={deleteApp}
    onCancel={() => (deletionConfirmationAppName = null)}
    disabled={deletionConfirmationAppName !== app?.name}
  >
    Are you sure you want to delete <b>{app?.name}</b>?
    <br />
    Please enter the app name below to confirm.
    <br /><br />
    <Input bind:value={deletionConfirmationAppName} placeholder={app?.name} />
  </ConfirmDialog>
{/key}

<style>
  .desktop {
    display: contents;
  }
  .mobile {
    display: none;
  }

  @media (max-width: 640px) {
    .desktop {
      display: none;
    }
    .mobile {
      display: contents;
    }
  }
</style>
