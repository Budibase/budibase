<script lang="ts">
  import {
    Body,
    Heading,
    Layout,
    ModalContent,
    ProgressBar,
  } from "@budibase/bbui"

  interface Props {
    usage: { name: string; used: number; total: number }
    breakdown?: Array<{ name: string; used: number }>
  }

  let { usage, breakdown = [] }: Props = $props()

  const getPercentage = (used: number) => {
    if (!usage?.total || usage.total <= 0) {
      return 0
    }
    return Math.min((used / usage.total) * 100, 100)
  }
</script>

<ModalContent
  title="Actions breakdown"
  size="M"
  showCancelButton={false}
  showConfirmButton={false}
>
  <Layout noPadding gap="L">
    <div class="total">
      <Body size="S" color="var(--spectrum-global-color-gray-700)">
        Total: <strong
          >{usage?.used?.toLocaleString()} / {usage?.total?.toLocaleString()}</strong
        >
      </Body>
    </div>
    <Layout noPadding gap="M">
      {#each breakdown as item}
        <div class="breakdown-item">
          <div class="breakdown-header">
            <Heading size="XS" weight="light">{item.name}</Heading>
            <Body size="S">{item.used.toLocaleString()}</Body>
          </div>
          <ProgressBar
            width={"100%"}
            duration={1}
            value={getPercentage(item.used)}
          />
          <Body size="S" color="var(--spectrum-global-color-gray-600)">
            {getPercentage(item.used).toFixed(1)}% of monthly limit
          </Body>
        </div>
      {/each}
    </Layout>
  </Layout>
</ModalContent>

<style>
  .total {
    padding-bottom: 8px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .breakdown-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .breakdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
