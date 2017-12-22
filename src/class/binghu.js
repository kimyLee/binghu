export default class BingHu {
  constructor () {
    this.radius = 50
    this.R = 70
    this.posx = window.innerWidth / 2
    this.posy = window.innerHeight - window.innerWidth / 2.5
    this.horSpeed = 0
    this.horAccSpeed = 0   // 水平方向加速度
    this.stop = false      // 是否静止状态
    this.follower = {}
  }

  getFollowerPos (Vx, Vy0) {
    let Vy = Math.max(0.5, Vy0)
    let Vxy = Math.sqrt(Vx * Vx + Vy * Vy)
    let dy = Vy * this.R / Vxy
    let dx = Vx * this.R / Vxy
    let dy1 = Vy * (this.R + 10) / Vxy
    let dx1 = Vx * (this.R + 10) / Vxy
    let x0 = this.posx - dx
    let y0 = this.posy + dy
    let x1 = this.posx - dx1
    let y1 = this.posy + dy1
    let fx = x => (x0 - x1) / (y1 - y0) * x + y1 - (x0 - x1) / (y1 - y0) * x1
    return {
      x: x0,
      y: y0,
      x1: x1 - 5,
      y1: fx(x1 - 5),
      x2: x1 + 5,
      y2: fx(x1 + 5)
    }
  }

  reset () {
    this.posx = window.innerWidth / 2
    this.posy = window.innerHeight - window.innerWidth / 2.5
    this.stop = true
    this.horSpeed = 0
    this.horAccSpeed = 0   // 水平方向加速度
    this.follower = {}
  }
}
