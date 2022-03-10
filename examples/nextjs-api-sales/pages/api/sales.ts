import { getApp, findTable, makeCall } from "../../utilities"

async function getSales(req: any) {
  const { page } = req.query
  const { _id: appId } = await getApp()
  const table = await findTable(appId, "sales")
  return await makeCall("post", `tables/${table._id}/rows/search`, {
    appId,
    body: {
      limit: 10,
      sort: {
        type: "string",
        order: "descending",
        column: "sale_id",
      },
      paginate: true,
      bookmark: parseInt(page),
    },
  })
}

async function saveSale(req: any) {
  const { _id: appId } = await getApp()
  const table = await findTable(appId, "sales")
  return await makeCall("post", `tables/${table._id}/rows`, {
    body: req.body,
    appId,
  })
}

export default async function handler(req: any, res: any) {
  let response: any = {}
  try {
    if (req.method === "POST") {
      response = await saveSale(req)
    } else if (req.method === "GET") {
      response = await getSales(req)
    } else {
      res.status(404)
      return
    }
    res.status(200).json(response)
  } catch (err: any) {
    res.status(400).send(err)
  }
}
