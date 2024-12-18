<script>
  import { Popover, Layout, Heading, Body, Button, Link } from "@budibase/bbui"
  import { TOURS, getCurrentStepIdx } from "./tours.js"
  import { goto, layout, isActive } from "@roxi/routify"
  import { builderStore } from "@/stores/builder"

  let popoverAnchor
  let popover
  let tourSteps = null
  let tourStep
  let tourStepIdx
  let lastStep
  let skipping = false

  $: tourNodes = { ...$builderStore.tourNodes }
  $: tourKey = $builderStore.tourKey
  $: tourStepKey = $builderStore.tourStepKey
  $: tour = TOURS[tourKey]
  $: tourOnSkip = tour?.onSkip

  const updateTourStep = (targetStepKey, tourKey) => {
    if (!tourKey) {
      tourSteps = null
      tourStepIdx = null
      lastStep = null
      tourStep = null
      popoverAnchor = null
      popover = null
      skipping = false
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
        builderStore.setPreviousTopNavPath(
          activeNav.path,
          window.location.pathname
        )
        $goto($builderStore.previousTopNavPath[step.route] || step.route)
      }
    }
  }

  const nextStep = async () => {
    if (!lastStep === true) {
      let target = tourSteps[tourStepIdx + 1]
      if (target) {
        builderStore.update(state => ({
          ...state,
          tourStepKey: target.id,
        }))
        navigateStep(target)
      } else {
        console.warn("Could not retrieve step")
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
</script>

{#if tourKey}
  {#key tourStepKey}
    <Popover
      align={tourStep?.align}
      bind:this={popover}
      anchor={popoverAnchor}
      maxWidth={300}
      dismissible={false}
      offset={12}
      handlePostionUpdate={tourStep?.positionHandler}
      customZindex={3}
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
              {#if typeof tourOnSkip === "function" && !lastStep}
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
