<script lang="ts">
  import {
    AbsTooltip,
    Layout,
    Body,
    Button,
    Divider,
    Icon,
    Tags,
    Tag,
    TooltipPosition,
    Heading,
  } from "@budibase/bbui"
  import { auth } from "@/stores/portal/auth"
  import { admin } from "@/stores/portal/admin"

  export let planType: string | undefined = undefined
  export let description: string | undefined = undefined
  export let title: string | undefined = undefined
  export let enabled: boolean = false
  export let upgradeButtonClick: Function = () => {}
  export let showContentWhenDisabled: boolean = false

  $: upgradeDisabled = !$auth.accountPortalAccess && $admin.cloud
</script>

<Layout noPadding gap="S">
  {#if !enabled}
    <Layout gap="S" noPadding>
      <div class="title">
        {#if title}
          <Heading size="XS">{title}</Heading>
        {/if}
        <Tags>
          <Tag icon="lock" emphasized>{planType}</Tag>
        </Tags>
      </div>

      {#if description}
        <Body size="S">{description}</Body>
      {/if}

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
            position={TooltipPosition.Right}
          >
            <div class="icon" on:focus>
              <Icon name="info" size="L" disabled hoverable />
            </div>
          </AbsTooltip>
        {/if}
      </div>

      {#if showContentWhenDisabled}
        <Divider noMargin />
      {/if}
    </Layout>
  {/if}

  {#if enabled || showContentWhenDisabled}
    <slot />
  {/if}
</Layout>

<style>
  .buttons {
    display: flex;
    gap: var(--spacing-l);
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
  .title {
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
  }
</style>
