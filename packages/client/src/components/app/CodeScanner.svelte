<script>
  import { ModalContent, Modal, Select } from "@budibase/bbui"
  import { Input, Button, StatusLight } from "@budibase/bbui"
  import { Html5Qrcode } from "html5-qrcode"

  export let code = ""

  let videoEle
  let camModal
  let manualMode = false
  let enabled = false
  let cameraInit = false
  let html5QrCode
  let cameraId
  let cameraDevices = []
  let selectedCam

  const checkCamera = async () => {
    return new Promise(resolve => {
      Html5Qrcode.getCameras()
        .then(devices => {
          if (devices && devices.length) {
            cameraDevices = devices
            cameraId = devices[0].id
            resolve({ enabled: true })
          }
        })
        .catch(() => {
          resolve({ enabled: false })
        })
    })
  }

  $: if (enabled && videoEle && !cameraInit) {
    html5QrCode = new Html5Qrcode("reader")
    html5QrCode
      .start(
        cameraId,
        {
          fps: 25,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText, decodedResult) => {
          code = decodedText
          console.log(decodedText, decodedResult)
        }
      )
      .catch(err => {
        console.log("There was a problem scanning the image", err)
      })
  }

  const showReaderModal = async () => {
    camModal.show()
    const camStatus = await checkCamera()
    enabled = camStatus.enabled
  }

  const hideReaderModal = async () => {
    camModal.hide()
    await html5QrCode.stop()
  }
</script>

<div class="scanner-video-wrapper">
  {#if code}
    <div class="scanner-value">
      <StatusLight positive />
      {code}
    </div>
  {/if}
  <Button primary icon="Camera" on:click={showReaderModal}>Scan Code</Button>
</div>

<div class="modal-wrap">
  <Select
    on:change={e => console.log(e)}
    value={selectedCam}
    options={cameraDevices}
    getOptionLabel={() => cameraDevices}
  />

  <Modal bind:this={camModal} on:hide={hideReaderModal}>
    <ModalContent
      title="Scan Code"
      showCancelButton={false}
      showConfirmButton={false}
    >
      <div id="reader" bind:this={videoEle} />
      <div class="code-wrap">
        {#if manualMode}
          <Input label="Enter" bind:value={code} />
        {/if}
        {#if code}
          <div class="scanner-value">
            <StatusLight positive />
            {code}
          </div>
        {/if}
        {#if !code && enabled && videoEle && cameraInit}
          <div class="scanner-value">
            <StatusLight neutral />
            Searching for code...
          </div>
        {/if}
      </div>
      <div slot="footer">
        <div class="footer-buttons">
          <Button
            group
            secondary
            newStyles
            on:click={() => {
              manualMode = !manualMode
            }}
          >
            Enter Manually
          </Button>

          <Button group cta disabled={!code}>Confirm</Button>
        </div>
      </div>
    </ModalContent>
  </Modal>
</div>

<style>
  .footer-buttons {
    display: flex;
    grid-area: buttonGroup;
    gap: var(--spectrum-global-dimension-static-size-200);
  }
  .scanner-value {
    padding-top: var(
      --spectrum-fieldlabel-side-m-padding-top,
      var(--spectrum-global-dimension-size-100)
    );
    display: flex;
    margin-bottom: var(--spacing-m);
  }
</style>
