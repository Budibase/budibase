
import { JsomNode } from "sp-jsom-node"

exports.sp2019Lists = async (siteUrl,username,password,domain) => {
    console.log("Site url :",siteUrl)
      console.log("username :",username)
      console.log("password :",password)
      console.log("domain :",domain)
      const sp2019 = new JsomNode({
        modules: ["taxonomy", "userprofiles"],
      })
      const ctx = sp2019
        .init({
          siteUrl: siteUrl,
          authOptions: {
            username: username,
            password: password,
            domain: domain
          }
        })
      const spctx = await ctx.getContext()
      const oListsCollection = spctx.get_web().get_lists()
      spctx.load(oListsCollection, "Include(Title)")
      await spctx.executeQueryPromise()
      const arrList = []
      const listsTitlesArr = oListsCollection.get_data().map(l => {
        arrList.push({ Title:l.get_title() })
        })


      console.log("List test :", arrList)
      console.log("List :", listsTitlesArr)

     

     return arrList
}