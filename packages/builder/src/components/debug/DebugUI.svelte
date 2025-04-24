<script lang="ts">
  import { API } from "@/api"
  import { ModalContent, notifications, Toggle } from "@budibase/bbui"
  import { featureFlags } from "@/stores/portal"
  import { auth } from "@/stores/portal"
  import { FeatureFlag } from "@budibase/types"

  async function setFlag(flag: string, value: boolean) {
    try {
      await API.overrideFeatureFlags({
        [flag]: value,
      })
      // The feature flag store is derived from the auth store, so we need to
      // refresh the auth store to update the feature flags.
      await auth.getSelf()
      notifications.success(`Feature flag ${flag} set to ${value}`)
    } catch (e) {
      console.error(e)
      notifications.error(
        `Failed to set feature flag ${flag} to ${value}, see console for details`
      )
    }
  }
</script>

<ModalContent
  title="Feature flags"
  showCancelButton={false}
  showConfirmButton={false}
  size="L"
>
  <div class="flags">
    {#each Object.entries($featureFlags) as [key, value]}
      <div class="item">
        <Toggle
          text={key}
          {value}
          disabled={key === FeatureFlag.DEBUG_UI}
          on:change={value => setFlag(key, value.detail)}
        />
      </div>
    {/each}
  </div>
</ModalContent>

<style>
  .flags {
    display: flex;
    flex-direction: column;
    font-size: 1.4rem;
  }

  .item {
    font-family: var(--font-mono);
  }
</style>
