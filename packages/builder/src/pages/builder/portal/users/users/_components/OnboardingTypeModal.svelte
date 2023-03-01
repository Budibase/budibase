<script>
  import { ModalContent, Body, Layout, Icon } from "@budibase/bbui"
  import { OnboardingType } from "../../../../../../constants"

  export let chooseCreationType

  let selectedOnboardingType
</script>

<ModalContent
  size="M"
  title="Choose your onboarding"
  confirmText="Done"
  cancelText="Cancel"
  showCloseIcon={false}
  onConfirm={() => chooseCreationType(selectedOnboardingType)}
  disabled={!selectedOnboardingType}
>
  <Layout noPadding gap="S">
    <div
      class="onboarding-type item"
      class:selected={selectedOnboardingType == OnboardingType.EMAIL}
      on:click={() => {
        selectedOnboardingType = OnboardingType.EMAIL
      }}
    >
      <div class="content onboarding-type-wrap">
        <Icon name="WebPage" />
        <div class="onboarding-type-text">
          <Body size="S">Send email invites</Body>
        </div>
      </div>
      <div style="color: var(--spectrum-global-color-green-600); float: right">
        {#if selectedOnboardingType == OnboardingType.EMAIL}
          <div class="checkmark-spacing">
            <Icon size="S" name="CheckmarkCircle" />
          </div>
        {/if}
      </div>
    </div>

    <div
      class="onboarding-type item"
      class:selected={selectedOnboardingType == OnboardingType.PASSWORD}
      on:click={() => {
        selectedOnboardingType = OnboardingType.PASSWORD
      }}
    >
      <div class="content onboarding-type-wrap">
        <Icon name="Key" />
        <div class="onboarding-type-text">
          <Body size="S">Generate passwords for each user</Body>
        </div>
      </div>
      <div style="color: var(--spectrum-global-color-green-600); float: right">
        {#if selectedOnboardingType == OnboardingType.PASSWORD}
          <div class="checkmark-spacing">
            <Icon size="S" name="CheckmarkCircle" />
          </div>
        {/if}
      </div>
    </div>
  </Layout>
</ModalContent>

<style>
  .onboarding-type.item {
    padding: var(--spectrum-alias-item-padding-xl);
  }
  .onboarding-type-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .checkmark-spacing {
    margin-right: var(--spacing-m);
  }
  .content {
    letter-spacing: 0px;
  }
  .item {
    cursor: pointer;
    grid-gap: var(--spectrum-alias-grid-margin-xsmall);
    padding: var(--spectrum-alias-item-padding-s);
    background: var(--spectrum-alias-background-color-primary);
    transition: 0.3s all;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    border-width: 1px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .item:hover,
  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }
  .onboarding-type-wrap .onboarding-type-text {
    padding-left: var(--spectrum-alias-item-padding-xl);
  }
  .onboarding-type-wrap :global(.spectrum-Icon) {
    min-width: var(--spectrum-icon-size-m);
  }
  .onboarding-type-wrap :global(.spectrum-Heading) {
    padding-bottom: var(--spectrum-alias-item-padding-s);
  }
</style>
