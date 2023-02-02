<script>
  import { Popover, Layout, Heading, Body, Button } from "@budibase/bbui"
  import { store } from "builderStore"
  import { TOURS } from "./tours.js"
  import { goto, layout, isActive } from "@roxi/routify"

  let popoverAnchor
  let popover
  let tourSteps = null
  let tourStep
  let tourStepIdx
  let lastStep

  $: tourNodes = { ...$store.tourNodes }
  $: tourKey = $store.tourKey
  $: tourStepKey = $store.tourStepKey

  const initTour = targetKey => {
    if (!targetKey) {
      return
    }
    tourSteps = [...TOURS[targetKey]]
    tourStepIdx = 0
    tourStep = { ...tourSteps[tourStepIdx] }
  }

  $: initTour(tourKey)

  const updateTourStep = targetStepKey => {
    if (!tourSteps?.length) {
      return
    }
    tourStepIdx = getCurrentStepIdx(tourSteps, targetStepKey)
    lastStep = tourStepIdx + 1 == tourSteps.length
    tourStep = { ...tourSteps[tourStepIdx] }
    tourStep.onLoad()
  }

  $: updateTourStep(tourStepKey)

  const showPopover = (tourStep, tourNodes, popover) => {
    if (!tourStep) {
      return
    }
    popoverAnchor = tourNodes[tourStep.id]
    popover?.show()
  }

  $: showPopover(tourStep, tourNodes, popover)

  const navigateStep = step => {
    if (step.route) {
      const activeNav = $layout.children.find(c => $isActive(c.path))
      if (activeNav) {
        store.update(state => {
          if (!state.previousTopNavPath) state.previousTopNavPath = {}
          state.previousTopNavPath[activeNav.path] = window.location.pathname
          $goto(state.previousTopNavPath[step.route] || step.route)
          return state
        })
      }
    }
  }

  const nextStep = async () => {
    if (!lastStep === true) {
      let target = tourSteps[tourStepIdx + 1]
      if (target) {
        store.update(state => ({
          ...state,
          tourStepKey: target.id,
        }))
        navigateStep(target)
      } else {
        console.log("Could not retrieve step")
      }
    } else {
      if (typeof tourStep.onComplete === "function") {
        tourStep.onComplete()
      }
      popover.hide()
    }
  }

  const previousStep = async () => {
    if (tourStepIdx > 0) {
      let target = tourSteps[tourStepIdx - 1]
      if (target) {
        store.update(state => ({
          ...state,
          tourStepKey: target.id,
        }))
        navigateStep(target)
      } else {
        console.log("Could not retrieve step")
      }
    }
  }

  const getCurrentStepIdx = (steps, tourStepKey) => {
    if (!steps?.length) {
      return
    }
    if (steps?.length && !tourStepKey) {
      return 0
    }
    return steps.findIndex(step => step.id === tourStepKey)
  }
</script>

{#if tourKey}
  {#key tourStepKey}
    <Popover
      align={tourStep?.align}
      bind:this={popover}
      anchor={popoverAnchor}
      maxWidth={300}
      dismissible={false}
      offset={15}
    >
      <div class="tour-content">
        <Layout noPadding gap="M">
          <div class="tour-header">
            <Heading size="XS">{tourStep?.title || "-"}</Heading>
            <div>{`${tourStepIdx + 1}/${tourSteps?.length}`}</div>
          </div>
          <Body size="S">
            <span class="tour-body">
              {#if tourStep.layout}
                <svelte:component this={tourStep.layout} />
              {:else}
                {tourStep?.body || ""}
              {/if}
            </span>
          </Body>
          <div class="tour-footer">
            <div class="tour-navigation">
              {#if tourStepIdx > 0}
                <Button
                  secondary
                  on:click={previousStep}
                  disabled={tourStepIdx == 0}
                >
                  <div>Back</div>
                </Button>
              {/if}
              <Button cta on:click={nextStep}>
                <div>{lastStep ? "Finish" : "Next"}</div>
              </Button>
            </div>
          </div>
        </Layout>
      </div>
    </Popover>
  {/key}
{/if}

<style>
  .tour-content {
    padding: var(--spacing-xl);
  }
  .tour-navigation {
    grid-gap: var(--spectrum-alias-grid-baseline);
    display: flex;
    justify-content: end;
  }
  .tour-body :global(.feature-list) {
    margin-bottom: 0px;
    padding-left: var(--spacing-xl);
  }
  .tour-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
