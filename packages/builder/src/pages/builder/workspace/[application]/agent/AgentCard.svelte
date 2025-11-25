<script lang="ts">
  import FavouriteResourceButton from "@/pages/builder/_components/FavouriteResourceButton.svelte"
  import PublishStatusBadge from "@/components/common/PublishStatusBadge.svelte"
  import { Body, Icon, TooltipPosition } from "@budibase/bbui"
  import type { Agent, WorkspaceFavourite, User } from "@budibase/types"
  import { PublishResourceState } from "@budibase/types"
  import { url } from "@roxi/routify"
  import { users } from "@/stores/portal/users"
  import { helpers } from "@budibase/shared-core"

  export let agent: Agent
  export let index: number
  export let isHighlighted: boolean = false
  export let favourite: WorkspaceFavourite
  export let onContextMenu: (_e: MouseEvent, _agent: Agent) => void

  let userName = "Created by Budibase"

  $: iconName = getAgentIcon(agent)
  $: iconColor = getAgentIconColor(agent, index)
  $: loadUserName(agent?.createdBy)

  const getAgentIcon = (agent: Agent) => {
    return agent.icon || "SideKick"
  }

  const getAgentIconColor = (agent: Agent, index: number) => {
    if (agent.iconColor) {
      return agent.iconColor
    }
    const colors = [
      "#6366F1", // purple
      "#F59E0B", // orange
      "#10B981", // green
      "#8B5CF6", // purple
      "#EF4444", // red
    ]
    return colors[index % colors.length]
  }

  async function loadUserName(createdBy: string | undefined) {
    if (!createdBy) {
      userName = "Created by Budibase"
      return
    }

    try {
      const user = await users.get(createdBy)
      userName = helpers.getUserLabel(user as User)
    } catch {
      userName = "Created by Budibase"
    }
  }
</script>

<a
  class="agent-card"
  style={`--agent-accent:${iconColor};`}
  href={$url(`./${agent._id}/config`)}
  on:contextmenu={e => onContextMenu(e, agent)}
  class:active={isHighlighted}
>
  <div class="card-actions">
    <div class="ctx-btn">
      <Icon
        name="dots-three"
        size="M"
        hoverable
        on:click={e => onContextMenu(e, agent)}
      />
    </div>
    <FavouriteResourceButton
      {favourite}
      position={TooltipPosition.Left}
      noWrap
    />
  </div>
  <div class="card-body">
    <div class="card-icon">
      <Icon name={iconName} size="XL" color={iconColor} />
    </div>
    <div class="card-content">
      <div class="card-name">
        <Body weight="500" size="S">{agent.name}</Body>
      </div>
      <div class="card-creator">
        <Body size="XS">{userName}</Body>
      </div>
    </div>
    <div class="card-status">
      <PublishStatusBadge
        status={agent.live
          ? PublishResourceState.PUBLISHED
          : PublishResourceState.DISABLED}
      />
    </div>
  </div>
</a>

<style>
  .agent-card {
    background: var(--spectrum-alias-background-color-primary);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-l);
    padding: var(--spacing-m);
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: var(--text-color);
    transition:
      transform 130ms ease-out,
      box-shadow 130ms ease-out,
      border-color 130ms ease-out,
      background-color 130ms ease-out;
    position: relative;
    min-height: 140px;
  }

  .agent-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    background-color: rgba(255, 255, 255, 0.01);
  }

  .agent-card.active {
    box-shadow: 0 0 0 1px;
  }

  .card-actions {
    position: absolute;
    top: var(--spacing-m);
    right: var(--spacing-m);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    opacity: 0;
    transition: opacity 130ms ease-out;
  }

  .agent-card:hover .card-actions {
    opacity: 1;
  }

  .ctx-btn {
    display: flex;
    align-items: center;
  }

  .card-body {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    flex: 1;
  }

  .card-icon {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--agent-accent) 18%, transparent);
  }

  .card-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    flex: 1;
  }

  .card-name {
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .card-creator {
    color: var(--spectrum-global-color-gray-600);
  }

  .card-status {
    display: flex;
    align-items: center;
    margin-top: auto;
  }
</style>
