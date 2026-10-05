<script lang="ts">
  import { Pagination } from "@budibase/bbui"

  let {
    label,
    page,
    hasPrevPage,
    hasNextPage,
    onPrevPage,
    onNextPage,
  }: {
    label: string
    page: number
    hasPrevPage: boolean
    hasNextPage: boolean
    onPrevPage: () => void
    onNextPage: () => void
  } = $props()
</script>

<div class="table-footer">
  <div class="footer-copy">{label}</div>

  {#if hasPrevPage || hasNextPage}
    <Pagination
      {page}
      goToPrevPage={onPrevPage}
      goToNextPage={onNextPage}
      {hasPrevPage}
      {hasNextPage}
    />
  {/if}
</div>

<style>
  .table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 26px 10px 0;
    gap: 16px;
  }

  .footer-copy {
    font-size: 13px;
    color: var(--spectrum-global-color-gray-700);
  }

  @media (max-width: 720px) {
    .table-footer {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
