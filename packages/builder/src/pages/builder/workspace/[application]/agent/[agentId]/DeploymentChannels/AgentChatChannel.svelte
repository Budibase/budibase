<script lang="ts">
  import { Body } from "@budibase/bbui"
  import BBAILogo from "assets/bb-ai.svg"
</script>

<div class="integration-row">
  <div class="channel-main">
    <img alt="Agent Chat" width="22px" height="22px" src={BBAILogo} />
    <div class="channel-details">
      <Body color={"var(--spectrum-global-color-gray-900)"} size="XS"
        >Agent Chat</Body
      >
      <Body color={"var(--spectrum-global-color-gray-700)"} size="XS"
        >An out-of-the-box chat application for AI agents</Body
      >
    </div>
  </div>
  <div class="row-action"></div>
</div>

<style>
  .integration-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--spacing-m);
    padding: var(--spacing-s) var(--spacing-s);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    height: 40px;
  }

  .channel-main {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    min-width: 0;
  }

  .channel-details {
    display: flex;
    flex-direction: column;
    margin-left: var(--spacing-m);
  }

  .row-action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-width: 110px;
    gap: 10px;
    margin-left: 0px;
  }
</style>
