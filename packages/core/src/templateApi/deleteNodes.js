import { } from "../templateApi/heirarchy"

export const canDelete = () => {
  /*
    it must not exist on any index.allowedModelNodeIds
    it must not exist on and reference type fields
    these rules should apply to any child nodes , which will also be deleted
    */
}
