<template>
  <div class="container">
    <div id="stage"></div>
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
      binghu: '',         // 冰壶对象
      bgWalk: 0,          // 背景偏移
      rodeWidth: 200,     // 轨道宽度
      speed: 0,           // 速度力度
      speedFactor: 33,    // 速度计算因子
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
    // 左右按钮点击事件
    handleDirect (dir) {
      this.$refs.powerLine.slowPowerDecrease()
      this.binghu.horSpeed = dir ? (dir === 'left' ? -0.5 : 0.5) : 0
    },

     // 获取速度
    getJourney (val) {
      this.speed = val
    },

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
      this.judge()                  // 判定是否gameover
    },

    judge () {
      if (this.status === 1 && this.speed <= 0) {
        this.gameOver()
      }
      if (Math.abs(this.Width - this.binghu.posx * 2) > this.rodeWidth) {
        this.gameOver()
      }
    },

    gameOver () {
      console.log('gameOver')
      this.status = 2
      let score = Math.abs(-590 + this.bgWalk - this.Height / 3 * 2)
      alert('离终点' + score + '米')
      this.reStart()
    },
    reStart () {
      this.binghu.reset()
      this.status = 0
      this.bgWalk = 0
      this.$refs.powerLine.reset()
      this.run()
    },

    drawHero () {
      let ctx = this.context
      if (!this.binghu.stop) {
        this.binghu.posy = -this.speed / this.speedFactor + this.binghu.posy
        if (this.binghu.posy < this.Height / 3 * 2) {
          this.binghu.stop = true
        }
      }
      this.binghu.posx = this.binghu.posx + this.binghu.horSpeed
      ctx.beginPath()
      ctx.arc(this.binghu.posx, this.binghu.posy, this.binghu.radius, 0, 2 * Math.PI)
      ctx.stroke()
    },

    drawBg () {
      if (this.binghu.stop) {
        this.bgWalk = this.speed / this.speedFactor + this.bgWalk
      }
      let ctx = this.context
      ctx.moveTo(60, -550)
      ctx.lineTo(60, 550)
      ctx.stroke()
      ctx.fillText('0', 63, 610 + this.bgWalk)
      ctx.fillText('2', 63, 562 + this.bgWalk)
      ctx.fillText('4', 63, 514 + this.bgWalk)
      ctx.fillText('6', 63, 466 + this.bgWalk)
      ctx.fillText('8', 63, 418 + this.bgWalk)

      ctx.fillText('10', 63, 370 + this.bgWalk)
      ctx.fillText('12', 63, 322 + this.bgWalk)
      ctx.fillText('14', 63, 274 + this.bgWalk)
      ctx.fillText('16', 63, 226 + this.bgWalk)
      ctx.fillText('18', 63, 178 + this.bgWalk)

      ctx.fillText('20', 63, 130 + this.bgWalk)
      ctx.fillText('22', 63, 82 + this.bgWalk)
      ctx.fillText('24', 63, 34 + this.bgWalk)
      ctx.fillText('26', 63, -14 + this.bgWalk)
      ctx.fillText('28', 63, -62 + this.bgWalk)

      ctx.fillText('30', 63, -110 + this.bgWalk)
      ctx.fillText('32', 63, -158 + this.bgWalk)
      ctx.fillText('34', 63, -206 + this.bgWalk)
      ctx.fillText('36', 63, -254 + this.bgWalk)
      ctx.fillText('38', 63, -302 + this.bgWalk)

      ctx.fillText('40', 63, -350 + this.bgWalk)
      ctx.fillText('42', 63, -398 + this.bgWalk)
      ctx.fillText('44', 63, -446 + this.bgWalk)
      ctx.fillText('46', 63, -494 + this.bgWalk)
      ctx.fillText('48', 63, -542 + this.bgWalk)

      ctx.fillText('50', 63, -590 + this.bgWalk)
      ctx.fillText('52', 63, -638 + this.bgWalk)
      ctx.fillText('54', 63, -686 + this.bgWalk)
      ctx.fillText('56', 63, -734 + this.bgWalk)
      ctx.fillText('58', 63, -782 + this.bgWalk)
      ctx.fillText('60', 63, -830 + this.bgWalk)
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
  }
</style>
