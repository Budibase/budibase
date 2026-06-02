<script lang="ts">
  import { Body, Table } from "@budibase/bbui"
  import { selectedAgent } from "@/stores/portal"

  let currentAgent = $derived($selectedAgent)

  const requests = [
    {
      title: "New MacBook for new starter (Marketing)",
      subtitle: "Device provisioning • Joe Johnston • 2m",
      status: "Processing",
      tone: "blue",
    },
    {
      title: "VR headset for design team",
      subtitle: "Device provisioning • Sara Lee • 5m",
      status: "Processing",
      tone: "blue",
    },
    {
      title: "Access request to product database",
      subtitle: "Access request • Mark Taylor • 10m",
      status: "Needs input",
      tone: "amber",
    },
    {
      title: "Printer for administrative office",
      subtitle: "Device provisioning • Jim Taylor • 13m",
      status: "Completed",
      tone: "green",
    },
    {
      title: "Wireless router for office",
      subtitle: "Device provisioning • Lisa Taylor • 18m",
      status: "Completed",
      tone: "green",
    },
    {
      title: "Cannot connect to VPN from home network",
      subtitle: "IT assistant • Mel Taylor • 19m",
      status: "Completed",
      tone: "green",
    },
  ]
</script>

<div class="overview">
  <div class="top-row">
    <div class="card agent-card">
      <Body size="S" color="#efefef" weight="600">
        {currentAgent?.name || "IT assistant"}
      </Body>
      <div class="meta">
        <div><span>AI Model:</span> Budibase AI</div>
        <div><span>Channel:</span> Slack</div>
        <div><span>Operations:</span> 3</div>
      </div>
    </div>
    <div class="card metric-card">
      <Body size="S" color="#a2a2a2">Requests handled</Body>
      <div class="metric">3422</div>
    </div>
    <div class="card metric-card">
      <Body size="S" color="#a2a2a2">Hours saved</Body>
      <div class="metric">2324</div>
    </div>
  </div>

  <div class="card requests-card">
    <div class="requests-header">
      <Body size="S" color="#efefef" weight="600">Recent requests</Body>
      <button class="view-all">View all Requests</button>
    </div>
    <Table
      compact
      quiet
      hideHeader
      allowClickRows={false}
      allowEditRows={false}
      allowEditColumns={false}
      allowSelectRows={false}
      data={requests}
      schema={{
        title: { displayName: "Request", width: "minmax(0, 1.7fr)" },
        subtitle: { displayName: "Details", width: "minmax(0, 1.3fr)" },
        status: {
          displayName: "Status",
          width: "110px",
          align: "Right",
          preventSelectRow: true,
        },
      }}
    />
  </div>
</div>

<style>
  .overview {
    width: min(1200px, calc(100vw - 40px));
    margin: 0 auto;
    padding: 32px 0 48px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    color: #efefef;
  }

  .top-row {
    display: flex;
    gap: 16px;
    align-items: stretch;
  }

  .card {
    background: var(--background-alt);
    border-radius: 4px;
  }

  .agent-card {
    width: 600px;
    padding: var(--spacing-m) var(--spacing-l);
  }

  .meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 6px;
    color: var(--spectrum-global-color-gray-900);
    font-size: 14px;
  }

  .meta span {
    display: inline-block;
    width: 80px;
    color: var(--spectrum-global-color-gray-600);
    font-size: 13px;
  }

  .metric-card {
    flex: 1;
    padding: var(--spacing-m) var(--spacing-l);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
  }

  .metric {
    font-size: 26px;
    color: var(--spectrum-global-color-gray-900);
    line-height: 1;
  }

  .requests-card {
    padding: var(--spacing-l);
  }

  .requests-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .view-all {
    border: 0;
    background: transparent;
    color: var(--spectrum-global-color-gray-600);
    font-size: 13px;
    font-weight: 600;
    padding: 4px 12px;
  }

  .requests-card :global(.spectrum-Table) {
    background: transparent;
  }

  .requests-card :global(.spectrum-Table-cell) {
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    border-left: 0;
    border-right: 0;
    color: var(--spectrum-global-color-gray-900);
  }

  .requests-card :global(.spectrum-Table-row:first-child .spectrum-Table-cell) {
    border-top: 0;
  }

  .requests-card :global(.spectrum-Table-cell:last-child) {
    text-align: right;
    white-space: nowrap;
  }
</style>
