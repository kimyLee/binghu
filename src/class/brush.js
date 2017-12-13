export default class Brush {
  constructor () {
    this.dir = ''
    this.margin = 30
    this.width = 20
    this.height = 8
    this.posX = window.innerWidth / 2 - this.margin
    this.decreaseFactor = -1
    this.count = 0
    this.show = false
  }

  addCount (dir) {
    if (this.dir !== dir) {
      this.dir = dir
      this.count = 0
      this.posX = this.dir === 'left' ? (window.innerWidth / 2 - this.margin) : (window.innerWidth / 2 - this.margin + this.width)
    }
    this.count++
    console.log(this.count)
  }

  updateSelf () {
    if (this.count) {
      console.log('in')
      this.show = true
      this.posX = this.posX + this.decreaseFactor
      if (this.dir === 'left' && this.posX < window.innerWidth / 2 - this.margin - this.width) {
        this.decreaseFactor = 1
      } else if (this.dir === 'left' && this.posX > window.innerWidth / 2 - this.margin) {
        this.decreaseFactor = -1
        this.posX = window.innerWidth / 2 - this.margin
        this.count--
      } else if (this.dir === 'right' && this.posX < window.innerWidth / 2 + this.margin) {
        this.decreaseFactor = 1
      } else if (this.dir === 'right' && this.posX > window.innerWidth / 2 + this.margin + this.width) {
        this.decreaseFactor = -1
        this.posX = window.innerWidth / 2 - this.margin + this.width
        this.count--
      }
      console.log(this.posX)
    } else {
      this.show = false
      this.dir = ''
    }
  }
}
