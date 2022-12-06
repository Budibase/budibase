import { getApp, findTable, makeCall } from "../../utilities"

async function getSalespeople() {
  const { _id: appId } = await getApp()
  const table = await findTable(appId, "sales_people")
  return await makeCall("post", `tables/${table._id}/rows/search`, {
    appId,
    body: {
      sort: {
        type: "string",
        order: "ascending",
        column: "person_id",
      },
    },
  })
}

export default async function handler(req: any, res: any) {
  let response: any = {}
  try {
    if (req.method === "GET") {
      response = await getSalespeople()
    } else {
      res.status(404)
      return
    }
    res.status(200).json(response)
  } catch (err: any) {
    res.status(400).send(err)
  }
}
