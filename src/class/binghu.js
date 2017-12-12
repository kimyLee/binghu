export default class BingHu {
  constructor () {
    this.radius = 50
    this.R = 70
    this.winHalfWidth = window.innerWidth / 2
    this.posx = this.winHalfWidth
    this.posy = window.innerHeight - window.innerWidth / 4
    this.horSpeed = 0
    this.stop = false      // 是否静止状态
    this.follower = {}
  }
  // 方向指标位置
  getFollowerPos (Vx, Vy) {
    // 计算弦值
    let Vxy = Math.sqrt(Vx * Vx + Vy * Vy)
    console.log(Vx, Vy, Vxy)
    let dy = Vy * this.R / Vxy
    let dx = Vx * this.R / Vxy
    return {x: this.posx < this.winHalfWidth ? this.posx - dx : this.posx + dx, y: this.posy + dy}
  }

  reset () {
    this.posx = window.innerWidth / 2
    this.posy = window.innerHeight - window.innerWidth / 4
    this.horSpeed = 0
    this.stop = false
  }
}
