<script context="module">
  import UIKit from "uikit"

  export function showAppNotification({ message, status }) {
    UIKit.notification({
      message: `
          <div class="message-container">
            <div class="information-icon">🤯</div> 
            <span class="notification-message"> 
              ${message}
            </span>
            <button class="hoverable refresh-page-button" onclick="window.location.reload()">Refresh Page</button>
          </div>
        `,
      status,
      timeout: 100000,
    })
  }
</script>

<style>
  :global(.information-icon) {
    font-size: 24px;
    margin-right: 8px;
  }

  :global(.uk-nofi) {
    display: grid;
    grid-template-columns: 40px 1fr auto;
    grid-gap: 5px;
    align-items: center;
  }

  :global(.message-container) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.uk-notification) {
    width: 50% !important;
    left: 0 !important;
    right: 0 !important;
    margin-right: auto !important;
    margin-left: auto !important;
    border-radius: 10px;
  }

  :global(.uk-notification-message) {
    border-radius: 5px;
  }

  :global(.uk-notification-message:hover .uk-notification-close) {
    visibility: hidden;
  }

  :global(.uk-notification-message-danger) {
    background: var(--grey-9) !important;
    color: #fff !important;
    font-size: 16px !important;
  }

  :global(.refresh-page-button) {
    font-size: 14px;
    border-radius: 3px;
    border: none;
    padding: 8px 16px;
    color: var(--ink);
    background: #ffffff;
    margin-left: 20px;
  }

  :global(.refresh-page-button):hover {
    background: var(--grey-1);
  }
</style>
