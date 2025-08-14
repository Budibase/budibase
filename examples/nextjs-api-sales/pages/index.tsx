import type { NextPage } from "next"
import styles from "../styles/home.module.css"
import { useState, useEffect, useCallback } from "react"
import Notifications from "../components/notifications"

const Home: NextPage = () => {
  const [sales, setSales] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loaded, setLoaded] = useState(false)

  const getSales = useCallback(async (page: Number = 1) => {
    let url = "/api/sales"
    if (page) {
      url += `?page=${page}`
    }
    const response = await fetch(url)
    if (!response.ok) {
      const error = await response.text()
      Notifications.error(error, "Failed to get sales")
      return
    }
    const sales = await response.json()
    // @ts-ignore
    setCurrentPage(page)
    return setSales(sales.data)
  }, [])

  const goToNextPage = useCallback(async () => {
    await getSales(currentPage + 1)
  }, [currentPage, getSales])

  const goToPrevPage = useCallback(async () => {
    if (currentPage > 1) {
      await getSales(currentPage - 1)
    }
  }, [currentPage, getSales])

  useEffect(() => {
    getSales().then(() => {
      setLoaded(true)
    }).catch(() => {
      setSales([])
    })
  }, [])

  if (!loaded) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableSection}>
        <h1 className="subtitle">Sales</h1>
        <div className={styles.table}>
          <table className="table">
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>name</th>
                <th>Sold by</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale: any) =>
                <tr key={sale.sale_id}>
                  <th>{sale.sale_id}</th>
                  <th>{sale.sale_name}</th>
                  <th>{sale.sales_person?.map((person: any) => person.primaryDisplay)[0]}</th>
                </tr>
              )}
            </tbody>
          </table>
          <div className={styles.buttons}>
            <button className="button" onClick={goToPrevPage}>Prev Page</button>
            <button className="button" onClick={goToNextPage}>Next Page</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
