/**
 * Created by Administrator on 2015/11/2 0002.
 */
/* canvas 按钮特效  */
export default class CanvasBtn {
  constructor (dom) {
    this.circles = []
    this.max_radius = ''
    this.context = ''
    this.canvas = ''
    this.init(dom)
  }

  init ($target) {
    if ($target.nodeType !== 1) {
      $target = document.querySelector($target)
    }
    let $canvas = document.createElement('canvas')
    this.canvas = $canvas
    this.context = $canvas.getContext('2d')

    $canvas.width = $target.offsetWidth
    $canvas.height = $target.offsetHeight + 10     // 超出一点好看

    // 消除锯齿
    if (window.devicePixelRatio) {
      this.canvas.style.width = $canvas.width + 'px'
      this.canvas.style.height = $canvas.height + 'px'
      this.canvas.height = $canvas.height * window.devicePixelRatio
      this.canvas.width = $canvas.width * window.devicePixelRatio
      this.context.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    

    $target.appendChild($canvas)
    $target.addEventListener('click', (ele) => {
      let target = ele.target || ele.srcElement
      if (target.tagName === 'CANVAS') {
        this.press(target)
      }
    })
  }

  press ($target) {
    this.max_radius = $target.offsetWidth
    let circle = {
      radius: 0,
      centerX: $target.offsetWidth / 2,
      centerY: $target.offsetHeight / 2
    }
    this.circles.push(circle)
    if (this.circles.length <= 1) {
      this.draw()
    }
  }

  draw () {
    let context = this.context
    context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let index = this.circles.length; index--;) {
      let item = this.circles[index]

      context.beginPath()
      context.arc(item.centerX, item.centerY, item.radius, 0, 2 * Math.PI, false)
      context.strokeStyle = `rgba(0, 0, 0, ${(100 - item.radius / 3 * 10) / 100})`
      context.lineWidth = 2
      context.stroke()

      item.radius += 1
      if (item.radius > 30) {
        this.circles.splice(index, 1)
      }
    }

    if (this.circles.length > 0) {
      window.requestAnimationFrame(() => { this.draw() })
    } else {
      context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
  }
}
