<template>
  <div class="container">
    <div id="stage"></div>
    <power-line @action = "playerAction" ></power-line>
  </div>
</template>

<script>
import powerLine from '@/components/powerLine'
export default {
  name: 'world',
  components: {
    powerLine
  },
  data () {
    return {
      context: '',        // 上下文
      canvas: '',         // 画布对象
      boxX: 0,            // 画布起点横坐标
      boxY: 0,            // 画布起点纵坐标
      Width: '',          // 画布宽度
      Height: '',         // 画布高度
      currentFrame: 0,    // 当前帧
      player: {
        image: '',
        x: 30,
        y: 30,
        z: 0,
        r: 17,
        xspeed: 0,
        yspeed: 0,
        begin_x: 0,
        direct: 120       // 0 120 360 480;
      }
    }
  },
  methods: {
    run () {
      this.render()
      window.requestAnimationFrame(this.run)
    },
    render () {
      this.context.clearRect(this.boxX, this.boxY, this.Width, this.Height)
      this.currentFrame++
      this.drawRole(this.player, this.currentFrame)
      this.context.save()
      this.context.restore()
    },
    playerAction (action, speed = 1) {
      switch (action) {
        case 'left':
          this.player.xspeed = -2
          this.player.direct = 360
          break
        case 'right':
          this.player.xspeed = 2
          this.player.direct = 120
          break
        case 'top':
          this.player.yspeed = -2
          this.player.direct = 240
          break
        case 'bottom':
          this.player.yspeed = 2
          this.player.direct = 0
          break
        default:
          this.player.xspeed = 0
          this.player.yspeed = 0
      }
      console.log(this.player.xspeed, this.player.yspeed)
    },
    drawRole (player, currentFrame) {
      // for (var i = arr.length; i--;) {
      //   if (this.intersect(arr[i][0], arr[i][1], arr[i][2], arr[i][3], player.x + player.xspeed * 5, player.y + player.yspeed * 5, player.r)) {
      //       player.xspeed = 0
      //       player.yspeed = 0
      //       player.begin_x = 0
      //       break;
      //   }
      // }
      player.begin_x = (player.xspeed === 0 && player.yspeed === 0) ? 0 : ((this.currentFrame / 9) << 0) % 4 * 120        // 图片开始位置
      player.x += player.xspeed
      player.y += player.yspeed
      // 开始剪切x, 开始剪切y, 被剪切宽度, 被剪切高度, 画布上x坐标, 画布上y坐标, 图像的宽度, 图像的高度
      this.context.drawImage(this.player.image, this.player.begin_x, this.player.direct, 120, 120, this.player.x - 15, this.player.y - 15, 30, 30)
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
      console.log(this.Width, this.Height)
      let str = '<canvas id="canvas" width=' + this.Width + '; height=' + this.Height + '>Sorry! you的浏览器不支持canvas</canvas>'
      document.getElementById('stage').innerHTML = str
      // 角色图片
      this.player.image = new Image()
      this.player.image.src = '/static/img/role.png'
      // 全局对象
      this.canvas = document.getElementById('canvas')
      console.log(this.canvas)
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
