import { getMemoryTemplateApi } from "./specHelpers"
import { diffHierarchy } from "../src/templateApi/diffHierarchy"
import { getFlattenedHierarchy } from "../src/templateApi/hierarchy"

describe("diffHierarchy", () => {

  it("should not show any changes, when hierarchy is unchanged", async () => {
    const oldHierarchy = (await setup()).root;
    const newHierarchy = (await setup()).root;
    const diff = diffHierarchy(oldHierarchy, newHierarchy)
    expect(diff).toEqual([])
  })

  it("should detect record created", async () => {
    
  })
})


const setup = async () => {
  const { templateApi } = await getMemoryTemplateApi()
  const root = templateApi.getNewRootLevel()
  const contact = templateApi.getNewRecordTemplate(root, "contact", true)
  const lead = templateApi.getNewRecordTemplate(root, "lead", true)
  const deal = templateApi.getNewRecordTemplate(contact, "deal", true)

  getFlattenedHierarchy(root)
  return {
    root, contact, lead, deal,
    all_contacts: root.indexes[0],
    all_leads: root.indexes[1],
    deals_for_contacts: contact.indexes[0]
  }
}