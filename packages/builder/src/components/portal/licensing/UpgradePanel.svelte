<script>
  import { Layout, Body, Button } from "@budibase/bbui"
  import { auth, admin as adminStore, licensing } from "stores/portal"
</script>

{#if $licensing.isFreePlan}
  <div class="upgrade">
    <Layout gap="S" justifyItems="center">
      <div>
        <Body size="S">Get more usage &</Body>
        <Body size="S">premium features</Body>
      </div>

      <Button cta on:click={$licensing.goToUpgradePage}>
        {#if $adminStore.cloud}
          {$auth.accountPortalAccess ? "Upgrade" : "View plans"}
        {:else}
          View plans
        {/if}
      </Button>
    </Layout>
  </div>
{:else if $licensing.isTrialing}
  <div class="upgrade">
    <Layout gap="S" justifyItems="center">
      <div>
        <Body size="S">{$licensing.planName} Trial</Body>
        <Body size="S" weight="bold"
          >{$licensing.trialDaysRemaining} days remaining</Body
        >
      </div>

      {#if $auth.accountPortalAccess}
        <Button cta on:click={$licensing.goToUpgradePage}>Upgrade Now</Button>
      {/if}
    </Layout>
  </div>
{/if}

<style>
  .upgrade {
    background-color: var(--background-alt);
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    margin: 20px;
    padding: 10px;
    text-align: center;
  }
</style>
