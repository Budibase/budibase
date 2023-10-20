import { User, SearchIndex } from "@budibase/types"
import { getGlobalDB } from "../../context"

export async function createUserIndex() {
  const db = getGlobalDB()
  let designDoc
  try {
    designDoc = await db.get<any>("_design/database")
  } catch (err: any) {
    if (err.status === 404) {
      designDoc = { _id: "_design/database" }
    }
  }

  const fn = function (user: User) {
    if (user._id && !user._id.startsWith("us_")) {
      return
    }
    const ignoredFields = [
      "_id",
      "_rev",
      "password",
      "account",
      "license",
      "budibaseAccess",
      "accountPortalAccess",
      "csrfToken",
    ]

    function idx(input: Record<string, any>, prev?: string) {
      for (let key of Object.keys(input)) {
        if (ignoredFields.includes(key)) {
          continue
        }
        let idxKey = prev != null ? `${prev}.${key}` : key
        if (typeof input[key] === "string") {
          // eslint-disable-next-line no-undef
          // @ts-ignore
          index(idxKey, input[key].toLowerCase(), { facet: true })
        } else if (typeof input[key] !== "object") {
          // eslint-disable-next-line no-undef
          // @ts-ignore
          index(idxKey, input[key], { facet: true })
        } else {
          idx(input[key], idxKey)
        }
      }
    }
    idx(user)
  }

  designDoc.indexes = {
    [SearchIndex.USER]: {
      index: fn.toString(),
      analyzer: {
        default: "keyword",
        name: "perfield",
      },
    },
  }
  await db.put(designDoc)
}
