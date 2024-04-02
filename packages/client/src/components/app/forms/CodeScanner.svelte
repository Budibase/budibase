<script>
  import {
    ModalContent,
    Modal,
    Icon,
    ActionButton,
    Input,
    Button,
    StatusLight,
  } from "@budibase/bbui"
  import { Html5Qrcode } from "html5-qrcode"
  import { createEventDispatcher } from "svelte"

  export let value
  export let disabled = false
  export let allowManualEntry = false
  export let autoConfirm = false
  export let scanButtonText = "Scan code"
  export let beepOnScan = false
  export let beepFrequency = 2637
  export let customFrequency = 1046
  export let preferredCamera = "environment"
  export let validator

  const dispatch = createEventDispatcher()

  let videoEle
  let camModal
  let manualMode = false
  let cameraEnabled
  let cameraStarted = false
  let html5QrCode
  let cameraSetting = { facingMode: preferredCamera }
  let cameraConfig = {
    fps: 25,
    qrbox: { width: 250, height: 250 },
  }
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

  const onScanSuccess = decodedText => {
    if (value != decodedText) {
      if (beepOnScan) {
        beep()
      }
      dispatch("change", decodedText)
      if (autoConfirm && !validator?.(decodedText)) {
        camModal?.hide()
      }
    }
  }

  const initReader = async () => {
    if (html5QrCode) {
      html5QrCode.stop()
    }
    html5QrCode = new Html5Qrcode("reader")
    return new Promise(resolve => {
      html5QrCode
        .start(cameraSetting, cameraConfig, onScanSuccess)
        .then(() => {
          resolve({ initialised: true })
        })
        .catch(err => {
          console.error("There was a problem scanning the image", err)
          resolve({ initialised: false })
        })
    })
  }

  const checkCamera = async () => {
    return new Promise(resolve => {
      Html5Qrcode.getCameras()
        .then(devices => {
          if (devices && devices.length) {
            resolve({ enabled: true })
          }
        })
        .catch(e => {
          console.error(e)
          resolve({ enabled: false })
        })
    })
  }

  const start = async () => {
    const status = await initReader()
    cameraStarted = status.initialised
  }

  $: if (cameraEnabled && videoEle && !cameraStarted) {
    start()
  }

  const showReaderModal = async () => {
    camModal.show()
    const camStatus = await checkCamera()
    cameraEnabled = camStatus.enabled
  }

  const hideReaderModal = async () => {
    cameraEnabled = undefined
    cameraStarted = false
    if (html5QrCode) {
      await html5QrCode.stop()
      html5QrCode = undefined
    }
    camModal.hide()
  }

  const beep = () => {
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    const frequency =
      beepFrequency === "custom" ? customFrequency : beepFrequency
    oscillator.frequency.value = frequency
    oscillator.type = "square"

    const duration = 420
    const endTime = audioCtx.currentTime + duration / 1000
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, endTime)

    oscillator.start()
    oscillator.stop(endTime)
  }
</script>

<div class="scanner-video-wrapper">
  {#if value && !manualMode}
    <div class="scanner-value field-display">
      {#if validator?.(value)}
        <StatusLight negative />
      {:else}
        <StatusLight positive />
      {/if}
      {value}
    </div>
  {/if}

  {#if allowManualEntry && manualMode}
    <div class="manual-input">
      <Input
        bind:value
        updateOnChange={false}
        on:change={() => {
          dispatch("change", value)
        }}
      />
    </div>
  {/if}

  {#if value}
    <ActionButton
      on:click={() => {
        dispatch("change", "")
      }}
      {disabled}
    >
      Clear
    </ActionButton>
  {:else}
    <ActionButton
      icon="Camera"
      on:click={() => {
        showReaderModal()
      }}
      {disabled}
    >
      {scanButtonText}
    </ActionButton>
  {/if}
</div>

<div class="modal-wrap">
  <Modal bind:this={camModal} on:hide={hideReaderModal}>
    <ModalContent
      title={scanButtonText}
      showConfirmButton={false}
      showCancelButton={false}
    >
      <div id="reader" class="container" bind:this={videoEle}>
        <div class="camera-placeholder">
          <Icon size="XXL" name="Camera" />
          {#if cameraEnabled === false}
            <div>Your camera is disabled.</div>
          {/if}
        </div>
      </div>
      {#if cameraEnabled === true}
        <div class="code-wrap">
          {#if value && !validator?.(value)}
            <div class="scanner-value">
              <StatusLight positive />
              {value}
            </div>
          {:else if value && validator?.(value)}
            <div class="scanner-value">
              <StatusLight negative />
              {value}
            </div>
          {:else}
            <div class="scanner-value">
              <StatusLight neutral />
              Searching for code...
            </div>
          {/if}
        </div>
      {/if}

      <div slot="footer">
        <div class="footer-buttons">
          {#if allowManualEntry && !manualMode}
            <Button
              group
              secondary
              newStyles
              on:click={() => {
                manualMode = true
                camModal.hide()
              }}
            >
              Enter manually
            </Button>
          {/if}

          <Button
            group
            cta
            on:click={() => {
              camModal.hide()
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </ModalContent>
  </Modal>
</div>

<style>
  #reader :global(video) {
    border-radius: 4px;
    border: 2px solid var(--spectrum-global-color-gray-300);
    overflow: hidden;
  }
  .field-display :global(.spectrum-Tags-item) {
    margin: 0px;
  }
  .footer-buttons {
    display: flex;
    grid-area: buttonGroup;
    gap: var(--spectrum-global-dimension-static-size-200);
  }
  .scanner-value {
    display: flex;
  }
  .field-display {
    padding-top: var(
      --spectrum-fieldlabel-side-m-padding-top,
      var(--spectrum-global-dimension-size-100)
    );
    margin-bottom: var(--spacing-m);
  }
  .camera-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    border: 2px solid var(--spectrum-global-color-gray-300);
    background-color: var(--spectrum-global-color-gray-200);
    flex-direction: column;
    gap: var(--spectrum-global-dimension-static-size-200);
  }
  .container,
  .camera-placeholder {
    width: 100%;
    min-height: 240px;
  }
  .manual-input {
    padding-bottom: var(--spacing-m);
  }
</style>
