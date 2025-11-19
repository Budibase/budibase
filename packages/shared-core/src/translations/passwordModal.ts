import { createTranslationDefinitions } from "./types"

const category = "passwordModal"

export const passwordModalTranslations = createTranslationDefinitions(
  category,
  [
    {
      key: "title",
      fullKey: "passwordTitle",
      name: "Password title",
      defaultValue: "Update password",
    },
    {
      key: "body",
      fullKey: "passwordBody",
      name: "Password body",
      defaultValue: "Enter your new password below.",
    },
    {
      key: "passwordLabel",
      fullKey: "passwordModalLabel",
      name: "Password password label",
      defaultValue: "Password",
    },
    {
      key: "repeatLabel",
      fullKey: "passwordModalRepeatLabel",
      name: "Password repeat label",
      defaultValue: "Repeat password",
    },
    {
      key: "saveText",
      fullKey: "passwordModalSaveButton",
      name: "Password save button",
      defaultValue: "Update password",
    },
    {
      key: "cancelText",
      fullKey: "passwordModalCancelButton",
      name: "Password modal cancel button",
      defaultValue: "Cancel",
    },
    {
      key: "minLengthText",
      fullKey: "passwordModalMinLength",
      name: "Password minimum length copy",
      defaultValue:
        "Please enter at least 12 characters. We recommend using machine generated or random passwords.",
    },
    {
      key: "mismatchText",
      fullKey: "passwordModalMismatchText",
      name: "Password mismatch copy",
      defaultValue: "Passwords must match",
    },
    {
      key: "successText",
      fullKey: "passwordModalSuccess",
      name: "Password success notification",
      defaultValue: "Password changed successfully",
    },
    {
      key: "errorText",
      fullKey: "passwordModalError",
      name: "Password error notification",
      defaultValue: "Failed to update password",
    },
  ]
)
