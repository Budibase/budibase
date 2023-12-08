import { makePropSafe as safe } from "@budibase/string-templates"
import { Helpers } from "@budibase/bbui"

/**
 * Utility to wrap an async function and ensure all invocations happen
 * sequentially.
 * @param fn the async function to run
 * @return {Promise} a sequential version of the function
 */
export const sequential = fn => {
  let queue = []
  return (...params) => {
    return new Promise((resolve, reject) => {
      queue.push(async () => {
        let data, error
        try {
          data = await fn(...params)
        } catch (err) {
          error = err
        }
        queue.shift()
        if (queue.length) {
          queue[0]()
        }
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
      if (queue.length === 1) {
        queue[0]()
      }
    })
  }
}

/**
 * Utility to debounce an async function and ensure a minimum delay between
 * invocations is enforced.
 * @param callback an async function to run
 * @param minDelay the minimum delay between invocations
 * @returns {Promise} a debounced version of the callback
 */
export const debounce = (callback, minDelay = 1000) => {
  let timeout
  return async (...params) => {
    return new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(async () => {
        resolve(await callback(...params))
      }, minDelay)
    })
  }
}

/**
 * Utility to throttle invocations of a synchronous function. This is better
 * than a simple debounce invocation for a number of reasons. Features include:
 * - First invocation is immediate (no initial delay)
 * - Every invocation has the latest params (no stale params)
 * - There will always be a final invocation with the last params (no missing
 *   final update)
 * @param callback
 * @param minDelay
 * @returns {Function} a throttled version function
 */
export const throttle = (callback, minDelay = 1000) => {
  let lastParams
  let stalled = false
  let pending = false
  const invoke = (...params) => {
    lastParams = params
    if (stalled) {
      pending = true
      return
    }
    callback(...lastParams)
    stalled = true
    setTimeout(() => {
      stalled = false
      if (pending) {
        pending = false
        invoke(...lastParams)
      }
    }, minDelay)
  }
  return invoke
}

/**
 * Utility to debounce DOM activities using requestAnimationFrame
 * @param callback the function to run
 * @returns {Function}
 */
export const domDebounce = callback => {
  let active = false
  let lastParams
  return (...params) => {
    lastParams = params
    if (!active) {
      active = true
      requestAnimationFrame(() => {
        callback(...lastParams)
        active = false
      })
    }
  }
}

/**
 * Build the default FormBlock button configs per actionType
 * Parse any legacy button config and mirror its the outcome
 *
 * @param {any} props
 * */
export const buildFormBlockButtonConfig = props => {
  const {
    _id,
    actionType,
    dataSource,
    notificationOverride,
    actionUrl,
    showDeleteButton,
    deleteButtonLabel,
    showSaveButton,
    saveButtonLabel,
  } = props || {}

  if (!_id) {
    return
  }
  const formId = `${_id}-form`
  const repeaterId = `${_id}-repeater`
  const resourceId = dataSource?.resourceId

  // Accommodate old config to ensure delete button does not reappear
  const deleteText = showDeleteButton === false ? "" : deleteButtonLabel?.trim()
  const saveText = showSaveButton === false ? "" : saveButtonLabel?.trim()

  const onSave = [
    {
      "##eventHandlerType": "Validate Form",
      parameters: {
        componentId: formId,
      },
    },
    {
      "##eventHandlerType": "Save Row",
      parameters: {
        providerId: formId,
        tableId: resourceId,
        notificationOverride,
      },
    },
    {
      "##eventHandlerType": "Close Screen Modal",
    },
    {
      "##eventHandlerType": "Close Side Panel",
    },
    // Clear a create form once submitted
    ...(actionType !== "Create"
      ? []
      : [
          {
            "##eventHandlerType": "Clear Form",
            parameters: {
              componentId: formId,
            },
          },
        ]),

    ...(actionUrl
      ? [
          {
            "##eventHandlerType": "Navigate To",
            parameters: {
              url: actionUrl,
            },
          },
        ]
      : []),
  ]

  const onDelete = [
    {
      "##eventHandlerType": "Delete Row",
      parameters: {
        confirm: true,
        tableId: resourceId,
        rowId: `{{ ${safe(repeaterId)}.${safe("_id")} }}`,
        revId: `{{ ${safe(repeaterId)}.${safe("_rev")} }}`,
        notificationOverride,
      },
    },
    {
      "##eventHandlerType": "Close Screen Modal",
    },
    {
      "##eventHandlerType": "Close Side Panel",
    },

    ...(actionUrl
      ? [
          {
            "##eventHandlerType": "Navigate To",
            parameters: {
              url: actionUrl,
            },
          },
        ]
      : []),
  ]

  const defaultButtons = []

  if (["Update", "Create"].includes(actionType) && showSaveButton !== false) {
    defaultButtons.push({
      text: saveText || "Save",
      _id: Helpers.uuid(),
      _component: "@budibase/standard-components/button",
      onClick: onSave,
      type: "cta",
    })
  }

  if (actionType == "Update" && showDeleteButton !== false) {
    defaultButtons.push({
      text: deleteText || "Delete",
      _id: Helpers.uuid(),
      _component: "@budibase/standard-components/button",
      onClick: onDelete,
      quiet: true,
      type: "secondary",
    })
  }

  return defaultButtons
}

export const buildMultiStepFormBlockButtonConfig = props => {
  const { _id, stepCount, currentStep } = props || {}

  // Sanity check
  if (!_id || !stepCount) {
    return
  }

  let buttons = []

  // Add previous step button if we aren't the first step
  buttons.push({
    _id: Helpers.uuid(),
    _component: "@budibase/standard-components/button",
    _instanceName: Helpers.uuid(),
    text: "Back",
    type: "secondary",
    size: "M",
    disabled: currentStep === 0,
    onClick: [
      {
        parameters: {
          type: "prev",
          componentId: `${_id}-form`,
        },
        "##eventHandlerType": "Change Form Step",
      },
    ],
  })

  // Add a next button if we aren't the last step
  buttons.push({
    _id: Helpers.uuid(),
    _component: "@budibase/standard-components/button",
    _instanceName: Helpers.uuid(),
    text: "Next",
    type: "cta",
    size: "M",
    disabled: currentStep === stepCount - 1,
    onClick: [
      {
        parameters: {
          type: "next",
          componentId: `${_id}-form`,
        },
        "##eventHandlerType": "Change Form Step",
      },
    ],
  })

  return buttons
}
