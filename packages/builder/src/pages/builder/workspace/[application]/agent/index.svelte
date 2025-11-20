<script lang="ts">
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import FavouriteResourceButton from "@/pages/builder/_components/FavouriteResourceButton.svelte"
  import { contextMenuStore, workspaceFavouriteStore } from "@/stores/builder"
  import { agentsStore } from "@/stores/portal"
  import {
    ActionButton,
    Body,
    Button,
    Heading,
    Icon,
    type ModalAPI,
    notifications,
    Tabs,
    Tab,
    TooltipPosition,
  } from "@budibase/bbui"
  import type { Agent } from "@budibase/types"
  import { WorkspaceResource } from "@budibase/types"
  import { url } from "@roxi/routify"
  import NoResults from "../_components/NoResults.svelte"
  import AgentModal from "./AgentModal.svelte"
  import UpdateAgentModal from "../_components/UpdateAgentModal.svelte"
  import { onMount } from "svelte"

  let showHighlight = false
  let upsertModal: AgentModal
  let updateModal: Pick<ModalAPI, "show" | "hide">
  let confirmDeleteDialog: Pick<ModalAPI, "show" | "hide">
  let selectedAgent: Agent | undefined = undefined
  let activeTab = "Your agents"
  let activeSubTab = "All"

  $: favourites = workspaceFavouriteStore.lookup

  async function deleteAgent() {
    const selectedId = selectedAgent?._id
    if (!selectedId) {
      return
    }
    try {
      await agentsStore.deleteAgent(selectedId)
      notifications.success("Agent deleted successfully")
    } catch (error) {
      console.error(error)
      notifications.error("Error deleting agent")
    }
  }

  const getContextMenuItems = () => {
    const edit = {
      icon: "pencil",
      name: "Edit",
      visible: true,
      callback: () => updateModal.show(),
    }
    const del = {
      icon: "trash",
      name: "Delete",
      visible: true,
      disabled: false,
      callback: () => confirmDeleteDialog.show(),
    }
    return [edit, del]
  }

  const openContextMenu = (e: MouseEvent, agent: Agent) => {
    e.preventDefault()
    e.stopPropagation()
    selectedAgent = agent
    showHighlight = true
    contextMenuStore.open(
      "agent",
      getContextMenuItems(),
      {
        x: e.clientX,
        y: e.clientY,
      },
      () => {
        showHighlight = false
      }
    )
  }

  const getAgentIcon = (_agent: Agent) => {
    // default for now, will update when storing agent icon properly
    return "SideKick"
  }

  const getAgentIconColor = (agent: Agent, index: number) => {
    const colors = [
      "#6366F1", // purple
      "#F59E0B", // orange
      "#10B981", // green
      "#8B5CF6", // purple
      "#EF4444", // red
    ]
    return colors[index % colors.length]
  }

  $: agents = $agentsStore.agents
    .map(agent => {
      return {
        ...agent,
        favourite: $favourites?.[agent._id!] ?? {
          resourceType: WorkspaceResource.AGENT,
          resourceId: agent._id!,
        },
      }
    })
    .sort((a, b) => {
      const aIsFav = !!a.favourite._id
      const bIsFav = !!b.favourite._id

      if (aIsFav !== bIsFav) {
        return bIsFav ? 1 : -1
      }

      return b.updatedAt!.localeCompare(a.updatedAt!)
    })

  onMount(async () => {
    await agentsStore.fetchAgents()
  })
</script>

<div class="agents-index">
  <div class="content-wrapper">
    <div class="header">
      <div class="title-section">
        <Icon name="Effect" size="L" color="#8B5CF6" />
        <Heading size="L">Agents</Heading>
      </div>
      <div class="header-actions">
        <a
          href="https://docs.budibase.com/docs/TODO"
          target="_blank"
          class="learn-link"
        >
          <Icon name="Education" size="M" />
          <Body size="S">Agent building 101</Body>
        </a>
        <Button cta icon="plus" on:click={upsertModal.show}>New agent</Button>
      </div>
    </div>

    <div class="tabs-section">
      <Tabs selected={activeTab} on:select={e => (activeTab = e.detail)}>
        <Tab title="Inspiration" />
        <Tab title="Your agents" />
      </Tabs>
    </div>

    {#if activeTab === "Your agents"}
      <div class="sub-tabs">
        <ActionButton
          quiet
          selected={activeSubTab === "All"}
          on:click={() => (activeSubTab = "All")}
        >
          All
        </ActionButton>
        <ActionButton
          quiet
          selected={activeSubTab === "Live"}
          on:click={() => (activeSubTab = "Live")}
        >
          Live
        </ActionButton>
        <ActionButton
          quiet
          selected={activeSubTab === "Draft"}
          on:click={() => (activeSubTab = "Draft")}
        >
          Draft
        </ActionButton>
      </div>

      {#if activeSubTab === "All"}
        <div class="agents-grid">
          {#each agents as agent, index}
            {@const iconName = getAgentIcon(agent)}
            {@const iconColor = getAgentIconColor(agent, index)}
            <a
              class="agent-card"
              href={$url(`./${agent._id}`)}
              on:contextmenu={e => openContextMenu(e, agent)}
              class:active={showHighlight && selectedAgent === agent}
            >
              <div class="card-icon" style="background-color: {iconColor}20;">
                <Icon name={iconName} size="XL" color={iconColor} />
              </div>
              <div class="card-content">
                <div class="card-name">
                  <Body size="M">{agent.name}</Body>
                </div>
                <div class="card-creator">
                  <Body size="S">Created by Budibase</Body>
                </div>
              </div>
              <div class="card-actions">
                <div class="ctx-btn">
                  <Icon
                    name="dots-three"
                    size="M"
                    hoverable
                    on:click={e => openContextMenu(e, agent)}
                  />
                </div>
                <FavouriteResourceButton
                  favourite={agent.favourite}
                  position={TooltipPosition.Left}
                  noWrap
                />
              </div>
            </a>
          {/each}
          {#if !agents.length}
            <NoResults
              ctaText="Create your first agent"
              onCtaClick={() => upsertModal.show()}
              resourceType="agent"
            >
              No agents yet! Build your first agent to get started.
            </NoResults>
          {/if}
        </div>
      {:else if activeSubTab === "Live"}
        <div class="empty-state">
          <Body size="M">Live agents will appear here</Body>
        </div>
      {:else if activeSubTab === "Draft"}
        <div class="empty-state">
          <Body size="M">Draft agents will appear here</Body>
        </div>
      {/if}
    {:else if activeTab === "Inspiration"}
      <div class="empty-state">
        <Body size="M">Inspiration content coming soon</Body>
      </div>
    {/if}
  </div>
</div>

<AgentModal bind:this={upsertModal} />
{#if selectedAgent}
  <UpdateAgentModal agent={selectedAgent} bind:this={updateModal} />
  <ConfirmDialog
    bind:this={confirmDeleteDialog}
    okText="Delete Agent"
    onOk={deleteAgent}
    title="Confirm Deletion"
  >
    Are you sure you wish to delete the agent
    <b>{selectedAgent.name}?</b>
    This action cannot be undone.
  </ConfirmDialog>
{/if}

<style>
  .agents-index {
    background: var(--background);
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    padding: 0 var(--spacing-l);
    box-sizing: border-box;
  }

  .content-wrapper {
    max-width: 1400px;
    width: 100%;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    padding: var(--spacing-l) 0;
    gap: var(--spacing-m);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-m);
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .learn-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--spectrum-global-color-gray-700);
    text-decoration: none;
    transition: color 130ms ease-out;
  }

  .learn-link:hover {
    color: var(--spectrum-global-color-gray-900);
  }

  .tabs-section {
    margin-bottom: var(--spacing-m);
  }

  .sub-tabs {
    display: flex;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-l);
  }

  .sub-tabs :global(.spectrum-ActionButton) {
    border-radius: 20px;
    padding: 4px 12px;
    height: auto;
    font-size: 14px;
  }

  .agents-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: calc(var(--spacing-xl) * 3);
  }

  .agent-card {
    background: var(--spectrum-alias-background-color-primary);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
    padding: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    text-decoration: none;
    color: var(--text-color);
    transition:
      transform 130ms ease-out,
      box-shadow 130ms ease-out,
      border-color 130ms ease-out;
    position: relative;
  }

  .agent-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--spectrum-global-color-gray-400);
  }

  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--border-radius-s);
    display: flex;
    align-items: center;
    justify-content: center;
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

  .card-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
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

  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--spacing-xxl);
    color: var(--spectrum-global-color-gray-600);
  }
</style>
