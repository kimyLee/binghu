export default class BingHu {
  constructor () {
    this.radius = 50
    this.posx = window.innerWidth / 2
    this.posy = window.innerHeight - window.innerWidth / 4
    this.horSpeed = 0
    this.stop = false      // 是否静止状态
  }
  reset () {
    this.posx = window.innerWidth / 2
    this.posy = window.innerHeight - window.innerWidth / 4
    this.horSpeed = 0
    this.stop = false
  }
}
