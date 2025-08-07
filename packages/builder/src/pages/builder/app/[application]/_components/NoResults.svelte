<script lang="ts">
  import { Button, Icon, Layout } from "@budibase/bbui"

  /* eslint-disable no-unused-vars */
  enum IconColor {
    Blue = "blue",
    Orange = "orange",
  }
  /* eslint-enable no-unused-vars */

  export let onCtaClick: () => void
  export let ctaText: string
  export let iconColor: `${IconColor}`
</script>

<Layout alignContent="center" justifyItems="center">
  <div
    class="icon-container"
    class:blue={iconColor === IconColor.Blue}
    class:orange={iconColor === IconColor.Orange}
  >
    <Icon
      name="path"
      size="M"
      color="var(--spectrum-global-color-static-gray-50)"
    />
  </div>
  <slot />

  <Button cta on:click={onCtaClick}>{ctaText}</Button>
</Layout>

<style>
  .icon-container {
    margin-top: 80px;
    padding: 4px;
    border-radius: 8px;
  }
  .icon-container.blue {
    background-color: #215f9e;
    border: 0.5px solid #467db4;
  }
  .icon-container.orange {
    border: 0.5px solid #c96442;
    background: #aa4321;
  }
</style>
