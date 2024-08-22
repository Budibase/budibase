import { makePropSafe as safe } from "@budibase/string-templates"
import { Helpers } from "@budibase/bbui"
import * as Constants from "../constants"

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

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
        confirm: null,
      },
    },
    {
      "##eventHandlerType": "Close Screen Modal",
    },
    {
      "##eventHandlerType": "Close Side Panel",
    },
    {
      "##eventHandlerType": "Close Modal",
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

  if (actionType === "Update" && showDeleteButton !== false) {
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

export const buildMultiStepFormBlockDefaultProps = props => {
  const { _id, stepCount, currentStep, actionType, dataSource } = props || {}

  // Sanity check
  if (!_id || !stepCount) {
    return
  }

  const title = `Step {{ [${_id}-form].[__currentStep] }}`
  const resourceId = dataSource?.resourceId
  const formId = `${_id}-form`
  let buttons = []

  // Add previous step button if we aren't the first step
  if (currentStep !== 0) {
    buttons.push({
      _id: Helpers.uuid(),
      _component: "@budibase/standard-components/button",
      _instanceName: Helpers.uuid(),
      text: "Back",
      type: "secondary",
      size: "M",
      onClick: [
        {
          parameters: {
            type: "prev",
            componentId: formId,
          },
          "##eventHandlerType": "Change Form Step",
        },
      ],
    })
  }

  // Add a next button if we aren't the last step
  if (currentStep !== stepCount - 1) {
    buttons.push({
      _id: Helpers.uuid(),
      _component: "@budibase/standard-components/button",
      _instanceName: Helpers.uuid(),
      text: "Next",
      type: "cta",
      size: "M",
      onClick: [
        {
          "##eventHandlerType": "Validate Form",
          parameters: {
            componentId: formId,
          },
        },
        {
          parameters: {
            type: "next",
            componentId: formId,
          },
          "##eventHandlerType": "Change Form Step",
        },
      ],
    })
  }

  // Add save button if we are the last step
  if (actionType !== "View" && currentStep === stepCount - 1) {
    buttons.push({
      _id: Helpers.uuid(),
      _component: "@budibase/standard-components/button",
      _instanceName: Helpers.uuid(),
      text: "Save",
      type: "cta",
      size: "M",
      onClick: [
        {
          "##eventHandlerType": "Validate Form",
          parameters: {
            componentId: formId,
          },
        },
        {
          "##eventHandlerType": "Save Row",
          parameters: {
            tableId: resourceId,
            providerId: formId,
          },
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
      ],
    })
  }

  return {
    buttons,
    title,
  }
}

/**
 * Processes the filter config. Filters are migrated
 * SearchFilter[] to SearchFilterGroup
 *
 *  This is supposed to be in shared-core
 * @param {Object[]} filter
 */
export const migrateSearchFilters = filters => {
  const defaultCfg = {
    logicalOperator: Constants.FilterOperator.ALL,
    groups: [],
  }

  const filterWhitelistKeys = [
    "field",
    "operator",
    "valueType", // bb
    "value",
    "type",
    "noValue", // bb
  ]

  /**
   * Review these
   * externalType, formulaType, subtype
   */

  if (Array.isArray(filters)) {
    const baseGroup = {
      filters: [],
      logicalOperator: Constants.FilterOperator.ALL,
    }

    const migratedSetting = filters.reduce((acc, filter) => {
      // Sort the properties for easier debugging
      // Remove unset values
      const filterEntries = Object.entries(filter)
        .sort((a, b) => {
          return a[0].localeCompare(b[0])
        })
        .filter(x => x[1] ?? false)

      // Scrub invalid filters
      const { operator, onEmptyFilter, field, valueType } = filter
      if (!field || !valueType) {
        // THIS SCRUBS THE 2 GLOBALS
        // return acc
      }

      if (filterEntries.length == 1) {
        console.log("### one entry ")
        const [key, value] = filterEntries[0]
        // Global
        if (key === "onEmptyFilter") {
          // unset otherwise, seems to be the default
          acc.onEmptyFilter = value
        } else if (key === "operator" && value === "allOr") {
          // Group 1 logical operator
          baseGroup.logicalOperator = Constants.FilterOperator.ANY
        }

        return acc
      }

      // Process settings??
      const whiteListedFilterSettings = filterEntries.reduce((acc, entry) => {
        const [key, value] = entry

        if (filterWhitelistKeys.includes(key)) {
          if (key === "field") {
            acc.push([key, value.replace(/^[0-9]+:/, "")])
          } else {
            acc.push([key, value])
          }
        }
        return acc
      }, [])

      const migratedFilter = Object.fromEntries(whiteListedFilterSettings)

      baseGroup.filters.push(migratedFilter)

      if (!acc.groups.length) {
        // init the base group
        acc.groups.push(baseGroup)
      }

      return acc
    }, defaultCfg)

    console.log("MIGRATED ", migratedSetting)
    return migratedSetting
  }
  return false
}
