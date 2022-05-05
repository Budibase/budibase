<script>
  import DashCard from "../../../../../components/common/DashCard.svelte"
  import { AppStatus } from "constants"
  import { Icon, Heading, Link, Avatar } from "@budibase/bbui"
  import { store } from "builderStore"
  import clientPackage from "@budibase/client/package.json"
  import { processStringSync } from "@budibase/string-templates"

  export let app
  export let deployments
  export let navigateTab

  $: updateAvailable = clientPackage.version !== $store.version
  $: isPublished = app.status === AppStatus.DEPLOYED
</script>

<div class="overview-tab">
  <div class="top">
    <DashCard title={"App Status"}>
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

        <p class="status-text">
          {#if deployments?.length}
            {processStringSync(
              "Last published {{ duration time 'millisecond' }} ago",
              {
                time:
                  new Date().getTime() -
                  new Date(deployments[0].updatedAt).getTime(),
              }
            )}
          {/if}
          {#if !deployments?.length}
            -
          {/if}
        </p>
      </div>
    </DashCard>
    <DashCard title={"Last Edited"}>
      {app.updatedAt}
      <div class="last-edited-content">
        <!-- Where is this information sourced? auditLog > Placeholder,  metadata -->
        <div class="updated-by">
          <!-- Add a link to the user? new window? -->
          <Avatar size="M" initials={app.updatedBy.initials} />
          <div>{app.updatedBy.firstName}</div>
        </div>
        <p class="last-edit-text">
          {#if app}
            {processStringSync(
              "Last edited {{ duration time 'millisecond' }} ago",
              {
                time: new Date().getTime() - new Date(app?.updatedAt).getTime(),
              }
            )}
          {/if}
        </p>
      </div>
    </DashCard>
    <DashCard
      title={"App Version"}
      showIcon={true}
      action={() => {
        navigateTab("App Version")
      }}
    >
      <div class="version-content">
        <Heading size="XS">{app?.version}</Heading>
        {#if updateAvailable}
          <p>
            New version <strong>{clientPackage.version}</strong> is available -
            <Link
              on:click={() => {
                if (typeof navigateTab === "function") {
                  navigateTab("App Version")
                }
              }}
            >
              Update
            </Link>
          </p>
        {:else}
          <p>You're running the latest!</p>
        {/if}
      </div>
    </DashCard>
  </div>
  <div class="bottom">
    <DashCard
      title={"Automation History"}
      action={() => {
        navigateTab("Automation History")
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
    <DashCard title={"Backups"}>
      <div class="backups-content">test</div>
    </DashCard>
  </div>
</div>

<style>
  /* Add in size checks */
  .overview-tab {
    display: grid;
    grid-gap: var(--spacing-xl);
  }
  .overview-tab .top {
    display: grid;
    grid-gap: var(--spacing-xl);
    grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  }
  .overview-tab .bottom,
  .automation-metrics {
    display: grid;
    grid-gap: var(--spacing-xl);
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
</style>
