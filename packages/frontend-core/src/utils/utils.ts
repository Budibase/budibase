import { makePropSafe as safe } from "@budibase/string-templates"
import { Helpers } from "@budibase/bbui"
import { cloneDeep } from "lodash"
import { UISearchFilter } from "@budibase/types"

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * Utility to wrap an async function and ensure all invocations happen
 * sequentially.
 */
export const sequential = <R, T extends (...args: any[]) => Promise<R>>(
  fn: T
): ((...params: Parameters<T>) => Promise<R>) => {
  let queue: (() => Promise<void>)[] = []
  return (...params: Parameters<T>): Promise<R> => {
    return new Promise<R>((resolve, reject) => {
      queue.push(async () => {
        try {
          resolve(await fn(...params))
        } catch (error) {
          reject(error)
        } finally {
          queue.shift()
          if (queue.length) {
            queue[0]()
          }
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
 */
export const debounce = <R, T extends (...args: any[]) => Promise<R>>(
  callback: T,
  minDelay = 1000
): ((...params: Parameters<T>) => Promise<R>) => {
  let timeout: number | null = null
  return (...params: Parameters<T>): Promise<R> => {
    return new Promise<R>(resolve => {
      if (timeout !== null) {
        clearTimeout(timeout)
      }
      timeout = window.setTimeout(
        async () => resolve(await callback(...params)),
        minDelay
      )
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
 */
export const throttle = <T extends (...args: any[]) => void>(
  callback: T,
  minDelay = 1000
): ((...params: Parameters<T>) => void) => {
  let lastParams: Parameters<T> | undefined
  let stalled = false
  let pending = false

  const invoke = (...params: Parameters<T>) => {
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
        invoke(...lastParams!)
      }
    }, minDelay)
  }

  return invoke
}

/**
 * Utility to debounce DOM activities using requestAnimationFrame
 */
export const domDebounce = <T extends (...args: any[]) => void>(
  callback: T
): ((...params: Parameters<T>) => void) => {
  let active = false
  let lastParams: Parameters<T>

  return (...params: Parameters<T>) => {
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
 * */
export const buildFormBlockButtonConfig = (props: any) => {
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
    {
      "##eventHandlerType": "Close Modal",
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
      type: "warning",
    })
  }

  return defaultButtons
}

export const buildMultiStepFormBlockDefaultProps = (props: any) => {
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
 * Parse out empty or invalid UI filters and clear empty groups
 */
export function parseFilter(filter: UISearchFilter): UISearchFilter {
  if (!filter?.groups) {
    return filter
  }

  const update = cloneDeep(filter)
  if (!update.groups) {
    return update
  }

  update.groups = update.groups
    .filter(group => group.filters && group.filters.length > 0)
    .map(group => {
      group.filters = group.filters!.filter(
        filter => "field" in filter && filter.field && filter.operator
      )
      return group
    })

  return update
}
