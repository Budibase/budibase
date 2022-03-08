import type { NextPage } from "next"
import styles from "../styles/home.module.css"
import { useState, useEffect } from "react"

const Home: NextPage = () => {
  const [sales, setSales] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const getSales = async (page: Number = 1) => {
    let url = "/api/sales"
    if (page) {
      url += `?page=${page}`
    }
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(await response.text())
    }
    const sales = await response.json()
    // @ts-ignore
    setCurrentPage(page)
    return setSales(sales.data)
  }

  const saveSale = async () => {
    const response = await fetch("/api/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
    if (!response.ok) {
      throw new Error(await response.text())
    }
  }

  const goToNextPage = async () => {
    await getSales(currentPage + 1)
  }

  const goToPrevPage = async () => {
    if (currentPage > 1) {
      await getSales(currentPage - 1)
    }
  }

  useEffect(() => {
    getSales().catch(() => {
      setSales([])
    })
  }, [])

  return (
    <div className={styles.container}>
      <h1>Sales</h1>
      <div>{sales.map((sale: any) => <p key={sale.sale_id}>{sale.sale_id}</p>)}</div>
      <button onClick={goToPrevPage}>Prev Page</button>
      <button onClick={goToNextPage}>Next Page</button>
    </div>
  )
}

export default Home
