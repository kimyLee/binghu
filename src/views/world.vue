<template>
  <div class="container">
    <div id="stage"></div>
    <!-- 计分器 -->
    <div class="score-panel">
      <div class="score-box">
        <div class="box-item" style="border-bottom: 1px solid #ccc;">离靶心</div>
        <div class="box-item num">{{score}}m</div>
      </div>
      <!-- 排行榜 -->
      <div class="ranking">排行榜</div>
    </div>

    <power-line ref="powerLine" @returnSpeed="getJourney" @changeStatus="shot"></power-line>
    <option-btn  @click="handleDirect('left')">左扫冰</option-btn>
    <option-btn  @click="handleDirect('right')" side='right'>右扫冰</option-btn>
    <!-- 文字图片特效 -->
    <transition name="fade">
      <div class="text-effect" v-show="showTextEffect === 'go'">
        GO!
      </div>
    </transition>
    <transition name="fade">
       <div class="text-effect-img" v-show="showTextEffect === 'moreSmooth'">
        <img :src="'/static/images/moreSmooth.png' | autoPre" />
      </div>
    </transition>
  </div>
</template>

<script>
import powerLine from '@/components/powerLine'
import optionBtn from '@/components/optionBtn'
import BingHu from '@/class/binghu'
import Brush from '@/class/Brush'
import People from '@/class/people'
export default {
  name: 'world',
  components: {
    powerLine,
    optionBtn
  },
  data () {
    return {
      hasBrush: 0,          // 点击刷过次数，超过3次不用触发更加顺滑
      beginMove: '',        // 从哪个点开始计算距离， 默认2 / 3 Height
      domain: '',
      topestDistance: -630, // 终 点 实际位移
      topest: -630,       // 终 点
      score: 0,           // 距离分数
      binghu: '',         // 冰壶对象
      brush: '',          // 刷子对象
      bgWalk: 0,          // 背景偏移
      roadWidth: 100,     // 轨道宽度
      speed: 0,           // 速度力度
      speedFactor: 33,    // 速度计算因子
      ratio: '',          // 分数计算因子
      status: 0,          // 当前状态， 0 正在选择力度， 1 正在移动，  2， 游戏结束

      context: '',        // 上下文
      canvas: '',         // 画布对象
      boxX: 0,            // 画布起点横坐标
      boxY: 0,            // 画布起点纵坐标
      Width: '',          // 画布宽度
      Height: '',         // 画布高度
      currentFrame: 0,     // 当前帧
      image: '',            // 冰壶贴图对象
      peopleImg1: '',        // 观众贴图对象1
      peopleImg2: '',        // 观众贴图对象2
      brushImage: '',       // 刷子贴图对象
      meter: '',             // 标尺贴图对象
      showTextEffect: ''     // 特效类型
    }
  },
  created () {
    this.binghu = new BingHu()
    this.brush = new Brush()
    this.image = new Image()
    this.people = new People()
    this.peopleImg1 = new Image()
    this.peopleImg2 = new Image()
    this.brushImage = new Image()
    this.meter = new Image()
    this.domain = location.port.indexOf('8888') < 0 ? '/binghutiaozhan' : ''
    this.image.src = this.domain + '/static/images/binghu.png'
    this.brushImage.src = this.domain + '/static/images/brush.png'

    this.peopleImg1.src = this.domain + '/static/images/people2.jpg'
    this.peopleImg2.src = this.domain + '/static/images/people.jpg'
    this.meter.src = this.domain + '/static/images/meter.jpg'
  },
  methods: {
    run () {
      if (this.status === 2) {
        return
      }
      this.render()
      window.requestAnimFrame(this.run)
    },

    // score 计算
    // 最高点减去冰壶起点， 收敛到50 , this.ratio = (this.binghu.begin - this.topest) / 50
    render () {
      this.context.clearRect(this.boxX, this.boxY, this.Width, this.Height)
      this.currentFrame++
      this.drawBg()
      this.drawFinal()
      this.drawPeople()
      this.drawHero()
      this.drawBrush()
      this.context.save()
      this.context.restore()

      this.score = (Math.abs(this.beginMove - this.topestDistance - this.bgWalk) / this.ratio).toFixed(1)
      this.judge()
    },

    shot (val) {
      this.status = val
      this.binghu.stop = false
      this.fireTextTip('go')
    },

    drawBrush () {
      let brush = this.brush
      brush.updateSelf()
      if (this.brush.show) {
        let ctx = this.context
        // 开始剪切x ,开始剪切y,被剪切宽度,被剪切高度,画布上x坐标,画布上y坐标,图像的宽度,图像的高度
        ctx.drawImage(this.brushImage, 0, 0, 115, 51, brush.posX - brush.width / 2, 300, brush.width, brush.height)
        // ctx.restore()
        // ctx.fillStyle = '#444'
        // ctx.fillRect(brush.posX - brush.width / 2, 300, brush.width, brush.height)
      }
    },

    // 画终点 画三个圆
    drawFinal () {
      let ctx = this.context
      if (this.binghu.stop) {
        this.topest = this.topest + this.speed / this.speedFactor
      }

      ctx.beginPath()
      ctx.strokeStyle = '#f1db8d'
      ctx.lineWidth = 10
      ctx.arc(this.Width / 2, this.topest, 70, 0, 2 * Math.PI)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#84d0fd'
      ctx.lineWidth = 10
      ctx.arc(this.Width / 2, this.topest, 40, 0, 2 * Math.PI)
      ctx.stroke()

      ctx.beginPath()
      ctx.fillStyle = '#d63338'
      ctx.lineWidth = 1
      ctx.arc(this.Width / 2, this.topest, 10, 0, 2 * Math.PI)
      ctx.fill()
    },

    // 画一堆观众
    drawPeople () {
      let ctx = this.context
      let people = this.people
      // 制造三张图一直循环
      people.posArr.forEach((e, index) => {
        if (this.binghu.stop) {
          e.y = e.y + this.speed / this.speedFactor
        }
        if (e.y >= this.Height) {
          e.y = -people.height - (this.Height - people.height)
        }
        ctx.drawImage(this.peopleImg1, 0, 0, 141, 828, e.x, e.y, people.width, people.height)
        ctx.drawImage(this.peopleImg2, 0, 0, 141, 828, this.Width - people.width, e.y, people.width, people.height)
      })
      // 开始剪切x ,开始剪切y,被剪切宽度,被剪切高度,画布上x坐标,画布上y坐标,图像的宽度,图像的高度
    },

    drawHero () {
      let ctx = this.context
      ctx.save()
      let binghu = this.binghu
      if (!this.binghu.stop) {
        this.binghu.posy = -this.speed / this.speedFactor + this.binghu.posy
        if (this.binghu.posy < this.beginMove) {
          this.binghu.stop = true
        }
      }
      this.binghu.horSpeed = this.binghu.horSpeed + this.binghu.horAccSpeed
      this.binghu.horSpeed = this.binghu.horSpeed > 0.5 ? 0.5 : (this.binghu.horSpeed < -0.5 ? -0.5 : this.binghu.horSpeed)
      this.binghu.posx = this.binghu.posx + this.binghu.horSpeed
      let follow = this.binghu.getFollowerPos(this.binghu.horSpeed, this.speed / this.speedFactor)
      // 开始剪切x ,开始剪切y,被剪切宽度,被剪切高度,画布上x坐标,画布上y坐标,图像的宽度,图像的高度
      // ctx.translate(window.innerWidth / 2, 0)
      // ctx.rotate(20 * Math.PI / 180)
      ctx.drawImage(this.image, 0, 0, 162, 160, binghu.posx - binghu.R / 1.5, binghu.posy - binghu.R / 1.5, binghu.R * 2 / 1.5, binghu.R * 2 / 1.5)
      ctx.restore()
      // ctx.beginPath()
      // ctx.strokeStyle = '#444'
      // ctx.lineWidth = 10
      // ctx.arc(this.binghu.posx, this.binghu.posy, this.binghu.radius, 0, 2 * Math.PI)
      // ctx.stroke()
      // ctx.beginPath()
      // ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(follow.x, follow.y)
      ctx.lineTo(follow.x1, follow.y1)
      ctx.lineTo(follow.x2, follow.y2)
      ctx.closePath()
      ctx.fillStyle = '#d35155'
      ctx.fill()
    },

    drawBg () {
      if (this.binghu.stop) {
        this.bgWalk = this.speed / this.speedFactor + this.bgWalk
      }
      let ctx = this.context
      ctx.fillStyle = '#ccc'
      // cxt.fillRect(0, 0, this.Width, this.Height)

      let numX = (this.Width - this.roadWidth) / 2 - 38      // 数字横坐标
      let beginY = this.beginMove
      let lineHeight = (beginY - this.topestDistance) / 25
      // let topHeight = 14
      // let bottomHeight = 8
      ctx.lineWidth = 1
      ctx.strokeStyle = '#ccc'
      ctx.fillStyle = '#ccc'
      ctx.beginPath()
      // 开始剪切x ,开始剪切y,被剪切宽度,被剪切高度,画布上x坐标,画布上y坐标,图像的宽度,图像的高度
      ctx.drawImage(this.meter, 0, 0, 334, 1539, numX, this.topestDistance + this.bgWalk + lineHeight * 2, 200, beginY - this.topestDistance - lineHeight * 5)
      // for (let i = 0; i <= 23; i++) {
        // console.log('hello')
        // if (i < 23) {
        //   ctx.moveTo(numX, beginY - i * lineHeight + this.bgWalk - topHeight)
        //   ctx.lineTo(numX + this.roadWidth + 40, beginY - i * lineHeight + this.bgWalk - topHeight)
        //   ctx.stroke()
        // }
        // ctx.moveTo(numX, beginY + bottomHeight - i * lineHeight + this.bgWalk)
        // ctx.lineTo(numX + this.roadWidth + 40, beginY + bottomHeight - i * lineHeight + this.bgWalk)
        // ctx.stroke()
        // ctx.fillText(50 - i * 2 + 'm', numX, beginY - lineHeight * i + this.bgWalk)
      // }

      ctx.beginPath()
      ctx.strokeStyle = '#ccc'
      ctx.lineWidth = 50
      ctx.moveTo(this.people.width, 0)
      ctx.lineTo(this.people.width, this.Height)
      ctx.closePath()
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#ccc'
      ctx.lineWidth = 30
      ctx.moveTo(this.Width - this.people.width - 10, 0)
      ctx.lineTo(this.Width - this.people.width - 10, this.Height)
      ctx.closePath()
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#eee'
      // ctx.lineWidth = numX - this.people.width - 10
      ctx.lineWidth = 10
      ctx.moveTo(this.people.width + 20, 0)
      ctx.lineTo(this.people.width + 20, this.Height)
      ctx.closePath()
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = '#eee'
      // ctx.lineWidth = numX - this.people.width - 50
      ctx.lineWidth = 10
      ctx.moveTo(this.Width - this.people.width - 20, 0)
      ctx.lineTo(this.Width - this.people.width - 20, this.Height)
      ctx.closePath()
      ctx.stroke()
    },

    judge () {
      if (this.status === 1 && this.speed <= 0) {
        this.gameOver()
      }
      if (Math.abs(this.Width - this.binghu.posx * 2) > this.roadWidth) {
        this.gameOver()
      }
    },

    gameOver () {
      this.status = 2
      alert('离终点' + this.score + '米')
      this.reStart()
    },
    reStart () {
      this.speed = 0
      this.binghu.reset()
      this.status = 0
      this.bgWalk = 0
      this.topest = this.topestDistance
      this.$refs.powerLine.reset()
    },

    // 左右按钮点击事件
    handleDirect (dir) {
      if (this.status !== 1) {
        return
      }

      this.hasBrush === 3 && this.fireTextTip('moreSmooth')
      this.hasBrush <= 3 && this.hasBrush++

      this.$refs.powerLine.slowPowerDecrease()
      this.binghu.horAccSpeed = dir ? (dir === 'left' ? -0.05 : 0.05) : 0
      this.brush.addCount(dir)
    },

     // 获取速度
    getJourney (val) {
      if (this.status === 1) {
        this.speed = val
      }
    },

    // 触发文字图片特效
    fireTextTip (val) {
      this.showTextEffect = val
      setTimeout(() => {
        this.showTextEffect = false
      }, 500)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.Width = window.innerWidth             // 屏幕宽度
      this.Height = window.innerHeight           // 屏幕高度
      this.beginMove = 2 / 3 * this.Height       // 开始滑动
      this.ratio = (this.beginMove - this.topestDistance) / 50
      let str = '<canvas id="canvas" width=' + this.Width + '; height=' + this.Height + '>Sorry! you的浏览器不支持canvas</canvas>'
      document.getElementById('stage').innerHTML = str
      // 全局对象
      this.canvas = document.getElementById('canvas')
      this.context = this.canvas.getContext('2d')

      if (window.devicePixelRatio) {
        this.canvas.style.width = this.Width + 'px'
        this.canvas.style.height = this.Height + 'px'
        this.canvas.height = this.Height * window.devicePixelRatio
        this.canvas.width = this.Width * window.devicePixelRatio
        this.context.scale(window.devicePixelRatio, window.devicePixelRatio)
      }

      this.run()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
  .container {
    width: 100%;
    height: 100%;
    background: #fcfcfc;
    #stage {
      width: 100%;
      height: 100%;
      canvas {
        width: 100%;
        height: 100%;
      }
    }
    .score-panel {
      width: 8.2rem;
      height: 13.3rem;
      padding: 0.5rem;
      background: rgba(255, 255, 255, .67);
      position: fixed;
      left: 0;
      top: 0;
      text-align: center;
      .score-box {
        border: 5px solid #a11c20;
        border-radius: 5px;
        width: 100%;
        box-sizing: border-box;
        height: 8.25rem;
        background: #fff;
        .box-item {
          box-sizing: border-box;
          height: 50%;
          line-height: 4.1rem;
          font-size: 1.6rem;
          font-weight: bold;
          &.num {
            font-size: 2rem;
          }
        }
        
      }
      .ranking {
          width: 8.2rem;
          height: 3.3rem;
          text-align: center;
          color: #fff;
          background: #e03b40;
          border-radius: 5px;
          margin-top: 4px;
          font-size: 2.2rem;
          line-height: 3.3rem;
          box-shadow: 0px 2px 0px 2px #a11c20;
        }
    }

    .text-effect {
      position: fixed;
      z-index: 999;
      width: 100%;
      height: 30rem;
      text-align: center;
      top: 50%;
      margin-top: -15rem;
      line-height: 30rem;
      color: #d35155;
      font-style: italic;
      font-size: 3.2rem;
    }
    .text-effect-img {
      position: fixed;
      z-index: 999;
      width: 100%;
      height: 20rem;
      text-align: center;
      top: 45%;
      margin-top: -10rem;  
      img {
        display: inline-block;
        height: 100%;
      }  
    }
    .fade-enter-active, .fade-leave-active {
      transform: scale(1.2);
      transition: transform .5s, opacity .5s;
    }
    .fade-enter, .fade-leave-to {
      transform: scale(1);
      opacity: 0;
    }
  }
</style>
