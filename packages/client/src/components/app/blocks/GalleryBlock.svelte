<script>
import { getContext } from "svelte"
import { get } from "svelte/store"
import Block from "@/components/Block.svelte"
import BlockComponent from "@/components/BlockComponent.svelte"

function portal(node) {
  const target = document.body
  target.appendChild(node)
  node.hidden = false
  return {
    destroy() {
      if (node.parentNode) {
        node.parentNode.removeChild(node)
      }
    },
  }
}

export let dataSource
export let filter
export let sortColumn
export let sortOrder
export let limit
export let paginate
export let noRowsMessage
export let imageColumn = "Value"
export let captionColumn
export let arrayOfUrls = false
export let tileWidth
export let tileHeight
export let autoRefresh

const component = getContext("component")
const context = getContext("context")
const { generateGoldenSample } = getContext("sdk")

let dataProviderId
let selectedIndex = 0
let showLightbox = false

$: effectiveColumn = arrayOfUrls ? "Value" : imageColumn
$: rows = ($context[dataProviderId]?.rows || []).filter((r) => r[effectiveColumn])
$: imageCount = rows.length
$: effectiveTileWidth = tileWidth || tileHeight || 200
$: effectiveTileHeight = tileHeight || tileWidth || 200

const getUrl = (row) => row?.[effectiveColumn]
const getCaption = (row) => row?.[captionColumn]

$: console.log("ROWS ?? ", rows)

export const getAdditionalDataContext = () => {
  const rows = get(context)[dataProviderId]?.rows || []
  const goldenRow = generateGoldenSample(rows)
  const id = get(component).id
  return {
    [`${id}-repeater`]: goldenRow,
  }
}

const openLightbox = (index) => {
  selectedIndex = index
  showLightbox = true
}

const closeLightbox = () => {
  showLightbox = false
}

const goNext = () => {
  if (imageCount > 0) {
    selectedIndex = (selectedIndex + 1) % imageCount
  }
}

const goPrev = () => {
  if (imageCount > 0) {
    selectedIndex = (selectedIndex - 1 + imageCount) % imageCount
  }
}

const handleKeydown = (e) => {
  if (!showLightbox) return
  if (e.key === "Escape") closeLightbox()
  if (e.key === "ArrowRight") goNext()
  if (e.key === "ArrowLeft") goPrev()
}
</script>

<svelte:window onkeydown={handleKeydown} />

<Block>
  <BlockComponent
    type="dataprovider"
    context="provider"
    bind:id={dataProviderId}
    props={{
      dataSource,
      filter,
      sortColumn,
      sortOrder,
      limit,
      paginate,
      autoRefresh,
    }}
  >
    {#if rows.length > 0}
      <div
        class="gallery-grid"
        style="--tile-width: {effectiveTileWidth}px; --tile-height: {effectiveTileHeight}px"
      >
        {#each rows as row, i (i)}
          {@const url = getUrl(row)}
          {@const caption = getCaption(row)}
          {#if url}
            <button
              class="gallery-thumb"
              onclick={() => openLightbox(i)}
              aria-label={caption || `Image ${i + 1}`}
            >
              <img
                src={url}
                alt={caption || ""}
                loading="lazy"
              />
              {#if caption}
                <div class="gallery-thumb-caption">{caption}</div>
              {/if}
            </button>
          {/if}
        {/each}
      </div>
    {:else}
      <div class="gallery-empty">
        {noRowsMessage || "No images found"}
      </div>
    {/if}
  </BlockComponent>

  {#if showLightbox}
    <div
      class="lightbox-backdrop"
      use:portal
      onclick={closeLightbox}
      role="presentation"
    >
      <div
        class="lightbox-content"
        onclick={(e) => e.stopPropagation()}
        role="presentation"
      >
        <div class="lightbox-header">
          <span class="lightbox-counter">
            {selectedIndex + 1} / {imageCount}
          </span>
          <button
            class="lightbox-close"
            onclick={closeLightbox}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div class="lightbox-body">
          {#if imageCount > 1}
            <button
              class="lightbox-nav lightbox-prev"
              onclick={goPrev}
              aria-label="Previous"
            >
              &lsaquo;
            </button>
          {/if}
          <div class="lightbox-image-wrapper">
            <img
              src={getUrl(rows[selectedIndex])}
              alt={getCaption(rows[selectedIndex]) || ""}
            />
          </div>
          {#if imageCount > 1}
            <button
              class="lightbox-nav lightbox-next"
              onclick={goNext}
              aria-label="Next"
            >
              &rsaquo;
            </button>
          {/if}
        </div>
        {#if getCaption(rows[selectedIndex])}
          <div class="lightbox-caption">{getCaption(rows[selectedIndex])}</div>
        {/if}
      </div>
    </div>
  {/if}
</Block>

<style>
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--tile-width, 200px), 1fr));
    gap: var(--spacing-m);
    padding: var(--spacing-m);
  }

  .gallery-thumb {
    position: relative;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    overflow: hidden;
    border-radius: var(--border-radius-s);
    width: 100%;
    aspect-ratio: var(--tile-width) / var(--tile-height);
    max-width: var(--tile-width);
    max-height: var(--tile-height);
  }

  .gallery-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s ease;
    display: block;
  }

  .gallery-thumb:hover img {
    transform: scale(1.05);
  }

  .gallery-thumb:focus-visible {
    outline: 2px solid var(--spectrum-global-color-blue-400);
    outline-offset: 2px;
  }

  .gallery-thumb-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--spacing-xs) var(--spacing-s);
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    color: white;
    font-size: var(--font-size-s);
    text-align: center;
    pointer-events: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .gallery-empty {
    padding: var(--spacing-xl);
    text-align: center;
    color: var(--spectrum-global-color-gray-600);
    font-style: italic;
  }

  .lightbox-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100000;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lightbox-content {
    display: flex;
    flex-direction: column;
    max-width: 95vw;
    max-height: 95vh;
  }

  .lightbox-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--spacing-s);
  }

  .lightbox-counter {
    color: rgba(255, 255, 255, 0.7);
    font-size: var(--font-size-s);
  }

  .lightbox-close {
    background: none;
    border: none;
    color: white;
    font-size: 28px;
    cursor: pointer;
    padding: 0 var(--spacing-xs);
    line-height: 1;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .lightbox-close:hover {
    opacity: 1;
  }

  .lightbox-body {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .lightbox-nav {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: white;
    font-size: 40px;
    cursor: pointer;
    padding: var(--spacing-s) var(--spacing-m);
    border-radius: var(--border-radius-s);
    transition: background 0.2s;
    line-height: 1;
    flex-shrink: 0;
  }

  .lightbox-nav:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .lightbox-image-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lightbox-image-wrapper img {
    max-width: 80vw;
    max-height: 80vh;
    object-fit: contain;
    border-radius: var(--border-radius-s);
  }

  .lightbox-caption {
    padding-top: var(--spacing-s);
    color: white;
    font-size: var(--font-size-m);
    text-align: center;
  }
</style>
