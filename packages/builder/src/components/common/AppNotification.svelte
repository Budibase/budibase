<script context="module">
  import UIKit from "uikit"

  export function showAppNotification({ message, status }) {
    UIKit.notification({
      message: `
          <div class="message-container">
            <i class="ri-information-fill information-icon"></i> 
            <span class="notification-message"> 
              ${message}
            </span>
            <button class="hoverable refresh-page-button" onclick="window.location.reload()">Refresh Page</button>
          </div>
        `,
      status,
      timeout: 100000
    })
  }
</script>

<style>
  :global(.information-icon) {
    font-size: 24px;
  }

  :global(.uk-nofi) {
    display: grid;
    grid-template-columns: 40px 1fr auto;
    grid-gap: 5px;
    align-items: center;
  }

  :global(.message-container) {
    display: grid;
    grid-template-columns: 40px 1fr auto;
    grid-gap: 5px;
    align-items: center;
  }

  :global(.uk-notification) {
    width: 50% !important;
    left: 0 !important;
    right: 0 !important;
    margin-right: auto !important;
    margin-left: auto !important;
    border-radius: 10px;
    box-shadow: 0px 3px 6px #00000029;
  }

  :global(.uk-notification-message) {
    border-radius: 5px;
  }

  :global(.uk-notification-message:hover .uk-notification-close) {
    visibility: hidden;
  }

  :global(.uk-notification-message-danger) {
    background: #f2545b !important;
    color: #fff !important;
    font-family: Roboto;
    font-size: 14px !important;
  }

  :global(.refresh-page-button) {
    font-size: 12px;
    font-weight: 600;
    border-radius: 5px;
    border: none;
    padding: 5px;
    width: 91px;
    height: 28px;
    color: #f2545b;
    background: #ffffff;
  }
</style>
