import {
  Actions,
  Card,
  CardLink,
  CardText,
  LinkButton,
  type Author,
  type CardElement,
} from "chat"

export interface PrivatePostTarget {
  post: (message: string | CardElement) => Promise<unknown>
  postEphemeral: (
    user: string | Author,
    message: string | CardElement,
    options: { fallbackToDM: boolean }
  ) => Promise<unknown>
}

export const buildPlainTextLinkPrompt = ({
  text,
  linkUrl,
}: {
  text: string
  linkUrl: string
}) => `${text}\n${linkUrl}`

export const buildLinkPromptCard = ({
  text,
  linkUrl,
}: {
  text: string
  linkUrl: string
}) =>
  Card({
    title: "Link your Budibase account",
    children: [
      CardText(text),
      Actions([
        LinkButton({
          label: "Link account",
          url: linkUrl,
        }),
      ]),
      CardLink({
        label: "Open link in browser",
        url: linkUrl,
      }),
    ],
  })

export const postLinkPromptPrivately = async ({
  target,
  user,
  text,
  linkUrl,
  renderMode,
}: {
  target: PrivatePostTarget
  user: string | Author
  text: string
  linkUrl: string
  renderMode?: "card" | "plainText"
}): Promise<{
  delivered: boolean
  usedDirectMessageFallback: boolean
}> => {
  const message =
    renderMode === "plainText"
      ? buildPlainTextLinkPrompt({ text, linkUrl })
      : buildLinkPromptCard({ text, linkUrl })

  try {
    const response = await target.postEphemeral(user, message, {
      fallbackToDM: true,
    })
    if (response) {
      return {
        delivered: true,
        usedDirectMessageFallback: !!(response as { usedFallback?: boolean })
          .usedFallback,
      }
    }
  } catch (error) {
    console.error("Failed to send private link prompt", error)
  }

  return {
    delivered: false,
    usedDirectMessageFallback: false,
  }
}
