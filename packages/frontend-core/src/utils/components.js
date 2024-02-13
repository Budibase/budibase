import { Helpers } from "@budibase/bbui"
import { FieldTypeToComponentMap } from "../constants"
import { makePropSafe as safe } from "@budibase/string-templates"

/**
 * Generates default props for a form block.
 */
export const generateDefaultMultiStepFormBlockProps = ({
  _id,
  actionType,
  schema,
  stepCount,
  currentStep,
  dataSource,
} = {}) => {
  if (!_id) {
    return null
  }

  const custom = actionType === "Custom"
  const title = `Step {{ [${_id}-form].[__currentStep] }}`
  const fields = generateDefaultFormBlockFields({ schema, custom })
  const buttons = generateMultiStepFormBlockButtons({
    _id,
    stepCount,
    currentStep,
    actionType,
    dataSource,
  })

  return {
    title,
    fields,
    buttons,
  }
}

/**
 *  Generate default fields for a form block, according to the settings
 */
const generateDefaultFormBlockFields = ({ schema, custom }) => {
  // Add some example fields for custom schema
  if (custom) {
    return [
      {
        _id: Helpers.uuid(),
        _instanceName: "Text field",
        _component: "@budibase/standard-components/stringfield",
        field: "Text field",
        label: "Text field",
        placeholder: "Text field",
        active: true,
      },
    ]
  }

  // Otherwise add all schema fields
  return Object.values(schema || {})
    .filter(field => !field.autocolumn)
    .map(field => {
      if (!field?.name || !schema?.[field.name]) {
        return null
      }
      const type = schema[field.name].type
      const fieldType = FieldTypeToComponentMap[type]
      return {
        _id: Helpers.uuid(),
        _instanceName: field.name,
        _component: `@budibase/standard-components/${fieldType}`,
        field: field.name,
        label: field.name,
        placeholder: field.name,
        active: true,
      }
    })
    .filter(x => x != null)
}

/**
 * Generate default buttons for a multi step form block
 */
const generateMultiStepFormBlockButtons = ({
  _id,
  stepCount,
  currentStep,
  actionType,
  dataSource,
}) => {
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

  return buttons
}

/**
 * Generate default buttons for a legacy form block, handling old
 * config types.
 * */
const generateLegacyFormBlockButtons = instance => {
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
  } = instance
  const formId = `${_id}-form`
  const repeaterId = `${_id}-repeater`
  const resourceId = dataSource?.resourceId
  let buttons = []

  // Accommodate old config to ensure delete button does not reappear
  const deleteText = showDeleteButton === false ? "" : deleteButtonLabel?.trim()
  const saveText = showSaveButton === false ? "" : saveButtonLabel?.trim()

  // Save button action chain
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

  // Delete button action chain
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

  // Add save button if required
  if (["Update", "Create"].includes(actionType) && showSaveButton !== false) {
    buttons.push({
      text: saveText || "Save",
      _id: Helpers.uuid(),
      _component: "@budibase/standard-components/button",
      onClick: onSave,
      type: "cta",
    })
  }

  // Add delete button if required
  if (actionType === "Update" && showDeleteButton !== false) {
    buttons.push({
      text: deleteText || "Delete",
      _id: Helpers.uuid(),
      _component: "@budibase/standard-components/button",
      onClick: onDelete,
      quiet: true,
      type: "secondary",
    })
  }

  return buttons
}
