<script>
  import { Popover, Layout, Heading, Body, Button, Link } from "@budibase/bbui"
  import { store } from "builderStore"
  import { TOURS } from "./tours.js"
  import { goto, layout, isActive } from "@roxi/routify"

  let popoverAnchor
  let popover
  let tourSteps = null
  let tourStep
  let tourStepIdx
  let lastStep
  let skipping = false

  $: tourNodes = { ...$store.tourNodes }
  $: tourKey = $store.tourKey
  $: tourStepKey = $store.tourStepKey
  $: tour = TOURS[tourKey]
  $: tourOnSkip = tour?.onSkip

  const updateTourStep = (targetStepKey, tourKey) => {
    if (!tourKey) {
      return
    }
    if (!tourSteps?.length) {
      tourSteps = [...tour.steps]
    }
    tourStepIdx = getCurrentStepIdx(tourSteps, targetStepKey)
    lastStep = tourStepIdx + 1 == tourSteps.length
    tourStep = { ...tourSteps[tourStepIdx] }
    tourStep.onLoad()
  }

  $: updateTourStep(tourStepKey, tourKey)

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
      if (tour.endRoute) {
        $goto(tour.endRoute)
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
            {#if tourSteps?.length > 1}
              <div>{`${tourStepIdx + 1}/${tourSteps?.length}`}</div>
            {/if}
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
              {#if typeof tourOnSkip === "function"}
                <Link
                  secondary
                  quiet
                  on:click={() => {
                    skipping = true
                    tourOnSkip()
                    if (tour.endRoute) {
                      $goto(tour.endRoute)
                    }
                  }}
                  disabled={skipping}
                >
                  Skip
                </Link>
              {/if}
              <Button cta on:click={nextStep} disabled={skipping}>
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
    grid-gap: var(--spacing-xl);
    display: flex;
    justify-content: end;
    align-items: center;
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
