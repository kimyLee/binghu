export default class Brush {
  constructor () {
    this.radio = 5.87
    this.width = 70
    this.height = this.width * this.radio
    this.posArr = [
      {x: 0, y: -this.height},
      {x: 0, y: 0},
      {x: 0, y: this.height}
    ]
    this.posArr2 = [
      {x: 0, y: -this.height},
      {x: 0, y: 0},
      {x: 0, y: this.height}
    ]
  }

  updateSelf () {
  }
}
