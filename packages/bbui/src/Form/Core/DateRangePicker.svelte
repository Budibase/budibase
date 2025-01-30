<script>
  import CoreDatePicker from "./DatePicker/DatePicker.svelte"
  import Icon from "../../Icon/Icon.svelte"

  let fromDate
  let toDate
</script>

<div class="date-range">
  <CoreDatePicker
    value={fromDate}
    on:change={e => (fromDate = e.detail)}
    enableTime={false}
  />
  <div class="arrow">
    <Icon name="ChevronRight" />
  </div>
  <CoreDatePicker
    value={toDate}
    on:change={e => (toDate = e.detail)}
    enableTime={false}
  />
</div>

<style>
  .date-range {
    display: flex;
    flex-direction: row;
    border: 1px solid var(--spectrum-alias-border-color);
    border-radius: 4px;
  }
  .date-range :global(.spectrum-InputGroup),
  .date-range :global(.spectrum-Textfield),
  .date-range :global(input) {
    min-width: 0 !important;
    width: 150px !important;
  }
  .date-range :global(input) {
    border: none;
    text-align: center;
  }
  .date-range :global(button) {
    display: none;
  }
  .date-range :global(> :first-child input),
  .date-range :global(> :first-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .date-range :global(> :last-child input),
  .date-range :global(> :last-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .arrow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 1;
  }
</style>
