<script>
  import {
    AbsTooltip,
    Layout,
    Heading,
    Body,
    Button,
    Divider,
    Icon,
    Tags,
    Tag,
  } from "@budibase/bbui"
  import { auth, admin } from "@/stores/portal"

  export let title
  export let planType
  export let description
  export let enabled
  export let upgradeButtonClick

  $: upgradeDisabled = !$auth.accountPortalAccess && $admin.cloud
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <div class="title">
      <Heading size="M">{title}</Heading>
      {#if !enabled}
        <Tags>
          <Tag icon="LockClosed">{planType}</Tag>
        </Tags>
      {/if}
    </div>
    <Body>{description}</Body>
  </Layout>
  <Divider size="S" />

  {#if enabled}
    <slot />
  {:else}
    <div class="buttons">
      <Button
        primary={!upgradeDisabled}
        secondary={upgradeDisabled}
        disabled={upgradeDisabled}
        on:click={async () => upgradeButtonClick()}
      >
        Upgrade
      </Button>
      <!--Show the view plans button-->
      <Button
        secondary
        on:click={() => {
          window.open("https://budibase.com/pricing/", "_blank")
        }}
      >
        View Plans
      </Button>
      {#if upgradeDisabled}
        <AbsTooltip
          text={"Please contact the account holder to upgrade"}
          position={"right"}
        >
          <div class="icon" on:focus>
            <Icon name="InfoOutline" size="L" disabled hoverable />
          </div>
        </AbsTooltip>
      {/if}
    </div>
  {/if}
</Layout>

<style>
  .buttons {
    display: flex;
    gap: var(--spacing-l);
  }
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-m);
  }
  .icon {
    position: relative;
    display: flex;
    justify-content: center;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
  }
</style>
