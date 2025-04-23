import { get } from "svelte/store"
import { builderStore } from "@/stores/builder"
import { auth } from "@/stores/portal"
import analytics, { EventSource } from "@/analytics"
import { NewViewUpdateFormRowId, NewFormSteps } from "./steps"
import { API } from "@/api"

const ONBOARDING_EVENT_PREFIX = "onboarding"

export const TOUR_STEP_KEYS = {
  BUILDER_FORM_CREATE_STEPS: "builder-form-create-steps",
  BUILDER_FORM_VIEW_UPDATE_STEPS: "builder-form-view-update-steps",
  BUILDER_FORM_ROW_ID: "builder-form-row-id",
}

export const TOUR_KEYS = {
  BUILDER_FORM_CREATE: "builder-form-create",
  BUILDER_FORM_VIEW_UPDATE: "builder-form-view-update",
}

export const getCurrentStepIdx = (steps, tourStepKey) => {
  if (!steps?.length) {
    return
  }
  if (steps?.length && !tourStepKey) {
    return 0
  }
  return steps.findIndex(step => step.id === tourStepKey)
}

const endTour = async ({ key, skipped = false } = {}) => {
  const { tours = {} } = get(auth).user
  tours[key] = new Date().toISOString()

  await API.updateSelf({
    tours,
  })

  if (skipped) {
    tourEvent(key, skipped)
  }

  // Update the cached user
  await auth.getSelf()

  // Reset tour state
  builderStore.setTour()
}

const tourEvent = (eventKey, skipped) => {
  analytics.captureEvent(`${ONBOARDING_EVENT_PREFIX}:${eventKey}`, {
    eventSource: EventSource.PORTAL,
    skipped,
  })
}

const getTours = () => {
  return {
    [TOUR_KEYS.BUILDER_FORM_CREATE]: {
      steps: [
        {
          id: TOUR_STEP_KEYS.BUILDER_FORM_CREATE_STEPS,
          title: "Add multiple steps",
          layout: NewFormSteps,
          query: "#steps-prop-control-wrap",
          onComplete: () => {
            builderStore.highlightSetting()
            endTour({ key: TOUR_KEYS.BUILDER_FORM_CREATE })
          },
          onLoad: () => {
            tourEvent(TOUR_STEP_KEYS.BUILDER_FORM_CREATE_STEPS)
            builderStore.highlightSetting("steps", "info")
          },
          align: "left-outside",
        },
      ],
    },
    [TOUR_KEYS.BUILDER_FORM_VIEW_UPDATE]: {
      steps: [
        {
          id: TOUR_STEP_KEYS.BUILDER_FORM_ROW_ID,
          title: "Add row ID to update a row",
          layout: NewViewUpdateFormRowId,
          query: "#rowId-prop-control-wrap",
          onLoad: () => {
            tourEvent(TOUR_STEP_KEYS.BUILDER_FORM_ROW_ID)
            builderStore.highlightSetting("rowId", "info")
          },
          align: "left-outside",
        },
        {
          id: TOUR_STEP_KEYS.BUILDER_FORM_VIEW_UPDATE_STEPS,
          title: "Add multiple steps",
          layout: NewFormSteps,
          query: "#steps-prop-control-wrap",
          onComplete: () => {
            builderStore.highlightSetting()
            endTour({ key: TOUR_KEYS.BUILDER_FORM_VIEW_UPDATE })
          },
          onLoad: () => {
            tourEvent(TOUR_STEP_KEYS.BUILDER_FORM_VIEW_UPDATE_STEPS)
            builderStore.highlightSetting("steps", "info")
          },
          align: "left-outside",
          scrollIntoView: true,
        },
      ],
      onSkip: async () => {
        builderStore.highlightSetting()
        endTour({ key: TOUR_KEYS.BUILDER_FORM_VIEW_UPDATE, skipped: true })
      },
    },
  }
}

export const TOURS = getTours()
export const TOURSBYSTEP = Object.keys(TOURS).reduce((acc, tour) => {
  TOURS[tour].steps.forEach(element => {
    acc[element.id] = element
    acc[element.id]["tour"] = tour
  })
  return acc
}, {})
