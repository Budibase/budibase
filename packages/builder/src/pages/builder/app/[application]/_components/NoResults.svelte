<script lang="ts">
  import { Button, Icon, Layout } from "@budibase/bbui"

  export let onCtaClick: () => void
  export let ctaText: string
</script>

<Layout alignContent="center" justifyItems="center">
  <div class="icon-container">
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
    background-color: #215f9e;
    border: 0.5px solid #467db4;
    padding: 4px;
    border-radius: 8px;
  }
</style>
