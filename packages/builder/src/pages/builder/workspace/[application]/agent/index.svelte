<script lang="ts">
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
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
  } from "@budibase/bbui"
  import type { Agent } from "@budibase/types"
  import { WorkspaceResource } from "@budibase/types"
  import NoResults from "../_components/NoResults.svelte"
  import AgentModal from "./AgentModal.svelte"
  import UpdateAgentModal from "../_components/UpdateAgentModal.svelte"
  import AgentCard from "./AgentCard.svelte"
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

  $: filteredAgents = $agentsStore.agents.filter(agent => {
    if (activeSubTab === "All") return true
    if (activeSubTab === "Live") return agent.live === true
    if (activeSubTab === "Draft") return agent.live !== true
    return true
  })

  $: agents = filteredAgents
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
        <div class="agents-grid" class:empty={!agents.length}>
          {#each agents as agent, index}
            <AgentCard
              {agent}
              {index}
              isHighlighted={showHighlight && selectedAgent === agent}
              favourite={agent.favourite}
              onContextMenu={openContextMenu}
            />
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
      {:else if activeSubTab === "Live" || activeSubTab === "Draft"}
        <div class="agents-grid" class:empty={!agents.length}>
          {#each agents as agent, index}
            <AgentCard
              {agent}
              {index}
              isHighlighted={showHighlight && selectedAgent === agent}
              favourite={agent.favourite}
              onContextMenu={openContextMenu}
            />
          {/each}
          {#if !agents.length}
            <NoResults
              ctaText="Create your first agent"
              onCtaClick={() => upsertModal.show()}
              resourceType="agent"
              hideCta={activeSubTab === "Live" ||
                (activeSubTab === "Draft" && !agents.length)}
            >
              {activeSubTab === "Live" ? "No live agents!" : "No draft agents!"}
            </NoResults>
          {/if}
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
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--spacing-xl);
  }

  .agents-grid.empty {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 320px;
  }

  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--spacing-xxl);
    color: var(--spectrum-global-color-gray-600);
  }
</style>
