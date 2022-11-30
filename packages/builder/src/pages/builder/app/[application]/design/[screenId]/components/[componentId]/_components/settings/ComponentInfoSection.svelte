<script>
  import { DetailSummary, Icon } from "@budibase/bbui"

  export let componentDefinition
</script>

<DetailSummary collapsible={false}>
  <div class="info">
    <div class="title">
      <Icon name="HelpOutline" />
      {componentDefinition.name}
    </div>
    {componentDefinition.info}
  </div>
</DetailSummary>

<style>
  .title {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: var(--spacing-m);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-s);
    color: var(--spectrum-global-color-gray-600);
  }
  .info {
    padding: var(--spacing-m) var(--spacing-l) var(--spacing-l) var(--spacing-l);
    background-color: var(--background-alt);
    border-radius: var(--border-radius-s);
    font-size: 13px;
  }
</style>
