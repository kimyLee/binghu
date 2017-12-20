export default class Brush {
  constructor () {
    this.dir = ''
    this.margin = 60
    this.width = 60
    this.height = this.width / 2.25
    this.posX = window.innerWidth / 2 - this.margin
    this.decreaseFactor = -1
    this.count = 0
    this.show = false
  }

  addCount (dir) {
    if (this.dir !== dir) {
      this.dir = dir
      this.count = 0
      this.posX = this.dir === 'left' ? (window.innerWidth / 2 - this.margin) : (window.innerWidth / 2 + this.margin)
      this.decreaseFactor = -1
    }
    this.count++
  }

  updateSelf () {
    if (this.count) {
      console.log('in')
      this.show = true
      this.posX = this.posX + this.decreaseFactor * 8
      if (this.dir === 'left' && this.posX < window.innerWidth / 2 - this.margin - this.width / 2) {
        this.decreaseFactor = 1
      } else if (this.dir === 'left' && this.posX > window.innerWidth / 2 - this.margin + this.width / 2) {
        this.decreaseFactor = -1
        // this.posX = window.innerWidth / 2 - this.margin + this.width / 2
        this.count--
      } else if (this.dir === 'right' && this.posX < window.innerWidth / 2 + this.margin - this.width / 2) {
        this.decreaseFactor = 1
      } else if (this.dir === 'right' && this.posX > window.innerWidth / 2 + this.margin + this.width / 2) {
        this.decreaseFactor = -1
        // this.posX = window.innerWidth / 2 + this.margin + this.width / 2
        this.count--
      }
    } else {
      this.show = false
      this.dir = ''
    }
  }
}
