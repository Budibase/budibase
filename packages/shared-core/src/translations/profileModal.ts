import { createTranslationDefinitions } from "./types"

const category = "profileModal"

export const profileModalTranslations = createTranslationDefinitions(category, [
  {
    key: "title",
    fullKey: "profileModalTitle",
    name: "Profile modal title",
    defaultValue: "My profile",
  },
  {
    key: "body",
    fullKey: "profileModalBody",
    name: "Profile modal body",
    defaultValue:
      "Personalise the platform by adding your first name and last name.",
  },
  {
    key: "emailLabel",
    fullKey: "profileModalEmailLabel",
    name: "Profile email label",
    defaultValue: "Email",
  },
  {
    key: "firstNameLabel",
    fullKey: "profileModalFirstNameLabel",
    name: "Profile first name label",
    defaultValue: "First name",
  },
  {
    key: "lastNameLabel",
    fullKey: "profileModalLastNameLabel",
    name: "Profile last name label",
    defaultValue: "Last name",
  },
  {
    key: "saveText",
    fullKey: "profileModalSaveButton",
    name: "Profile save button",
    defaultValue: "Save",
  },
  {
    key: "cancelText",
    fullKey: "profileModalCancelButton",
    name: "Profile cancel button",
    defaultValue: "Cancel",
  },
  {
    key: "successText",
    fullKey: "profileModalSuccess",
    name: "Profile update success notification",
    defaultValue: "Information updated successfully",
  },
  {
    key: "errorText",
    fullKey: "profileModalError",
    name: "Profile update error notification",
    defaultValue: "Failed to update information",
  },
])
