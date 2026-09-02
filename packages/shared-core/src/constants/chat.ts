export const ChatCommands = {
  ASK: "ask",
  NEW: "new",
  LINK: "link",
  UNLINK: "unlink",
  UNSUPPORTED: "unsupported",
} as const

export type ChatCommand = (typeof ChatCommands)[keyof typeof ChatCommands]

export type SupportedChatCommand =
  | typeof ChatCommands.ASK
  | typeof ChatCommands.NEW
  | typeof ChatCommands.LINK
  | typeof ChatCommands.UNLINK
  | typeof ChatCommands.UNSUPPORTED

export const SupportedChatCommands = [
  ChatCommands.ASK,
  ChatCommands.NEW,
  ChatCommands.LINK,
  ChatCommands.UNLINK,
  ChatCommands.UNSUPPORTED,
] as const
