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
  import type { ChainStep } from "./AgentOutputViewer.svelte"
  import { fade } from "svelte/transition"
  import JSONViewer from "@/components/common/JSONViewer.svelte"
  import {
    getStatusActionButtonClass,
    getStatusLabel,
    getStatusLightColor,
  } from "./chainOfThoughtStatus"
  import type { LanguageModelUsage } from "ai"

  interface Props {
    steps?: ChainStep[]
    response?: string
    title?: string
    usage?: LanguageModelUsage
  }

  let { steps = [], response, title, usage }: Props = $props()

  let modal = $state<Modal>()
  let selectedStep: ChainStep | null = $state(null)
  let selectedTab = $state("Output")

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
      {#if usage}
        <div class="usage-bar">
          <div class="usage-item">
            <span class="usage-label">Input</span>
            <span class="usage-value"
              >{usage.inputTokens?.toLocaleString() ?? 0}</span
            >
          </div>
          <div class="usage-item">
            <span class="usage-label">Output</span>
            <span class="usage-value"
              >{usage.outputTokens?.toLocaleString() ?? 0}</span
            >
          </div>
          <div class="usage-item">
            <span class="usage-label">Total</span>
            <span class="usage-value"
              >{usage.totalTokens?.toLocaleString() ?? 0}</span
            >
          </div>
        </div>
      {/if}
      <div class="split-view">
        <div class="tools-panel">
          <div class="panel-label">Tools</div>
          <div class="tools-list">
            {#each steps as step, index (step.id)}
              {@const isSelected = selectedStep?.id === step.id}
              {@const isLast = index === steps.length - 1}

              <button
                type="button"
                class="tool-row"
                class:selected={isSelected}
                onclick={() => selectStep(step)}
              >
                <div class="tool-track">
                  <div class="tool-node">
                    <StatusLight
                      size="S"
                      color={getStatusLightColor(step.status)}
                    />
                  </div>
                  {#if !isLast}
                    <div class="tool-line"></div>
                  {/if}
                </div>
                <span class="tool-name">{step.displayName}</span>
              </button>
            {/each}
          </div>
        </div>

        <div class="detail-panel">
          <div class="tabs-container">
            <Tabs
              quiet
              noHorizPadding
              selected={selectedTab}
              on:select={e => {
                selectedTab = e.detail
              }}
            >
              <Tab title="Input">
                <div class="tab-content">
                  {#if selectedStep}
                    {#if selectedStep.input !== undefined}
                      <JSONViewer value={selectedStep.input} />
                    {:else}
                      <div class="empty-state">
                        <Icon
                          name="Export"
                          size="L"
                          color="var(--spectrum-global-color-gray-500)"
                        />
                        <Body size="S">No input data</Body>
                      </div>
                    {/if}
                  {:else}
                    <div class="empty-state">
                      <Icon
                        name="Preview"
                        size="L"
                        color="var(--spectrum-global-color-gray-500)"
                      />
                      <Body size="S">Select a tool to view input</Body>
                    </div>
                  {/if}
                </div>
              </Tab>
              <Tab title="Output">
                <div class="tab-content">
                  {#if selectedStep}
                    <div class="tool-header" in:fade={{ duration: 150 }}>
                      <h3 class="tool-title">{selectedStep.displayName}</h3>
                      <span
                        class={`${getStatusActionButtonClass(
                          selectedStep.status
                        )} status-pill`}
                      >
                        {getStatusLabel(selectedStep.status)}
                      </span>
                    </div>
                    {#key selectedStep.id}
                      <div class="output-content" in:fade={{ duration: 150 }}>
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
                    {/key}
                  {:else}
                    <div class="empty-state">
                      <Icon
                        name="Preview"
                        size="L"
                        color="var(--spectrum-global-color-gray-500)"
                      />
                      <Body size="S">Select a tool to view output</Body>
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

  .usage-bar {
    display: flex;
    gap: var(--spacing-l);
    padding: var(--spacing-s) var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 6px;
    background: color-mix(
      in srgb,
      var(--spectrum-global-color-gray-200) 35%,
      transparent
    );
  }

  .usage-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--spectrum-global-color-gray-700);
  }

  .usage-label {
    font-size: 12px;
    font-weight: 500;
  }

  .usage-value {
    font-size: 12px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
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

  .tools-panel {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .tools-list {
    flex: 1;
    overflow-y: auto;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    padding: var(--spacing-s);
  }

  .tool-row {
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

  .tool-row:hover {
    background: var(--spectrum-global-color-gray-200);
  }

  .tool-row.selected {
    background: var(--spectrum-global-color-gray-200);
    border-color: var(--spectrum-global-color-gray-400);
  }

  .tool-track {
    position: relative;
    width: 16px;
    min-width: 16px;
  }

  .tool-node {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .tool-line {
    position: absolute;
    left: 50%;
    top: calc(50% + 10px);
    bottom: 0;
    width: 1px;
    background: var(--spectrum-global-color-gray-400);
    transform: translateX(-50%);
  }

  .tool-name {
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

  .tool-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    padding-bottom: var(--spacing-m);
    margin-bottom: var(--spacing-m);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .tool-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
    margin: 0;
  }

  .output-content {
    flex: 1;
    min-height: 0;
    overflow: auto;
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

  .tabs-container {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .tab-content {
    padding: var(--spacing-m) 0;
    overflow: auto;
    flex: 1;
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
</style>
