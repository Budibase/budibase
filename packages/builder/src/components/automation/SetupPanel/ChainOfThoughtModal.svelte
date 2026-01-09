<script lang="ts">
  import {
    Modal,
    ModalContent,
    Icon,
    Body,
    MarkdownViewer,
    StatusLight,
    Tabs,
    Tab,
  } from "@budibase/bbui"
  import type { ModalAPI } from "@budibase/bbui"
  import { type ChainStep } from "./ChainOfThought.svelte"
  import { fade } from "svelte/transition"
  import JSONViewer from "@/components/common/JSONViewer.svelte"
  import {
    getStatusActionButtonClass,
    getStatusLabel,
    getStatusLightColor,
  } from "./chainOfThoughtStatus"

  export let steps: ChainStep[] = []
  export let response: string = ""
  export let title: string = "Agent Execution"
  export let meta: string = ""

  let modal: ModalAPI
  let selectedStep: ChainStep | null = null
  let selectedTab = "Output"

  export function show() {
    modal?.show()
    selectedStep = steps[0] || null
  }

  export function hide() {
    modal?.hide()
  }

  function selectStep(step: ChainStep) {
    selectedStep = step
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    {title}
    showCancelButton={false}
    showConfirmButton={false}
    size="XL"
  >
    <div class="modal-body">
      {#if meta}
        <div class="meta-bar">
          <Body size="XS">{meta}</Body>
        </div>
      {/if}
      <div class="split-view">
        <div class="steps-panel">
          <div class="panel-label">Steps</div>
          <div class="steps-list">
            {#each steps as step, index (step.id)}
              {@const isSelected = selectedStep?.id === step.id}
              {@const isLast = index === steps.length - 1}

              <button
                type="button"
                class="step-row"
                class:selected={isSelected}
                on:click={() => selectStep(step)}
              >
                <div class="step-track">
                  <div class="step-node">
                    <StatusLight
                      size="S"
                      color={getStatusLightColor(step.status)}
                    />
                  </div>
                  {#if !isLast}
                    <div class="step-line"></div>
                  {/if}
                </div>
                <span class="step-name">{step.displayName}</span>
              </button>
            {/each}
          </div>
        </div>

        <div class="detail-panel">
          {#if selectedStep}
            {#key selectedStep.id}
              <div class="detail-content" in:fade={{ duration: 150 }}>
                <div class="detail-header">
                  <h3 class="detail-title">{selectedStep.displayName}</h3>
                  <span
                    class={`${getStatusActionButtonClass(
                      selectedStep.status
                    )} status-pill`}
                  >
                    {getStatusLabel(selectedStep.status)}
                  </span>
                </div>

                <div class="detail-sections">
                  {#if selectedStep.reasoning}
                    <div class="section">
                      <div class="section-label">
                        <Icon name="Light" size="S" />
                        <span>Reasoning</span>
                      </div>
                      <div class="reasoning-content">
                        <Body size="S">{selectedStep.reasoning}</Body>
                      </div>
                    </div>
                  {/if}

                  <div class="tabs-container">
                    <Tabs
                      quiet
                      noHorizPadding
                      selected={selectedTab}
                      on:select={e => {
                        selectedTab = e.detail
                      }}
                    >
                      <Tab title="Output">
                        <div class="tab-content">
                          {#if selectedStep.output !== undefined}
                            <JSONViewer value={selectedStep.output} />
                          {:else}
                            <div class="empty-state">
                              <Icon
                                name="Export"
                                size="L"
                                color="var(--spectrum-global-color-gray-500)"
                              />
                              <Body size="S">No output data</Body>
                            </div>
                          {/if}
                        </div>
                      </Tab>
                      <Tab title="Response">
                        <div class="tab-content">
                          {#if response}
                            <MarkdownViewer value={response} />
                          {:else}
                            <div class="empty-state">
                              <Icon
                                name="Article"
                                size="L"
                                color="var(--spectrum-global-color-gray-500)"
                              />
                              <Body size="S">No response</Body>
                            </div>
                          {/if}
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </div>
            {/key}
          {:else}
            <div class="detail-empty">
              <Icon
                name="Preview"
                size="L"
                color="var(--spectrum-global-color-gray-500)"
              />
              <Body size="S">Select a step to view details</Body>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </ModalContent>
</Modal>

<style>
  .modal-body {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    height: 60vh;
    min-height: 400px;
  }

  .meta-bar {
    padding: var(--spacing-s) var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 6px;
    background: color-mix(
      in srgb,
      var(--spectrum-global-color-gray-200) 35%,
      transparent
    );
    color: var(--spectrum-global-color-gray-700);
    overflow: hidden;
  }

  .meta-bar :global(*) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .split-view {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: var(--spacing-l);
    flex: 1;
    min-height: 0;
  }

  .panel-label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--spectrum-global-color-gray-600);
    margin-bottom: var(--spacing-s);
  }

  .steps-panel {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .steps-list {
    flex: 1;
    overflow-y: auto;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    padding: var(--spacing-s);
  }

  .step-row {
    display: grid;
    grid-template-columns: 16px minmax(0, 1fr) auto;
    align-items: stretch;
    gap: var(--spacing-m);
    padding: var(--spacing-s) var(--spacing-m);
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    text-align: left;
    background: transparent;
    border: 1px solid transparent;
    font-family: inherit;
    transition: background 0.15s ease;
  }

  .step-row:hover {
    background: var(--spectrum-global-color-gray-200);
  }

  .step-row.selected {
    background: var(--spectrum-global-color-gray-200);
    border-color: var(--spectrum-global-color-gray-400);
  }

  .step-track {
    position: relative;
    width: 16px;
    min-width: 16px;
  }

  .step-node {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .step-line {
    position: absolute;
    left: 50%;
    top: calc(50% + 10px);
    bottom: 0;
    width: 1px;
    background: var(--spectrum-global-color-gray-400);
    transform: translateX(-50%);
  }

  .step-name {
    flex: 1;
    min-width: 0;
    font-size: 12px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-900);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 22px;
    padding: 0 10px;
    border-radius: 999px;
    border: 1px solid transparent;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    flex-shrink: 0;
    align-self: center;
    user-select: none;
  }

  .flow-blue.status-pill {
    background-color: var(--spectrum-global-color-blue-600);
    border-color: var(--spectrum-global-color-blue-600);
    color: var(--spectrum-global-color-static-white);
  }

  .flow-success.status-pill {
    background-color: var(--spectrum-semantic-positive-color-status);
    border-color: var(--spectrum-semantic-positive-color-status);
    color: var(--spectrum-global-color-static-white);
  }

  .flow-error.status-pill {
    background-color: var(--spectrum-semantic-negative-color-status);
    border-color: var(--spectrum-semantic-negative-color-status);
    color: var(--spectrum-global-color-static-white);
  }

  .flow-warn.status-pill {
    background-color: var(--spectrum-global-color-gray-300);
    border-color: var(--spectrum-global-color-gray-300);
    color: var(--spectrum-global-color-gray-900);
  }

  .detail-panel {
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
    border-left: 1px solid var(--spectrum-global-color-gray-300);
    padding-left: var(--spacing-l);
  }

  .detail-content {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    min-width: 0;
  }

  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    padding-bottom: var(--spacing-m);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .detail-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
    margin: 0;
  }

  .detail-sections {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .section-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--spectrum-global-color-gray-600);
  }

  .reasoning-content {
    font-size: 13px;
    line-height: 1.5;
    color: var(--spectrum-global-color-gray-800);
    white-space: pre-wrap;
    word-break: break-word;
    padding: var(--spacing-m);
    border-radius: 4px;
    border: 1px solid var(--spectrum-global-color-gray-300);
  }

  .tabs-container {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .tab-content {
    padding: var(--spacing-m) 0;
    overflow: auto;
    max-height: 300px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-m);
    padding: var(--spacing-xl);
    color: var(--spectrum-global-color-gray-500);
  }

  .detail-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-m);
    color: var(--spectrum-global-color-gray-500);
  }
</style>
