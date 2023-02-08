<script>
  import {
    Detail,
    Button,
    Heading,
    Layout,
    Body,
    TooltipWrapper,
  } from "@budibase/bbui"

  export let description = ""
  export let title = ""
  export let primaryAction
  export let secondaryAction
  export let primaryActionText
  export let secondaryActionText
  export let primaryCta = true
  export let textRows = []

  $: primaryDefined = primaryAction && primaryActionText
  $: secondaryDefined = secondaryAction && secondaryActionText
</script>

<div class="dash-card">
  <div class="dash-card-header">
    <div class="header-info">
      <Layout gap="XS">
        <div class="dash-card-title">
          <Detail size="M">{description}</Detail>
        </div>
        <Heading size="M">{title}</Heading>
        {#if textRows.length}
          <div class="text-rows">
            {#each textRows as row}
              {#if row.tooltip}
                <TooltipWrapper tooltip={row.tooltip}>
                  <Body>{row.message}</Body>
                </TooltipWrapper>
              {:else}
                <Body>{row.message}</Body>
              {/if}
            {/each}
          </div>
        {/if}
      </Layout>
    </div>
    <div class="header-actions">
      {#if secondaryDefined}
        <div>
          <Button secondary on:click={secondaryAction}
            >{secondaryActionText}</Button
          >
        </div>
      {/if}
      {#if primaryDefined}
        <div class="primary-button">
          <Button cta={primaryCta} on:click={primaryAction}
            >{primaryActionText}</Button
          >
        </div>
      {/if}
    </div>
  </div>
  <div class="dash-card-body">
    <slot />
  </div>
</div>

<style>
  .dash-card {
    background: var(--spectrum-alias-background-color-primary);
    border-radius: var(--border-radius-s);
    overflow: hidden;
    min-height: 150px;
  }
  .dash-card-header {
    padding: 15px 25px 20px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .dash-card-body {
    padding: 25px 30px;
  }
  .dash-card-title :global(.spectrum-Detail) {
    color: var(
      --spectrum-sidenav-heading-text-color,
      var(--spectrum-global-color-gray-700)
    );
    display: inline-block;
  }
  .header-info {
    flex: 1;
  }
  .header-actions {
    flex: 1;
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .header-actions :global(:first-child) {
    margin-right: 5px;
  }
  .text-rows {
    margin-top: 10px;
  }

  @media only screen and (max-width: 900px) {
    .dash-card-header {
      flex-direction: column;
    }

    .header-actions {
      justify-content: flex-start "bul";
    }
  }
</style>
