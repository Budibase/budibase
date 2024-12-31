<script>
  import { Body } from "@budibase/bbui"
  import FontAwesomeIcon from "@/components/common/FontAwesomeIcon.svelte"
  import { IntegrationTypes } from "@/constants/backend"

  export let datasource
  const getSubtitle = datasource => {
    if (datasource.source === IntegrationTypes.REST) {
      return datasource.name
    }
    if (
      datasource.source === IntegrationTypes.POSTGRES ||
      datasource.source === IntegrationTypes.MYSQL ||
      datasource.source === IntegrationTypes.ORACLE ||
      datasource.source === IntegrationTypes.REDIS
    ) {
      return `${datasource.config.host}:${datasource.config.port}`
    }
    if (datasource.source === IntegrationTypes.SQL_SERVER) {
      return `${datasource.config.server}:${datasource.config.port}`
    }
    if (datasource.source === IntegrationTypes.SNOWFLAKE) {
      return `${datasource.config.warehouse}:${datasource.config.database}:${datasource.config.schema}`
    }
    if (datasource.source === IntegrationTypes.ARANGODB) {
      return `${datasource.config.url}:${datasource.config.databaseName}`
    }
    if (datasource.source === IntegrationTypes.COUCHDB) {
      return datasource.config.database
    }
    if (datasource.source === IntegrationTypes.DYNAMODB) {
      return `${datasource.config.endpoint}:${datasource.config.region}`
    }
    if (datasource.source === IntegrationTypes.S3) {
      return datasource.config.endpoint
        ? `${datasource.config.endpoint}:${datasource.config.region}`
        : `s3.${datasource.config.region}.amazonaws.com`
    }
    if (datasource.source === IntegrationTypes.ELASTICSEARCH) {
      return datasource.config.url
    }
    if (datasource.source === IntegrationTypes.FIRESTORE) {
      return datasource.config.projectId
    }
    if (datasource.source === IntegrationTypes.MONGODB) {
      return datasource.config.db
    }
    if (datasource.source === IntegrationTypes.AIRTABLE) {
      return datasource.config.base
    }
    if (datasource.source === IntegrationTypes.GOOGLE_SHEETS) {
      return datasource.config.spreadsheetId
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="button" on:click>
  <div class="left">
    {#if datasource.source !== IntegrationTypes.REST}
      <div class="connected">
        <FontAwesomeIcon name="fa-solid fa-circle-check" />
        <Body size="S">Connected</Body>
      </div>
    {/if}
    <div class="truncate">
      <Body>
        {@const subtitle = getSubtitle(datasource)}
        {#if subtitle}
          {subtitle}
        {:else}
          {Object.values(datasource.config).join(" / ")}
        {/if}
      </Body>
    </div>
  </div>
  <div class="right">
    <FontAwesomeIcon name="fa-solid fa-gear" />
  </div>
</div>

<style>
  .button {
    display: flex;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 5px;
    width: 100%;
    background: var(--spectrum-global-color-gray-50);
    color: white;
    overflow: hidden;
    padding: 12px 16px;
    box-sizing: border-box;
    transition: background 130ms ease-out;
  }
  .left {
    flex: 1;
    overflow: hidden;
  }
  .right {
    display: flex;
    align-items: center;
    margin-left: 16px;
  }
  .right :global(svg) {
    color: var(--spectrum-global-color-gray-600);
  }
  .button:hover {
    cursor: pointer;
    background: var(--spectrum-global-color-gray-100);
  }
  .connected {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }
  .connected :global(svg) {
    margin-right: 6px;
    color: #009562;
  }
  .connected :global(p) {
    color: #009562;
  }
  .truncate :global(p) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
