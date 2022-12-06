import type { NextPage } from "next"
import { useCallback, useEffect, useState } from "react"
import styles from "../styles/save.module.css"
import Notifications from "../components/notifications"

const Save: NextPage = () => {
  const [salespeople, setSalespeople] = useState([])
  const [loaded, setLoaded] = useState(false)

  const saveSale = useCallback(async (event: any) => {
    event.preventDefault()
    const sale = {
      sale_name: event.target.name.value,
      sales_person: [event.target.soldBy.value],
    }
    const response = await fetch("/api/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sale),
    })
    if (!response.ok) {
      const error = await response.text()
      Notifications.error(error, "Failed to save sale")
      return
    }
    Notifications.success("Sale saved successfully!", "Sale saved")
  }, [])

  const getSalespeople = useCallback(async () => {
    const response: any = await fetch("/api/salespeople")
    if (!response.ok) {
      throw new Error(await response.text())
    }
    const json = await response.json()
    setSalespeople(json.data)
  }, [])

  useEffect(() => {
    getSalespeople().then(() => {
      setLoaded(true)
    }).catch(() => {
      setSalespeople([])
    })
  }, [])

  if (!loaded) {
    return null
  }
  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h1 className="subtitle">New sale</h1>
        <form onSubmit={saveSale}>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input id="name" className="input" type="text" placeholder="Text input" />
            </div>
          </div>
          <div className="field">
            <label className="label">Sold by</label>
            <div className="control">
              <div className="select">
                <select id="soldBy">
                  {salespeople.map((person: any) => <option key={person._id} value={person._id}>{person.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="control">
            <button className="button is-link">Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Save