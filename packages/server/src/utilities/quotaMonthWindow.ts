export interface QuotaMonthWindow {
  monthString: string
  periodStart: string
  periodEnd: string
}

export const getQuotaMonthWindow = (now = new Date()): QuotaMonthWindow => {
  const year = now.getFullYear()
  const monthIndex = now.getMonth()
  const monthString = `${monthIndex + 1}-${year}`

  const periodStart = new Date(year, monthIndex, 1, 0, 0, 0, 0).toISOString()
  const periodEnd = new Date(year, monthIndex + 1, 1, 0, 0, 0, 0).toISOString()

  return { monthString, periodStart, periodEnd }
}
