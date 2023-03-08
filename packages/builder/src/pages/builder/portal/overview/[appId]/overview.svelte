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
      notifications.success("App unpublished successfully")
    } catch (err) {
      notifications.error("Error unpublishing app")
    }
  }

  const reviewPendingDeployments = (deployments, newDeployments) => {
    if (deployments?.length > 0) {
      const pending = checkIncomingDeploymentStatus(deployments, newDeployments)
      if (pending.length) {
        notifications.warning(
          "Deployment has been queued and will be processed shortly"
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
      notifications.error("Error fetching deployment history")
    }
  }

  onMount(async () => {
    deployments = await fetchDeployments()
  })
</script>

<div class="overview-tab">
  <Layout noPadding gap="XL">
    <div class="top">
      <DashCard title={"App Status"}>
        <div class="status-content">
          <div class="status-display">
            {#if isPublished}
              <Icon name="GlobeCheck" size="XL" disabled={false} />
              <span>Published</span>
            {:else}
              <Icon name="GlobeStrike" size="XL" disabled={true} />
              <span class="disabled">Unpublished</span>
            {/if}
          </div>

          <div class="status-text">
            {#if deployments?.length}
              {processStringSync(
                "Last published {{ duration time 'millisecond' }} ago",
                {
                  time:
                    new Date().getTime() -
                    new Date(deployments[0].updatedAt).getTime(),
                }
              )}
              {#if isPublished}
                - <Link on:click={unpublishModal.show}>Unpublish</Link>
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
                  {appEditor._id === $auth.user._id ? "You" : appEditorText}
                </div>
              {/if}
            </div>
            <div class="last-edit-text">
              {#if app}
                {processStringSync(
                  "Last edited {{ duration time 'millisecond' }} ago",
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
        title={"Version"}
        showIcon={true}
        action={() => {
          $goto("./version")
        }}
      >
        <div class="version-content">
          <Heading size="XS">{$store.version}</Heading>
          {#if updateAvailable}
            <div class="version-status">
              New version <strong>{clientPackage.version}</strong> is available
              -
              <Link
                on:click={() => {
                  $goto("./version")
                }}
              >
                Update
              </Link>
            </div>
          {:else}
            <div class="version-status">You're running the latest!</div>
          {/if}
        </div>
      </DashCard>
      {#if $appUsersFetch.loaded}
        <DashCard
          title={"Access"}
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
                      {appUsers.length > 1 ? "users" : "user"} assigned
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
                      {appGroups.length} user
                      {appGroups.length > 1 ? "groups" : "group"} assigned
                    </div>
                  </div>
                {/if}
              </div>
            </Layout>
          {:else}
            <Layout noPadding gap="S">
              <Body>No users</Body>
              <div class="users-text">
                No users have been assigned to this app
              </div>
            </Layout>
          {/if}
        </DashCard>
      {/if}
    </div>
    {#if false}
      <div class="bottom">
        <DashCard
          title={"Automation History"}
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
                  Success
                </div>
              </div>
              <div class="failed">
                <Heading size="XL">0</Heading>
                <div class="metric-info">
                  <Icon name="Alert" />
                  Error
                </div>
              </div>
            </div>
          </div>
        </DashCard>
        <DashCard
          title={"Backups"}
          action={() => {
            $goto("../backups")
          }}
        >
          <div class="backups-content">test</div>
        </DashCard>
      </div>
    {/if}
  </Layout>
</div>

<ConfirmDialog
  bind:this={unpublishModal}
  title="Confirm unpublish"
  okText="Unpublish app"
  onOk={confirmUnpublishApp}
>
  Are you sure you want to unpublish the app <b>{app?.name}</b>?
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
