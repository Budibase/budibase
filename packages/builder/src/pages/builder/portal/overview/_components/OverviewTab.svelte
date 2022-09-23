<script>
  import DashCard from "components/common/DashCard.svelte"
  import { AppStatus } from "constants"
  import { Icon, Heading, Link, Avatar, Layout, Body } from "@budibase/bbui"
  import { store } from "builderStore"
  import clientPackage from "@budibase/client/package.json"
  import { processStringSync } from "@budibase/string-templates"
  import { users, auth, apps, groups } from "stores/portal"
  import { createEventDispatcher } from "svelte"
  import { fetchData } from "@budibase/frontend-core"
  import { API } from "api"
  import GroupIcon from "../../manage/groups/_components/GroupIcon.svelte"

  export let app
  export let deployments
  export let navigateTab

  const dispatch = createEventDispatcher()
  const appUsersFetch = fetchData({
    API,
    datasource: {
      type: "user",
    },
    options: {
      query: {
        appId: apps.getProdAppID(app.devId),
      },
    },
  })

  let appEditor

  $: updateAvailable = clientPackage.version !== $store.version
  $: isPublished = app?.status === AppStatus.DEPLOYED
  $: appEditorId = !app?.updatedBy ? $auth.user._id : app?.updatedBy
  $: appEditorText = appEditor?.firstName || appEditor?.email
  $: fetchAppEditor(appEditorId)
  $: appUsers = $appUsersFetch.rows || []
  $: appUsersFetch.update({
    query: {
      appId: apps.getProdAppID(app.devId),
    },
  })
  $: prodAppId = apps.getProdAppID(app.devId)
  $: appGroups = $groups.filter(group => {
    if (!group.roles) {
      return false
    }
    return groups.actions.getGroupAppIds(group).includes(prodAppId)
  })

  const unpublishApp = () => {
    dispatch("unpublish", app)
  }

  async function fetchAppEditor(editorId) {
    appEditor = await users.get(editorId)
  }

  const getInitials = user => {
    let initials = ""
    initials += user.firstName ? user.firstName[0] : ""
    initials += user.lastName ? user.lastName[0] : ""

    return initials === "" ? user.email[0] : initials
  }
</script>

<div class="overview-tab">
  <Layout paddingX="XXL" paddingY="XXL" gap="XL">
    <div class="top">
      <DashCard title={"App Status"} dataCy={"app-status"}>
        <div class="status-content">
          <div class="status-display">
            {#if isPublished}
              <Icon name="GlobeCheck" size="XL" disabled={false} />
              <span>Published</span>
            {:else}
              <Icon name="GlobeStrike" size="XL" disabled={true} />
              <span class="disabled"> Unpublished </span>
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
                - <Link on:click={unpublishApp}>Unpublish</Link>
              {/if}
            {/if}
            {#if !deployments?.length}
              -
            {/if}
          </div>
        </div>
      </DashCard>
      {#if appEditor}
        <DashCard title={"Last Edited"} dataCy={"edited-by"}>
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
        title={"App Version"}
        showIcon={true}
        action={() => {
          navigateTab("Settings")
        }}
        dataCy={"app-version"}
      >
        <div class="version-content" data-cy={$store.version}>
          <Heading size="XS">{$store.version}</Heading>
          {#if updateAvailable}
            <div class="version-status">
              New version <strong>{clientPackage.version}</strong> is available
              -
              <Link
                on:click={() => {
                  if (typeof navigateTab === "function") {
                    navigateTab("Settings")
                  }
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
            navigateTab("Access")
          }}
          dataCy={"access"}
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
            navigateTab("Automation History")
          }}
          dataCy={"automation-history"}
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
            navigateTab("Backups")
          }}
          dataCy={"backups"}
        >
          <div class="backups-content">test</div>
        </DashCard>
      </div>
    {/if}
  </Layout>
</div>

<style>
  .overview-tab {
    display: grid;
  }

  .overview-tab .top {
    display: grid;
    grid-gap: var(--spectrum-alias-grid-gutter-medium);
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
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
