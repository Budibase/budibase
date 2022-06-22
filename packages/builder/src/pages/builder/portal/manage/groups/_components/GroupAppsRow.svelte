<script>
  import { Icon, Body, StatusLight } from "@budibase/bbui"

  export let app
</script>

<div class="title">
  <div class="name app-icon" style="color: {app.icon?.color || ''}">
    <Icon size="XL" name={app.icon?.name || "Apps"} />
  </div>
</div>
<div class="desktop">
  <div class="name-content">
    <Body size="M">{app.name}</Body>
    <div class="access">
      <Body size="XS">{app.access}</Body>
    </div>
  </div>
</div>
<div class="desktop" />
<div class="apps">
  <StatusLight purple />
  <Body size="XS">{app.access}</Body>
</div>

<style>
  .name {
    grid-gap: var(--spacing-xl);
    grid-template-columns: 75px 75px;
    align-items: center;
  }
  .app-icon {
    display: flex;
    margin-left: var(--spacing-xl);
  }

  .apps {
    display: flex;
    align-items: baseline;
    margin-right: var(--spacing-xl);
  }

  .access {
    opacity: 0.5;
    margin: var(--spacing-xs) 0 0 var(--spacing-m);
  }

  .name-content {
    display: flex;
    align-items: center;
  }
  .name {
    text-decoration: none;
    overflow: hidden;
  }
  .name :global(.spectrum-Heading) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: calc(1.5 * var(--spacing-xl));
  }
  .title :global(h1:hover) {
    color: var(--spectrum-global-color-blue-600);
    cursor: pointer;
    transition: color 130ms ease;
  }

  @media (max-width: 640px) {
    .desktop {
      display: none !important;
    }
  }
</style>
