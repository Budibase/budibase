<script>
  import { onMount } from "svelte"
  import DashCard from "components/common/DashCard.svelte"
  import { AppStatus } from "constants"
  import { goto } from "@roxi/routify"
  import {
    Icon,
    Heading,
    Link,
    Avatar,
    Layout,
    Body,
    notifications,
  } from "@budibase/bbui"
  import { store } from "builderStore"
  import clientPackage from "@budibase/client/package.json"
  import { processStringSync } from "@budibase/string-templates"
  import { users, auth, apps, groups, overview } from "stores/portal"
  import { fetchData } from "@budibase/frontend-core"
  import { API } from "api"
  import GroupIcon from "../../users/groups/_components/GroupIcon.svelte"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { checkIncomingDeploymentStatus } from "components/deploy/utils"

  import { _ } from "../../../../../../lang/i18n"

  let appEditor
  let unpublishModal
  let deployments

  $: app = $overview.selectedApp
  $: devAppId = app.devId
  $: prodAppId = apps.getProdAppID(devAppId)
  $: appUsersFetch = fetchData({
    API,
    datasource: {
      type: "user",
    },
    options: {
      query: {
        appId: apps.getProdAppID(devAppId),
      },
    },
  })
  $: updateAvailable = clientPackage.version !== $store.version
  $: isPublished = app?.status === AppStatus.DEPLOYED
  $: appEditorId = !app?.updatedBy ? $auth.user._id : app?.updatedBy
  $: appEditorText = appEditor?.firstName || appEditor?.email
  $: fetchAppEditor(appEditorId)
  $: appUsers = $appUsersFetch.rows || []
  $: appGroups = $groups.filter(group => {
    if (!group.roles) {
      return false
    }
    return groups.actions.getGroupAppIds(group).includes(prodAppId)
  })

  async function fetchAppEditor(editorId) {
    appEditor = await users.get(editorId)
  }

  const getInitials = user => {
    let initials = ""
    initials += user.firstName ? user.firstName[0] : ""
    initials += user.lastName ? user.lastName[0] : ""

    return initials === "" ? user.email[0] : initials
  }

  const confirmUnpublishApp = async () => {
    try {
      await API.unpublishApp(app.prodId)
      await apps.load()
      notifications.success(
        $_("pages.builder.portal.overview.appId.overview.App_unpublished")
      )
    } catch (err) {
      notifications.error(
        $_("pages.builder.portal.overview.appId.overview.Error_unpublishing")
      )
    }
  }

  const reviewPendingDeployments = (deployments, newDeployments) => {
    if (deployments?.length > 0) {
      const pending = checkIncomingDeploymentStatus(deployments, newDeployments)
      if (pending.length) {
        notifications.warning(
          $_("pages.builder.portal.overview.appId.overview.Deployment_shortly")
        )
      }
    }
  }
  async function fetchDeployments() {
    try {
      const newDeployments = await API.getAppDeployments()
      reviewPendingDeployments(deployments, newDeployments)
      return newDeployments
    } catch (err) {
      console.log(err)
      notifications.error(
        $_("pages.builder.portal.overview.appId.overview.Error_fetching")
      )
    }
  }

  onMount(async () => {
    deployments = await fetchDeployments()
  })
</script>

<div class="overview-tab">
  <Layout noPadding gap="XL">
    <div class="top">
      <DashCard
        title={$_("pages.builder.portal.overview.appId.overview.App_Status")}
      >
        <div class="status-content">
          <div class="status-display">
            {#if isPublished}
              <Icon name="GlobeCheck" size="XL" disabled={false} />
              <span
                >{$_(
                  "pages.builder.portal.overview.appId.overview.Published"
                )}</span
              >
            {:else}
              <Icon name="GlobeStrike" size="XL" disabled={true} />
              <span class="disabled"
                >{$_(
                  "pages.builder.portal.overview.appId.overview.Unpublished"
                )}</span
              >
            {/if}
          </div>

          <div class="status-text">
            {#if deployments?.length}
              {processStringSync(
                `${$_(
                  "pages.builder.portal.overview.appId.overview.Last_published"
                )} {{ duration time 'millisecond' }} ${$_(
                  "pages.builder.portal.overview.appId.overview.ago"
                )}`,
                {
                  time:
                    new Date().getTime() -
                    new Date(deployments[0].updatedAt).getTime(),
                }
              )}
              {#if isPublished}
                - <Link on:click={unpublishModal.show}
                  >{$_(
                    "pages.builder.portal.overview.appId.overview.Unpublish"
                  )}</Link
                >
              {/if}
            {/if}
            {#if !deployments?.length}
              -
            {/if}
          </div>
        </div>
      </DashCard>
      {#if appEditor}
        <DashCard title={"Last Edited"}>
          <div class="last-edited-content">
            <div class="updated-by">
              {#if appEditor}
                <Avatar size="M" initials={getInitials(appEditor)} />
                <div class="editor-name">
                  {appEditor._id === $auth.user._id
                    ? $_("pages.builder.portal.overview.appId.overview.You")
                    : appEditorText}
                </div>
              {/if}
            </div>
            <div class="last-edit-text">
              {#if app}
                {processStringSync(
                  `${$_(
                    "pages.builder.portal.overview.appId.overview.Last_Edited"
                  )} {{ duration time 'millisecond' }} ${$_(
                    "pages.builder.portal.overview.appId.overview.ago"
                  )}`,
                  {
                    time:
                      new Date().getTime() - new Date(app?.updatedAt).getTime(),
                  }
                )}
              {/if}
            </div>
          </div>
        </DashCard>
      {/if}
      <DashCard
        title={$_("pages.builder.portal.overview.appId.overview.Version")}
        showIcon={true}
        action={() => {
          $goto("./version")
        }}
      >
        <div class="version-content">
          <Heading size="XS">{$store.version}</Heading>
          {#if updateAvailable}
            <div class="version-status">
              {$_("pages.builder.portal.overview.appId.overview.New_version")}
              <strong>{clientPackage.version}</strong>
              {$_("pages.builder.portal.overview.appId.overview.is_available")}
              -
              <Link
                on:click={() => {
                  $goto("./version")
                }}
              >
                {$_("pages.builder.portal.overview.appId.overview.Update")}
              </Link>
            </div>
          {:else}
            <div class="version-status">
              {$_("pages.builder.portal.overview.appId.overview.latest")}
            </div>
          {/if}
        </div>
      </DashCard>
      {#if $appUsersFetch.loaded}
        <DashCard
          title={$_("pages.builder.portal.overview.appId.overview.Access")}
          showIcon={true}
          action={() => {
            $goto("./access")
          }}
        >
          {#if appUsers.length || appGroups.length}
            <Layout noPadding gap="S">
              <div class="access-tab-content">
                {#if appUsers.length}
                  <div class="users">
                    <div class="list">
                      {#each appUsers.slice(0, 4) as user}
                        <Avatar size="M" initials={getInitials(user)} />
                      {/each}
                    </div>
                    <div class="text">
                      {appUsers.length}
                      {appUsers.length > 1
                        ? $_(
                            "pages.builder.portal.overview.appId.overview.users"
                          )
                        : $_(
                            "pages.builder.portal.overview.appId.overview.user"
                          )}
                      {$_(
                        "pages.builder.portal.overview.appId.overview.assigned"
                      )}
                    </div>
                  </div>
                {/if}
                {#if appGroups.length}
                  <div class="groups">
                    <div class="list">
                      {#each appGroups.slice(0, 4) as group}
                        <GroupIcon {group} />
                      {/each}
                    </div>
                    <div class="text">
                      {appGroups.length}
                      {$_("pages.builder.portal.overview.appId.overview.user")}
                      {appGroups.length > 1
                        ? $_(
                            "pages.builder.portal.overview.appId.overview.groups"
                          )
                        : $_(
                            "pages.builder.portal.overview.appId.overview.group"
                          )}
                      {$_(
                        "pages.builder.portal.overview.appId.overview.assigned"
                      )}
                    </div>
                  </div>
                {/if}
              </div>
            </Layout>
          {:else}
            <Layout noPadding gap="S">
              <Body
                >{$_(
                  "pages.builder.portal.overview.appId.overview.No_users"
                )}</Body
              >
              <div class="users-text">
                {$_(
                  "pages.builder.portal.overview.appId.overview.No_users_app"
                )}
              </div>
            </Layout>
          {/if}
        </DashCard>
      {/if}
    </div>
    {#if false}
      <div class="bottom">
        <DashCard
          title={$_(
            "pages.builder.portal.overview.appId.overview.Automation_History"
          )}
          action={() => {
            $goto("../automation-history")
          }}
        >
          <div class="automation-content">
            <div class="automation-metrics">
              <div class="succeeded">
                <Heading size="XL">0</Heading>
                <div class="metric-info">
                  <Icon name="CheckmarkCircle" />
                  {$_("pages.builder.portal.overview.appId.overview.Success")}
                </div>
              </div>
              <div class="failed">
                <Heading size="XL">0</Heading>
                <div class="metric-info">
                  <Icon name="Alert" />
                  {$_("pages.builder.portal.overview.appId.overview.Error")}
                </div>
              </div>
            </div>
          </div>
        </DashCard>
        <DashCard
          title={$_("pages.builder.portal.overview.appId.overview.Backups")}
          action={() => {
            $goto("../backups")
          }}
        >
          <div class="backups-content">
            {$_("pages.builder.portal.overview.appId.overview.test")}
          </div>
        </DashCard>
      </div>
    {/if}
  </Layout>
</div>

<ConfirmDialog
  bind:this={unpublishModal}
  title={$_("pages.builder.portal.overview.appId.overview.Confirm_unpublish")}
  okText={$_("pages.builder.portal.overview.appId.overview.Unpublish_app")}
  onOk={confirmUnpublishApp}
>
  {$_("pages.builder.portal.overview.appId.overview.unpublish_app")}
  <b>{app?.name}</b>?
</ConfirmDialog>

<style>
  .overview-tab {
    display: grid;
  }

  .overview-tab .top {
    display: grid;
    grid-gap: var(--spectrum-alias-grid-gutter-medium);
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  .access-tab-content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
  }
  .access-tab-content > * {
    flex: 1 1 0;
  }
  .access-tab-content .list {
    display: flex;
    gap: 4px;
  }
  .access-tab-content .text {
    color: var(--spectrum-global-color-gray-600);
    margin-top: var(--spacing-xl);
  }

  .overview-tab .bottom,
  .automation-metrics {
    display: grid;
    grid-gap: var(--spectrum-alias-grid-gutter-large);
    grid-template-columns: 1fr 1fr;
  }

  .status-display {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .status-text,
  .last-edit-text {
    color: var(--spectrum-global-color-gray-600);
  }

  .updated-by {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .succeeded :global(.icon) {
    color: var(--spectrum-global-color-green-600);
  }

  .failed :global(.icon) {
    color: var(
      --spectrum-semantic-negative-color-default,
      var(--spectrum-global-color-red-500)
    );
  }

  .metric-info {
    display: flex;
    gap: var(--spacing-l);
    margin-top: var(--spacing-s);
  }

  .version-status,
  .last-edit-text,
  .status-text {
    padding-top: var(--spacing-xl);
  }
</style>
