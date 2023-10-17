export class ApexOptionsBuilder {
  constructor() {
    this.formatters = {
      ["Default"]: val => (isNaN(val) ? val : Math.round(val * 100) / 100),
      ["Thousands"]: val => `${Math.round(val / 1000)}K`,
      ["Millions"]: val => `${Math.round(val / 1000000)}M`,
    }
    this.options = {
      series: [],
      legend: {
        show: false,
        position: "top",
        horizontalAlign: "right",
        showForSingleSeries: true,
        showForNullSeries: true,
        showForZeroSeries: true,
      },
      chart: {
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      xaxis: {
        labels: {
          formatter: this.formatters.Default,
        },
      },
      yaxis: {
        labels: {
          formatter: this.formatters.Default,
        },
      },
    }
  }

  setOption(path, value) {
    if (value == null || value === "") {
      return this
    }
    let tmp = this.options
    for (let i = 0; i < path.length - 1; i++) {
      const step = path[i]
      if (!tmp[step]) {
        tmp[step] = {}
      }
      tmp = tmp[step]
    }
    tmp[path[path.length - 1]] = value
    return this
  }

  getOptions() {
    return this.options
  }

  type(type) {
    return this.setOption(["chart", "type"], type)
  }

  title(title) {
    return this.setOption(["title", "text"], title)
  }

  colors(colors) {
    if (!colors) {
      delete this.options.colors
      this.options["customColor"] = false
      return this
    }
    this.options["customColor"] = true
    return this.setOption(["colors"], colors)
  }

  width(width) {
    return this.setOption(["chart", "width"], width || undefined)
  }

  height(height) {
    return this.setOption(["chart", "height"], height || undefined)
  }

  xLabel(label) {
    return this.setOption(["xaxis", "title", "text"], label)
  }

  yLabel(label) {
    return this.setOption(["yaxis", "title", "text"], label)
  }

  xCategories(categories) {
    return this.setOption(["xaxis", "categories"], categories)
  }

  yCategories(categories) {
    return this.setOption(["yaxis", "categories"], categories)
  }

  series(series) {
    return this.setOption(["series"], series)
  }

  horizontal(horizontal) {
    return this.setOption(["plotOptions", "bar", "horizontal"], horizontal)
  }

  dataLabels(dataLabels) {
    return this.setOption(["dataLabels", "enabled"], dataLabels)
  }

  animate(animate) {
    return this.setOption(["chart", "animations", "enabled"], animate)
  }

  curve(curve) {
    return this.setOption(["stroke", "curve"], curve)
  }

  gradient(gradient) {
    const fill = {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    }
    return this.setOption(["fill"], gradient ? fill : undefined)
  }

  legend(legend) {
    return this.setOption(["legend", "show"], legend)
  }

  legendPosition(position) {
    return this.setOption(["legend", "position"], position)
  }

  stacked(stacked) {
    return this.setOption(["chart", "stacked"], stacked)
  }

  labels(labels) {
    return this.setOption(["labels"], labels)
  }

  xUnits(units) {
    return this.setOption(
      ["xaxis", "labels", "formatter"],
      this.formatters[units || "Default"]
    )
  }

  yUnits(units) {
    return this.setOption(
      ["yaxis", "labels", "formatter"],
      this.formatters[units || "Default"]
    )
  }

  clearXFormatter() {
    delete this.options.xaxis.labels
    return this
  }

  clearYFormatter() {
    delete this.options.yaxis.labels
    return this
  }

  xType(type) {
    return this.setOption(["xaxis", "type"], type)
  }

  yType(type) {
    return this.setOption(["yaxis", "type"], type)
  }

  yTooltip(yTooltip) {
    return this.setOption(["yaxis", "tooltip", "enabled"], yTooltip)
  }

  palette(palette) {
    if (!palette) {
      return this
    }
    return this.setOption(
      ["theme", "palette"],
      palette.toLowerCase().replace(/[\W]/g, "")
    )
  }
}
