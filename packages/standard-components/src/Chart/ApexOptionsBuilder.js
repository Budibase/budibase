export class ApexOptionsBuilder {
  options = {
    series: [],
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

  color(color) {
    return this.setOption(["colors"], color)
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

  categories(categories) {
    return this.setOption(["xaxis", "categories"], categories)
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
}
