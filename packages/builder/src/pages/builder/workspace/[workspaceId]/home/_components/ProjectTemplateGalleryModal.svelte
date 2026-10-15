<svelte:options runes={true} />

<script lang="ts">
  import { onMount, tick } from "svelte"
  import { Button, Icon, ModalContent, ProgressCircle } from "@budibase/bbui"
  import type { ProjectTemplateMetadata } from "@budibase/types"

  interface Props {
    templates?: ProjectTemplateMetadata[]
    workspaceName?: string
    isLoading?: boolean
    error?: string
    selectedTemplateKey?: string
    isImporting?: boolean
    onSelect?: (_template: ProjectTemplateMetadata) => unknown
    onRetry?: () => unknown
  }

  let {
    templates = [],
    workspaceName = "",
    isLoading = false,
    error = "",
    selectedTemplateKey = "",
    isImporting = false,
    onSelect = () => {},
    onRetry = () => {},
  }: Props = $props()
  let galleryContent: HTMLDivElement | undefined
  onMount(() => galleryContent?.focus())

  const retry = async () => {
    galleryContent?.focus()
    await onRetry()
    await tick()
    if (galleryContent?.isConnected) {
      galleryContent.focus()
    }
  }

  const activeTemplates = $derived(
    templates.filter(template => template.status === "active")
  )
</script>

<ModalContent title="Project templates" size="XL" showConfirmButton={false}>
  <div bind:this={galleryContent} tabindex="-1">
    <p class="destination-copy">
      Imports a new project into <strong
        >{workspaceName || "this workspace"}</strong
      >.
    </p>
    {#if isLoading}
      <div class="gallery-state" aria-live="polite">
        <ProgressCircle size="S" />
        <p>Loading templates…</p>
      </div>
    {:else if error}
      <div class="gallery-state" role="alert">
        <p>{error}</p>
        <Button secondary on:click={retry}>Try again</Button>
      </div>
    {:else if activeTemplates.length}
      <div class="template-grid">
        {#each activeTemplates as template (template.key)}
          {@const selected = selectedTemplateKey === template.key}
          <button
            type="button"
            class="template-card"
            aria-label={`Use ${template.name}`}
            aria-busy={selected && isImporting}
            disabled={isImporting}
            onclick={() => onSelect(template)}
          >
            <span
              class="template-card__media"
              style:background={template.background || "#5c5ce0"}
            >
              {#if template.image}
                <img src={template.image} alt="" />
              {:else}
                <Icon name={template.icon || "stack"} size="L" color="white" />
              {/if}

              {#if selected && isImporting}
                <span class="template-card__progress">
                  <ProgressCircle overBackground={true} size="S" />
                </span>
              {/if}
            </span>

            <span class="template-card__content">
              <span class="template-card__category">{template.category}</span>
              <span class="template-card__name">{template.name}</span>
              <span class="template-card__description">
                {template.description}
              </span>
              <span class="template-card__action">
                {selected && isImporting ? "Importing…" : "Use template"}
              </span>
            </span>
          </button>
        {/each}
      </div>
    {:else}
      <p class="empty-state">
        No curated Project templates are available for this Budibase version.
      </p>
    {/if}
  </div>
</ModalContent>

<style>
  .template-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--spacing-l);
    padding: var(--spacing-m) 0;
  }

  .template-card {
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-m);
    background: var(--spectrum-global-color-gray-100);
    padding: 0;
    text-align: left;
    font-family: var(--font-sans);
    cursor: pointer;
    transition:
      border-color 130ms ease-out,
      box-shadow 130ms ease-out,
      transform 130ms ease-out;
  }

  .template-card:hover:not(:disabled) {
    border-color: var(--spectrum-global-color-gray-500);
    box-shadow: var(--shadow-m);
    transform: translateY(-2px);
  }

  .template-card:focus-visible {
    outline: 2px solid var(--spectrum-global-color-blue-400);
    outline-offset: 2px;
  }

  .template-card:disabled {
    cursor: wait;
    opacity: 0.65;
  }

  .template-card__media {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 132px;
    overflow: hidden;
    color: white;
  }

  .template-card__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .template-card__progress {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(0 0 0 / 35%);
  }

  .template-card__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
    padding: var(--spacing-m);
    color: var(--spectrum-global-color-gray-900);
  }

  .template-card__category {
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--font-size-xs);
    line-height: 16px;
    text-transform: uppercase;
  }

  .template-card__name {
    font-size: var(--font-size-m);
    font-weight: 600;
    line-height: 22px;
  }

  .template-card__description {
    display: -webkit-box;
    overflow: hidden;
    color: var(--spectrum-global-color-gray-700);
    font-size: var(--font-size-s);
    line-height: 20px;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  .template-card__action {
    margin-top: auto;
    padding-top: var(--spacing-s);
    color: var(--spectrum-global-color-blue-600);
    font-size: var(--font-size-s);
    font-weight: 600;
  }

  .empty-state {
    margin: 0;
    padding: var(--spacing-xl) 0;
    color: var(--spectrum-global-color-gray-700);
    font-family: var(--font-sans);
    font-size: var(--font-size-s);
  }

  .gallery-state {
    display: flex;
    min-height: 160px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-s);
    color: var(--spectrum-global-color-gray-700);
    font-family: var(--font-sans);
    font-size: var(--font-size-s);
  }

  .gallery-state p {
    margin: 0;
  }

  .destination-copy {
    color: var(--spectrum-global-color-gray-700);
    font-family: var(--font-sans);
    font-size: var(--font-size-s);
    margin: 0;
  }

  @media (max-width: 900px) {
    .template-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
