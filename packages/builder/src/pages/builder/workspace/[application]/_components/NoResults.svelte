<script lang="ts">
  import { Button, Icon, Layout } from "@budibase/bbui"

  /* eslint-disable no-unused-vars */
  enum ResourceType {
    App = "app",
    Automation = "automation",
    Agent = "agent",
  }
  /* eslint-enable no-unused-vars */

  export let onCtaClick: () => void
  export let ctaText: string
  export let resourceType: `${ResourceType}`
  export let hideCta: boolean = false

  const iconByType = {
    [ResourceType.App]: "browser",
    [ResourceType.Automation]: "path",
    [ResourceType.Agent]: "cpu",
  }
</script>

<Layout alignContent="center" justifyItems="center">
  <div
    class="icon-container"
    class:automation={resourceType === ResourceType.Automation}
    class:app={resourceType === ResourceType.App}
    class:agent={resourceType === ResourceType.Agent}
  >
    <Icon
      name={iconByType[resourceType]}
      size="M"
      color="var(--spectrum-global-color-static-gray-50)"
    />
  </div>
  <slot />

  {#if !hideCta}
    <Button cta on:click={onCtaClick}>{ctaText}</Button>
  {/if}
</Layout>

<style>
  .icon-container {
    margin-top: 80px;
    padding: 4px;
    border-radius: 8px;
  }
  .icon-container.automation {
    background-color: #215f9e;
    border: 0.5px solid #467db4;
  }
  .icon-container.app {
    border: 0.5px solid #c96442;
    background: #aa4321;
  }

  .icon-container.agent {
    border: 0.5px solid #e9e6ff;
    background: #806fde;
  }
</style>
