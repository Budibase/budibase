<script lang="ts">
  type Props = {
    title: string
  }

  let { title }: Props = $props()
</script>

<section class="io-panel" aria-busy="true">
  <div class="panel-header">
    <h4 class="panel-title">{title}</h4>
  </div>

  <div class="content-section">
    <div class="content-section-header">
      <div class="section-label-group">
        <div class="loading-line loading-line--title"></div>
        <div class="loading-line loading-line--subtitle"></div>
      </div>
    </div>
    <div class="content-surface content-surface--loading">
      <div class="loading-line loading-line--wide"></div>
      <div class="loading-line"></div>
      <div class="loading-line loading-line--short"></div>
      <div class="loading-line loading-line--medium"></div>
    </div>
  </div>
</section>

<style>
  .io-panel,
  .content-section,
  .section-label-group {
    display: flex;
    flex-direction: column;
  }

  .io-panel,
  .content-section,
  .section-label-group {
    min-width: 0;
  }

  .io-panel {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    background: var(--background);
    padding: 12px;
    gap: 14px;
  }

  .panel-header {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
  }

  .panel-title {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.2;
    color: var(--spectrum-global-color-gray-900);
    letter-spacing: 0.01em;
  }

  .content-section {
    gap: 8px;
  }

  .content-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .section-label-group {
    gap: 2px;
  }

  .content-surface {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
    background: var(--background);
  }

  .content-surface--loading {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 126px;
    padding: 10px;
    overflow: hidden;
  }

  .loading-line {
    width: 72%;
    height: 10px;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      var(--spectrum-global-color-gray-200) 0%,
      var(--spectrum-global-color-gray-100) 48%,
      var(--spectrum-global-color-gray-200) 100%
    );
    background-size: 200% 100%;
    animation: loading-shimmer 1.3s ease-in-out infinite;
  }

  .loading-line--title {
    width: 76px;
    height: 12px;
  }

  .loading-line--subtitle {
    width: 148px;
    height: 10px;
  }

  .loading-line--wide {
    width: 94%;
  }

  .loading-line--medium {
    width: 58%;
  }

  .loading-line--short {
    width: 40%;
  }

  @keyframes loading-shimmer {
    0% {
      background-position: 100% 0;
    }

    100% {
      background-position: -100% 0;
    }
  }
</style>
