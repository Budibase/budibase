<script lang="ts">
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import HeroBanner from "@/components/common/HeroBanner.svelte"
  import TopBar from "@/components/common/TopBar.svelte"
  import { BannerType } from "@/constants/banners"
  import { capitalise, durationFromNow } from "@/helpers"
  import { contextMenuStore } from "@/stores/builder"
  import { agentsStore } from "@/stores/portal"
  import {
    AbsTooltip,
    Body,
    Button,
    Helpers,
    Icon,
    type ModalAPI,
    notifications,
  } from "@budibase/bbui"
  import type { Agent } from "@budibase/types"
  import { url } from "@roxi/routify"
  import AppsHero from "assets/automation-hero-x1.png"
  import NoResults from "../_components/NoResults.svelte"
  import AgentModal from "./AgentModal.svelte"

  let showHighlight = true
  let upsertModal: AgentModal
  let confirmDeleteDialog: Pick<ModalAPI, "show" | "hide">
  let selectedAgent: Agent | undefined = undefined

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
    const del = {
      icon: "trash",
      name: "Delete",
      visible: true,
      disabled: false,
      callback: () => confirmDeleteDialog.show(),
    }
    return [del]
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

  $: agents = $agentsStore.agents.sort((a, b) => {
    // const aIsFav = !!a.favourite._id
    // const bIsFav = !!b.favourite._id

    // // Group by favourite status
    // if (aIsFav !== bIsFav) {
    //   return bIsFav ? 1 : -1
    // }

    return b.updatedAt!.localeCompare(a.updatedAt!)
  })
</script>

<div class="agents-index">
  <HeroBanner
    key={BannerType.AGENTS}
    title="Transform workflows at scale with Budibase Agents and AI"
    linkTitle="Agents explained"
    linkHref="https://docs.budibase.com/docs/TODO"
    image={AppsHero}
    color="#1C3F62"
  >
    Automate more processes for your employees and customers with our visual
    agent builder. Use agents to transform workflows with AI, automate manual
    tasks, and add logic to apps.
  </HeroBanner>

  <TopBar icon="cpu" breadcrumbs={[{ text: "Agents" }]} showPublish={false}
  ></TopBar>
  <div class="secondary-bar">
    <div class="filter">
      <!-- TODO -->
    </div>
    <div class="action-buttons">
      <Button
        icon="lightbulb"
        secondary
        on:click={() => {
          window.open("https://docs.budibase.com/docs/TODO", "_blank")
        }}
      >
        Learn
      </Button>
      <Button cta icon="plus" on:click={upsertModal.show}>New agent</Button>
    </div>
  </div>

  <div class="table-wrapper">
    <div class="table-header">
      <span>Name</span>
      <span>Last updated</span>
      <span></span>
    </div>
    <div class="agents">
      {#each agents as agent}
        <a
          class="agent"
          href={$url(`./${agent._id}`)}
          on:contextmenu={e => openContextMenu(e, agent)}
          class:active={showHighlight && selectedAgent === agent}
        >
          <Body size="S" color="var(--spectrum-global-color-gray-900)">
            <div class="auto-name">
              {agent.name}
            </div>
          </Body>
          <AbsTooltip text={Helpers.getDateDisplayValue(agent.updatedAt)}>
            <span>
              {capitalise(durationFromNow(agent.updatedAt || ""))}
            </span>
          </AbsTooltip>
          <div class="actions">
            <div class="ctx-btn">
              <Icon
                name="More"
                size="M"
                hoverable
                on:click={e => openContextMenu(e, agent)}
              />
            </div>
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
  </div>
</div>

<AgentModal bind:this={upsertModal} />
{#if selectedAgent}
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
  .auto-name {
    display: flex;
    gap: var(--spacing-xs);
  }
  .agents-index {
    background: var(--background);
    flex: 1 1 auto;
    --border: 1px solid var(--spectrum-global-color-gray-200);
    display: flex;
    flex-direction: column;
  }
  .secondary-bar {
    padding: 10px 12px;
    border-bottom: var(--border);
    display: flex;
    justify-content: space-between;
    align-content: center;
  }
  .filter {
    display: flex;
    gap: 10px;
  }
  .filter :global(.spectrum-ActionButton) {
    border-radius: 8px;
    transition:
      border-color 130ms ease-out,
      background 130ms ease-out;
    border: 1px solid transparent;
    padding: 3px 10px;
    height: auto;

    &.is-selected {
      background: var(--spectrum-global-color-gray-200);
      border-color: var(--spectrum-global-color-gray-300);
    }
  }
  .action-buttons {
    display: flex;
    gap: 8px;
  }
  .agent,
  .table-header {
    display: grid;
    grid-template-columns: 1fr 200px 200px 200px 50px;
    border-bottom: var(--border);
    align-items: center;
  }
  .table-header {
    padding: 5px 12px;
    color: var(--spectrum-global-color-gray-700);
  }
  .agent {
    padding: 9px 12px;
    color: var(--text-color);
    transition: background 130ms ease-out;

    &:hover,
    &.active {
      background: var(--spectrum-global-color-gray-200);

      & .actions > * {
        opacity: 1;
        pointer-events: all;
      }
    }
    &.favourite {
      & .actions .favourite-btn {
        opacity: 1;
      }
    }
  }
  .actions {
    justify-content: flex-end;
    display: flex;
    align-items: center;
    pointer-events: none;
    gap: var(--spacing-xs);
  }

  .actions > * {
    opacity: 0;
    transition: opacity 130ms ease-out;
  }

  .table-wrapper {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    height: 0;
  }

  .agents {
    overflow-y: auto;
    flex: 1 1 auto;
  }
</style>
