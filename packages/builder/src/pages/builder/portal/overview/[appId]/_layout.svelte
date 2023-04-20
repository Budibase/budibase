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

  import { _ } from "../../../../../../lang/i18n"

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
      notifications.error(
        $_("pages.builder.portal.overview.appId._layout.Error_initialising")
      )
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
        `${$_(
          "pages.builder.portal.overview.appId._layout.App_locked"
        )} ${identifier}. ${$_(
          "pages.builder.portal.overview.appId._layout.allow"
        )}`
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
    notifications.success(
      $_("pages.builder.portal.overview.appId._layout.ID_copied")
    )
  }

  const deleteApp = async () => {
    try {
      await API.deleteApp(app?.devId)
      apps.load()
      notifications.success(
        $_("pages.builder.portal.overview.appId._layout.App_deleted")
      )
      $goto("../../")
    } catch (err) {
      notifications.error(
        $_("pages.builder.portal.overview.appId._layout.Error_deleting")
      )
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
        <Breadcrumb
          url={$url("../")}
          text={$_("pages.builder.portal.overview.appId._layout.Apps")}
        />
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
              {$_("pages.builder.portal.overview.appId._layout.View")}
            </Button>
          </span>
          <span class="desktop">
            <Button
              size="M"
              cta
              disabled={appLocked && !lockedByYou}
              on:click={editApp}
            >
              {$_("pages.builder.portal.overview.appId._layout.Edit")}
            </Button>
          </span>
          <ActionMenu align="right">
            <span slot="control" class="app-overview-actions-icon">
              <Icon hoverable name="More" />
            </span>
            <span class="mobile">
              <MenuItem icon="Globe" disabled={!isPublished} on:click={viewApp}>
                {$_("pages.builder.portal.overview.appId._layout.View")}
              </MenuItem>
            </span>
            <span class="mobile">
              <MenuItem
                icon="Edit"
                disabled={appLocked && !lockedByYou}
                on:click={editApp}
              >
                {$_("pages.builder.portal.overview.appId._layout.Edit")}
              </MenuItem>
            </span>
            <MenuItem
              on:click={() => exportApp({ published: false })}
              icon="DownloadFromCloud"
            >
              {$_("pages.builder.portal.overview.appId._layout.Export_latest")}
            </MenuItem>
            {#if isPublished}
              <MenuItem
                on:click={() => exportApp({ published: true })}
                icon="DownloadFromCloudOutline"
              >
                {$_(
                  "pages.builder.portal.overview.appId._layout.Export_published"
                )}
              </MenuItem>
              <MenuItem on:click={copyAppId} icon="Copy"
                >{$_(
                  "pages.builder.portal.overview.appId._layout.Copy_ID"
                )}</MenuItem
              >
            {/if}
            {#if !isPublished}
              <MenuItem on:click={deletionModal.show} icon="Delete">
                {$_("pages.builder.portal.overview.appId._layout.Delete")}
              </MenuItem>
            {/if}
          </ActionMenu>
        </div>
      </Header>
      <Content showMobileNav>
        <SideNav slot="side-nav">
          <SideNavItem
            text={$_("pages.builder.portal.overview.appId._layout.Overview")}
            url={$url("./overview")}
            active={$isActive("./overview")}
          />
          <SideNavItem
            text={$_("pages.builder.portal.overview.appId._layout.Access")}
            url={$url("./access")}
            active={$isActive("./access")}
          />
          <SideNavItem
            text={$_(
              "pages.builder.portal.overview.appId._layout.Automation_History"
            )}
            url={$url("./automation-history")}
            active={$isActive("./automation-history")}
          />
          <SideNavItem
            text={$_("pages.builder.portal.overview.appId._layout.Backups")}
            url={$url("./backups")}
            active={$isActive("./backups")}
          />
          <SideNavItem
            text={$_("pages.builder.portal.overview.appId._layout.Name_URL")}
            url={$url("./name-and-url")}
            active={$isActive("./name-and-url")}
          />
          <SideNavItem
            text={$_("pages.builder.portal.overview.appId._layout.Version")}
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
    title={$_("pages.builder.portal.overview.appId._layout.Delete_app")}
    okText={$_("pages.builder.portal.overview.appId._layout.Delete")}
    onOk={deleteApp}
    onCancel={() => (deletionConfirmationAppName = null)}
    disabled={deletionConfirmationAppName !== app?.name}
  >
    {$_("pages.builder.portal.overview.appId._layout.want_delete")}
    <b>{app?.name}</b>?
    <br />
    {$_("pages.builder.portal.overview.appId._layout.app_name")}
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
