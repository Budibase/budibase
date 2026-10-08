<script lang="ts" module>
  import type { ActivityStatus } from "./activityStatus"

  interface StatusDetail {
    type: "status-badge"
    label: string
    status: ActivityStatus
  }

  interface TextDetail {
    type: "text"
    label: string
    value: string | undefined
    prefix?: string
    icon?: string
    iconColor?: string
    highlight?: boolean
    underline?: boolean
  }

  export type ActivityDetail = StatusDetail | TextDetail
</script>

<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import ActivityStatusBadge from "./ActivityStatusBadge.svelte"
  import ActivityOriginLabel from "./ActivityOriginLabel.svelte"

  let { details }: { details: ActivityDetail[] } = $props()

  const getIconColor = (detail: TextDetail) => {
    if (detail.iconColor) {
      return detail.iconColor
    }
    return detail.highlight
      ? "var(--spectrum-global-color-blue-400)"
      : "var(--spectrum-global-color-gray-400)"
  }
</script>

<div class="details-list">
  {#each details as detail}
    <div class="detail-row">
      <div class="detail-label">{detail.label}</div>

      <div class="detail-value">
        {#if detail.type === "status-badge"}
          <ActivityStatusBadge status={detail.status} />
        {:else}
          {#if detail.icon}
            <Icon
              size="S"
              name={detail.icon}
              color={getIconColor(detail)}
              weight={detail.highlight ? "fill" : "regular"}
            />
          {/if}

          <span class="detail-text" class:underlined={detail.underline}>
            {#if detail.prefix}
              <ActivityOriginLabel
                label={detail.value}
                prefix={detail.prefix}
              />
            {:else}
              {detail.value}
            {/if}
          </span>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .details-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .detail-row {
    display: grid;
    grid-template-columns: 160px minmax(0, 1fr);
    align-items: center;
    gap: 16px;
  }

  .detail-label {
    color: var(--spectrum-global-color-gray-600);
    font-size: 15px;
    line-height: 1.35;
  }

  .detail-value {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .detail-text {
    color: var(--spectrum-alias-text-color);
    font-size: 15px;
    line-height: 1.35;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .underlined {
    text-decoration: underline;
    text-underline-offset: 2px;
  }
</style>
