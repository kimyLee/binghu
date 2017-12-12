<template>
  <div class="container">
    <div id="stage"></div>
    <!-- 计分器 -->
    <div class="score-panel">
      <span class="score-title">距离终点</span>
      <br>
      <span class="score-num">{{score}}</span>
    </div>
    <power-line ref="powerLine" @returnSpeed="getJourney" @changeStatus="val => {status = val}"></power-line></power-line>
    <option-btn  @click="handleDirect('left')">左刷</option-btn>
    <option-btn @click="handleDirect('right')" side='right'>右刷</option-btn>
  </div>
</template>

<script>
import powerLine from '@/components/powerLine'
import optionBtn from '@/components/optionBtn'
import BingHu from '@/class/binghu'
export default {
  name: 'world',
  components: {
    powerLine,
    optionBtn
  },
  data () {
    return {
      score: 0,           // 距离分数
      binghu: '',         // 冰壶对象
      bgWalk: 0,          // 背景偏移
      roadWidth: 200,     // 轨道宽度
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
      currentFrame: 0     // 当前帧
    }
  },
  created () {
    this.binghu = new BingHu()
  },
  methods: {
    run () {
      if (this.status === 2) {
        return
      }
      this.render()
      window.requestAnimationFrame(this.run)
    },

    render () {
      this.context.clearRect(this.boxX, this.boxY, this.Width, this.Height)
      this.currentFrame++
      this.drawBg()
      this.drawHero()
      this.context.save()
      this.context.restore()
      this.score = (Math.abs(-590 + this.bgWalk - this.Height / 3 * 2) / this.ratio).toFixed(2)
      this.judge()                  // 判定是否gameover
    },

    drawHero () {
      let ctx = this.context
      if (!this.binghu.stop) {
        this.binghu.posy = -this.speed / this.speedFactor + this.binghu.posy
        if (this.binghu.posy < this.Height / 3 * 2) {
          this.binghu.stop = true
        }
      }
      this.binghu.horSpeed = this.binghu.horSpeed + this.binghu.horAccSpeed
      this.binghu.horSpeed = this.binghu.horSpeed > 0.5 ? 0.5 : (this.binghu.horSpeed < -0.5 ? -0.5 : this.binghu.horSpeed)
      this.binghu.posx = this.binghu.posx + this.binghu.horSpeed
      let follow = this.binghu.getFollowerPos(this.binghu.horSpeed, this.speed / this.speedFactor)
      ctx.beginPath()
      ctx.arc(this.binghu.posx, this.binghu.posy, this.binghu.radius, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(follow.x, follow.y)
      ctx.lineTo(follow.x1, follow.y1)
      ctx.lineTo(follow.x2, follow.y2)
      ctx.closePath()
      ctx.fillStyle = '#444'
      ctx.fill()
    },

    drawBg () {
      if (this.binghu.stop) {
        this.bgWalk = this.speed / this.speedFactor + this.bgWalk
      }
      let ctx = this.context
      ctx.moveTo((this.Width - this.roadWidth) / 2 - this.binghu.radius, 120)
      ctx.lineTo((this.Width - this.roadWidth) / 2 - this.binghu.radius, 550)
      ctx.stroke()
      let numX = (this.Width - this.roadWidth) / 2 - this.binghu.radius + 10
      ctx.fillText('0', numX, 610 + this.bgWalk)
      ctx.fillText('2', numX, 562 + this.bgWalk)
      ctx.fillText('4', numX, 514 + this.bgWalk)
      ctx.fillText('6', numX, 466 + this.bgWalk)
      ctx.fillText('8', numX, 418 + this.bgWalk)

      ctx.fillText('10', numX, 370 + this.bgWalk)
      ctx.fillText('12', numX, 322 + this.bgWalk)
      ctx.fillText('14', numX, 274 + this.bgWalk)
      ctx.fillText('16', numX, 226 + this.bgWalk)
      ctx.fillText('18', numX, 178 + this.bgWalk)

      ctx.fillText('20', numX, 130 + this.bgWalk)
      ctx.fillText('22', numX, 82 + this.bgWalk)
      ctx.fillText('24', numX, 34 + this.bgWalk)
      ctx.fillText('26', numX, -14 + this.bgWalk)
      ctx.fillText('28', numX, -62 + this.bgWalk)

      ctx.fillText('30', numX, -110 + this.bgWalk)
      ctx.fillText('32', numX, -158 + this.bgWalk)
      ctx.fillText('34', numX, -206 + this.bgWalk)
      ctx.fillText('36', numX, -254 + this.bgWalk)
      ctx.fillText('38', numX, -302 + this.bgWalk)

      ctx.fillText('40', numX, -350 + this.bgWalk)
      ctx.fillText('42', numX, -398 + this.bgWalk)
      ctx.fillText('44', numX, -446 + this.bgWalk)
      ctx.fillText('46', numX, -494 + this.bgWalk)
      ctx.fillText('48', numX, -542 + this.bgWalk)

      ctx.fillText('50', numX, -590 + this.bgWalk)
      ctx.fillText('52', numX, -638 + this.bgWalk)
      ctx.fillText('54', numX, -686 + this.bgWalk)
      ctx.fillText('56', numX, -734 + this.bgWalk)
      ctx.fillText('58', numX, -782 + this.bgWalk)
      ctx.fillText('60', numX, -830 + this.bgWalk)
    },

    judge () {
      if (this.status === 1 && this.speed <= 0) {
        this.gameOver()
      }
      // if (Math.abs(this.Width - this.binghu.posx * 2) > this.roadWidth) {
      //   this.gameOver()
      // }
    },

    gameOver () {
      this.status = 2
      alert('离终点' + this.score + '米')
      this.reStart()
    },
    reStart () {
      this.binghu.reset()
      this.status = 0
      this.bgWalk = 0
      this.$refs.powerLine.reset()
      this.run()
    },

    // 左右按钮点击事件
    handleDirect (dir) {
      if (this.status !== 1) {
        return
      }
      this.$refs.powerLine.slowPowerDecrease()
      this.binghu.horAccSpeed = dir ? (dir === 'left' ? -0.05 : 0.05) : 0
      // this.binghu.horSpeed = dir ? (dir === 'left' ? -0.5 : 0.5) : 0
    },

     // 获取速度
    getJourney (val) {
      this.speed = val
    }
  },
  mounted () {
    this.$nextTick(() => {
      // requestAnimFrame 兼容
      window.requestAnimFrame = (() => {
        return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60)
          }
      })()

      // 执行逻辑
      // 插入画布
      this.Width = window.innerWidth         // 屏幕宽度
      this.Height = window.innerHeight       // 屏幕高度
      this.ratio = (590 + this.Height / 3 * 2) / 50
      let str = '<canvas id="canvas" width=' + this.Width + '; height=' + this.Height + '>Sorry! you的浏览器不支持canvas</canvas>'
      document.getElementById('stage').innerHTML = str
      // 角色图片
      // 全局对象
      this.canvas = document.getElementById('canvas')
      this.context = this.canvas.getContext('2d')
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
    }
    .score-panel {
      border: 2px solid #444;
      min-width: 20%;
      // min-height: 8rem;
      position: fixed;
      left: 0;
      top: 0;
      padding: 0.8rem;
      text-align: center;
      background: #fff;
      .score-title {
        font-size: 1.2rem;
      }
      .score-num {
        display: block;
        padding: 1rem 0;
        text-align: center;
        vertical-align: middle;
        font-size: 5.6rem;
        font-weight: bold;
      }
    }
  }
</style>
