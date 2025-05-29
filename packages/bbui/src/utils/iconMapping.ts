export const iconMap: Record<string, string> = {
  Apps: "dots-nine",
  Actions: "pencil-ruler",
  ConversionFunnel: "funnel-simple",
  App: "app-store-logo",
  Briefcase: "briefcase",
  Money: "money",
  ShoppingCart: "shopping-cart",
  Form: "list",
  Help: "question",
  Monitoring: "monitor",
  Sandbox: "columns",
  Project: "folder",
  Organisations: "city",
  Magnify: "magnifying-glass",
  Launch: "rocket-launch",
  Car: "car",
  Camera: "camera",
  Bug: "bug",
  Channel: "snowflake",
  Calculator: "calculator",
  Calendar: "calendar-dots",
  GraphDonut: "chart-donut",
  GraphBarHorizontal: "chart-bar-horizontal",
  Demographic: "users-three",
}

export const getPhosphorIcon = (spectrumIcon: string): string => {
  return iconMap[spectrumIcon] || spectrumIcon
}
