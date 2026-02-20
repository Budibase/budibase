<script>
  import { Heading, Body } from "@budibase/bbui"
</script>

<div class="chat-paused-shell">
  <div class="chat-paused-nav" aria-hidden="true">
    <div class="chat-paused-nav-header">
      <div class="chat-paused-line chat-paused-line-title"></div>
      <div class="chat-paused-line chat-paused-line-subtitle"></div>
    </div>
    <div class="chat-paused-nav-items">
      <div class="chat-paused-item"></div>
      <div class="chat-paused-item"></div>
      <div class="chat-paused-item"></div>
      <div class="chat-paused-item"></div>
    </div>
  </div>

  <div class="chat-paused-main">
    <div class="chat-paused-main-header">
      <div class="chat-paused-line chat-paused-line-agent"></div>
      <div class="chat-paused-badge">Paused</div>
    </div>

    <div class="chat-paused-content">
      <Heading size="M">Chat is paused</Heading>
      <Body size="S">
        This chat app is currently unavailable. Ask your administrator to set
        chat live.
      </Body>
    </div>

    <div class="chat-paused-input">
      <Body size="S">Chat is paused.</Body>
    </div>
  </div>
</div>

<style>
  .chat-paused-shell {
    display: flex;
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    min-height: 0;
    background: transparent;
  }

  .chat-paused-nav {
    width: 340px;
    min-width: 340px;
    border-right: var(--border-light);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
  }

  .chat-paused-nav-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .chat-paused-nav-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .chat-paused-item {
    height: 44px;
    border-radius: 10px;
    background: var(--spectrum-global-color-gray-100);
    border: 1px solid var(--spectrum-global-color-gray-200);
  }

  .chat-paused-main {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 0 32px 32px;
    box-sizing: border-box;
  }

  .chat-paused-main-header {
    width: 100%;
    padding: var(--spacing-l) 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    border-bottom: var(--border-light);
  }

  .chat-paused-line {
    border-radius: 999px;
    background: var(--spectrum-global-color-gray-200);
  }

  .chat-paused-line-title {
    width: 140px;
    height: 14px;
  }

  .chat-paused-line-subtitle {
    width: 92px;
    height: 10px;
  }

  .chat-paused-line-agent {
    width: 120px;
    height: 14px;
  }

  .chat-paused-badge {
    border-radius: 999px;
    border: 1px solid var(--spectrum-global-color-red-300);
    color: var(--spectrum-global-color-red-700);
    background: var(--spectrum-global-color-red-100);
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    padding: 6px 10px;
  }

  .chat-paused-content {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-s);
    text-align: center;
    padding: var(--spacing-xxl) var(--spacing-xl);
  }

  .chat-paused-input {
    border: var(--border-light);
    border-radius: 12px;
    min-height: 52px;
    display: flex;
    align-items: center;
    padding: 0 var(--spacing-l);
    background: var(--spectrum-alias-background-color-secondary);
  }

  @media (max-width: 1000px) {
    .chat-paused-shell {
      flex-direction: column;
    }

    .chat-paused-nav {
      width: 100%;
      min-width: 100%;
      border-right: 0;
      border-bottom: var(--border-light);
    }

    .chat-paused-main {
      padding: 0 var(--spacing-l) var(--spacing-l);
    }
  }
</style>
