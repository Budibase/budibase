import dayjs from "dayjs"

export const formatActivityDate = (value: string | number) => {
  const date = dayjs(value)
  return date.isValid() ? date.format("MMM D, YYYY h:mm A") : "Unknown time"
}
