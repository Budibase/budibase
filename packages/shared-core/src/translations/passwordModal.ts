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
      fullKey: "passwordModal.passwordLabel",
      name: "Password password label",
      defaultValue: "Password",
    },
    {
      key: "repeatLabel",
      fullKey: "passwordModal.repeatLabel",
      name: "Password repeat label",
      defaultValue: "Repeat password",
    },
    {
      key: "saveText",
      fullKey: "passwordModal.saveButton",
      name: "Password save button",
      defaultValue: "Update password",
    },
    {
      key: "cancelText",
      fullKey: "passwordModal.cancelButton",
      name: "Password modal cancel button",
      defaultValue: "Cancel",
    },
    {
      key: "minLengthText",
      fullKey: "passwordModal.minLength",
      name: "Password minimum length copy",
      defaultValue:
        "Please enter at least 12 characters. We recommend using machine generated or random passwords.",
    },
    {
      key: "mismatchText",
      fullKey: "passwordModal.mismatch",
      name: "Password mismatch copy",
      defaultValue: "Passwords must match",
    },
    {
      key: "successText",
      fullKey: "passwordModal.success",
      name: "Password success notification",
      defaultValue: "Password changed successfully",
    },
    {
      key: "errorText",
      fullKey: "passwordModal.error",
      name: "Password error notification",
      defaultValue: "Failed to update password",
    },
  ]
)
