import { docIds } from "@budibase/backend-core"
import { generator } from "@budibase/backend-core/tests"
import { KnowledgeBase } from "@budibase/types"

export function basicKnowledgeBase(
  props: Partial<KnowledgeBase> = {}
): KnowledgeBase {
  return {
    name: generator.guid(),
    embeddingModel: generator.guid(),
    vectorDb: generator.guid(),
    _id: docIds.generateKnowledgeBaseID(),
    ...props,
  }
}
