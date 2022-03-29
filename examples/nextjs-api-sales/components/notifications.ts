import { Store } from "react-notifications-component"

const notifications = {
  error: (error: string, title: string) => {
    Store.addNotification({
      container: "top-right",
      type: "danger",
      message: error,
      title: title,
      dismiss: {
        duration: 10000,
      },
    })
  },
  success: (message: string, title: string) => {
    Store.addNotification({
      container: "top-right",
      type: "success",
      message: message,
      title: title,
      dismiss: {
        duration: 3000,
      },
    })
  },
}

export default notifications
