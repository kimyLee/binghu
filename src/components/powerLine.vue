<template>
  <div class="powerline">
    <!-- 画三个圆，分别构造圆环， 圆形按钮 -->
    <!-- 移动的三角形 -->
    <div class = "direction-icon">
      <canvas id="floolwerCanvas" :width="clientWidth * 0.4" :height="clientWidth * 0.4"></canvas>
      <!-- <img :src="'/static/images/follower.png' | autoPre"> -->
    </div>
    <div class="outer-cycle"></div>
    <div class="inner-cycle" @click="shot">
      <span class="inner-cycle-icon" ></span><br>
      <span class="inner-cycle-line" ></span><br>
      <span class="inner-cycle-text"  :class="{'animate-text': addTip}">{{btnText}}</span>
    </div>
    <svg :width="clientWidth * 0.4" :height="clientWidth * 0.4" class="my-svg">
      <circle :cx="clientWidth * 0.2" :cy="clientWidth * 0.36" :r="clientWidth * 0.2 - 20" stroke-width="15" stroke="#fed744" fill="none"></circle>
      <circle class="inner-svg" :cx="clientWidth * 0.2" :cy="clientWidth * 0.36" :r="clientWidth * 0.2 - 20" stroke-width="15" stroke="#fcfcfc" fill="none"  :stroke-dasharray="circleDasharray"></circle>
    </svg>
    <!-- 指引 -->
    <div class="click-tip" v-if="addFirstTip">
        <transition name="right-in">
          <img class="click-tip-finger" :src="'/static/images/finger.png' | autoPre" v-if="handIn"/>
        </transition>
        <div class="w1" ></div>
        <div class="w2" ></div>
        <div class="w3"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'powerline',
  props: [],
  data () {
    return {
      swingTimer: '',             // 摆动的动画对象
      status: 0,                  // 进度条状态， 0：来回变化， 1：衰减， 2：停止， 3： 选择方向, 4: 准备就绪，准备发射
      beforeStatus: 0,            // 暂停之前状态
      clientWidth: 0,             // 屏幕宽度
      progress: 0,                // 力度， 0-100
      PowerIncrease: 1,           // 力度增强还是衰弱 1 / -1
      PowerIncreaseSpeed: 1.5,    // 力度摇摆增减速率
      PowerDecreaseTime: 50,      // 力度衰减时间间隔
      PowerDecreaseStep: 0.5,     // 力度衰减单位大小
      PowerDecreaseStepAdd: 1,  // 力度衰减单位加速度
      decreaseTimer: '',          // 力度衰减重复进行计时器
      slowTimer: '',              // 力度衰减减缓计时器
      PowerIncreaseFactor: 0,      // 力度和stroke-dasharray计算因子
      btnText: '选择力度',         // 按扭文本
      addTip: false,              // 切换状态时样式提示
      addFirstTip: false,         // 第一次点击的样式提示
      handIn: false,              // 手指进入
      /* canvas 方向选择相关 */
      canvas: '',
      context: '',
      followerImg: '',
      directBtn: {
        x: 0,
        y: 0,
        width: 20,
        height: 20,
        rotate: 0,
        increase: 1,
        increaseSpeed: 1,
        rotateCycle: 30
      }
    }
  },
  computed: {
    // 1069是第2个参数，间距; factor: 存储计算因子，减少computed 开销
    circleDasharray () {
      return Math.round(this.PowerIncreaseFactor * (this.progress + 65)) + ' 1069'
    }
  },
  created () {
    this.clientWidth = window.innerWidth
    this.PowerIncreaseFactor = Math.PI * 2 * (this.clientWidth * 0.2 - 20) / 100 * 210 / 360

    // canvas
    this.followerImg = new Image()
    this.followerImg.src = this.$domain + '/static/images/follower.png'
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
      this.addFirstTip = true
      this.$nextTick(() => {
        this.handIn = true
      })
      setTimeout(() => {
        this.handIn = false
        setTimeout(() => {
          this.addFirstTip = false
        }, 300)
      }, 2000)
    })
  },
  methods: {
    init () {
      this.swingPower()

      this.canvas = document.getElementById('floolwerCanvas')
      this.context = this.canvas.getContext('2d')
      // 消除锯齿
      if (window.devicePixelRatio) {
        this.canvas.style.width = this.canvas.width + 'px'
        this.canvas.style.height = this.canvas.height + 'px'
        this.canvas.height = this.canvas.height * window.devicePixelRatio
        this.canvas.width = this.canvas.width * window.devicePixelRatio
        this.context.scale(window.devicePixelRatio, window.devicePixelRatio)
      } else {
        window.devicePixelRatio = 1
      }
    },
    // 摇摆选择力度
    swingPower () {
      this.progress = this.progress + this.PowerIncrease * this.PowerIncreaseSpeed
      if (this.progress >= 100) {
        this.PowerIncrease = -1
        this.progress = 100
      } else if (this.progress <= 0) {
        this.PowerIncrease = 1
        this.progress = 0
      }
      if (this.status === 0) {
        this.swingTimer = window.requestAnimFrame(this.swingPower)
      }
    },

    runChooseDirection () {
      if (this.status === 3) {
        this.drawDirection()
        window.requestAnimFrame(this.runChooseDirection)
      }
    },
    // 渲染方向箭头
    drawDirection () {
      let ctx = this.context
      let canvas = this.canvas
      let directBtn = this.directBtn
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      ctx.save()

      directBtn.rotate = directBtn.rotate + directBtn.increase * directBtn.increaseSpeed
      if (directBtn.rotate >= directBtn.rotateCycle) {
        directBtn.increase = -1
        directBtn.rotate = directBtn.rotateCycle
      } else if (directBtn.rotate <= -directBtn.rotateCycle) {
        directBtn.increase = 1
        directBtn.rotate = -directBtn.rotateCycle
      }
      ctx.translate(canvas.width / 2 / window.devicePixelRatio, canvas.height * 0.7 / window.devicePixelRatio)
      ctx.rotate(directBtn.rotate * Math.PI / 180)
      // 开始剪切x, 开始剪切y, 被剪切宽度, 被剪切高度, 画布上x坐标, 画布上y坐标, 图像的宽度, 图像的高度
      ctx.drawImage(this.followerImg, 0, 0, 35, 36, -directBtn.width / 2, -canvas.height * 0.7 / window.devicePixelRatio, 20, 20)
      ctx.restore()
    },

    shot () {
      switch (this.status) {
        // 当前动作：选择力度，下个动作：选择方向
        case 0:
          // 为了按钮文本有过度效果, 500ms css时间
          this.status = 3
          this.addTip = true
          setTimeout(() => {
            this.addTip = false
            this.btnText = '选择方向'
            this.runChooseDirection()
          }, 500)
          break
        // 当前动作：选择方向，下个动作，准备发射
        case 3:
          this.status = 4
          this.addTip = true
          setTimeout(() => {
            this.addTip = false
            this.$emit('changeRotate', this.directBtn.rotate, this.directBtn.rotateCycle)
            this.btnText = '点击滑行'
          }, 500)
          break
        // 当前动作：准备发射，下个动作，发射
        case 4:
          this.status = 1
          this.$emit('changeStatus', this.status)     // 通知已经发射，传递状态
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
          this.btnText = '劲还在'
          this.addTip = true
          this.decreasePower()
          setTimeout(() => {
            this.addTip = false
          }, 500)
          break
        default:
          break
      }
    },

    // 力度衰减
    decreasePower () {
      clearTimeout(this.decreaseTimer)
      this.PowerDecreaseStep = Math.min(0.2, Math.max(0.1, this.PowerDecreaseStep + (this.PowerDecreaseStepAdd * 0.02)))
      this.progress = this.progress - this.PowerDecreaseStep
      this.$emit('returnSpeed', this.progress)
      if (this.progress <= 0) {
        return
      }
      // this.decreaseTimer = setTimeout(() => {
      //   this.decreasePower()
      // }, this.PowerDecreaseTime)
      this.decreaseTimer = window.requestAnimationFrame(this.decreasePower)
    },
    // 力度减缓
    slowPowerDecrease () {
      clearTimeout(this.slowTimer)
      // this.PowerDecreaseStep = 0.25
      this.PowerDecreaseStepAdd = -1
      this.slowTimer = setTimeout(() => {
        // this.PowerDecreaseStep = 0.5
        this.PowerDecreaseStepAdd = 1
      }, 200)
    },
     // 暂停、恢复
    switchOption () {
      if (this.status === 2) {
        this.status = this.beforeStatus
        return this.beforeStatus === 0 ? this.swingPower() : ''
      }
      this.beforeStatus = this.status
      this.status = 2
    },
    // 重置复位
    reset () {
      cancelAnimationFrame && cancelAnimationFrame(this.decreaseTimer)
      // clearTimeout(this.decreaseTimer)
      this.status = 0
      this.btnText = '选择力度'
      this.beforeStatus = 0
      this.progress = 0
      this.$emit('returnSpeed', this.progress)
      this.PowerIncrease = 1
      this.PowerIncreaseSpeed = 1.5
      this.PowerDecreaseStep = 0.5
      this.PowerDecreaseStepAdd = 1
      this.PowerDecreaseTime = 50
      this.directBtn = {
        x: 0,
        y: 0,
        width: 20,
        height: 20,
        rotate: 0,
        increase: 1,
        increaseSpeed: 1,
        rotateCycle: 30
      }
      cancelAnimationFrame && cancelAnimationFrame(this.swingTimer)
      this.swingPower()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
  .powerline {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    width: 40%;
    height: 0;
    padding-bottom: 40%;
    bottom: 0;
    overflow: hidden;
    .direction-icon {
      position: absolute;
      // z-index: 199;
      width: 100%;
      height: 0;
      outline: none;
      padding-bottom: 100%;
      border-radius: 50%;
      transform: translateY(23%) ;
      #floolwerCanvas {
        // width: 100%;
        // height: 100%;
      }
    }
    .my-svg {
      position: absolute;
      z-index: 99;
      
      .inner-svg {
         transform-origin: center;
          transform-box: fill-box;
         transform: rotate(30deg);
     
      }
    }
    .outer-cycle {
      position: absolute;
      bottom: 0;
      width: 100%;
      // left: 50%;
      height: 0;
      outline: none;
      padding-bottom: 100%;
      border-radius: 50%;
      background: #d35155;
      transform: translateY(40%) ;
    }
    .inner-cycle {
      z-index: 100;
      position: absolute;
      bottom: 0;
      width: 64%;
      left: 18%;
      height: 0;
      outline: none;
      padding-bottom: 64%;
      border-radius: 50%;
      background: #d35155;
      box-shadow: 0px 3px 5px 5px rgba(0, 0, 0, .37);
      transform: translateY(35%) ;
      text-align: center;
      .inner-cycle-icon {
        display: inline-block;
        width: 0;
        height: 0;
        border:solid #fff;
        border-top-width: 1rem;
        border-left-width: 1rem;
        border-right-width: 1rem;
        border-bottom-width: 1rem;
        border-left-color: transparent;
        border-right-color: transparent;
        border-top-color: transparent;
      }
      .inner-cycle-line {
        display: inline-block;
        width: 2rem;
        height: 0;
        border-top: 3px solid #fff;
        vertical-align: top; 
      }
      .inner-cycle-text {
        position: relative;
        display: inline-block;
        font-size: 1.4rem;
        color: #fff;
        // font-weight: bold;
        margin-top: -0.4rem;
        &.animate-text {
          animation: TextShow .5s ease-out;
        }  
      }

    }
    .shotBtn {
      position: absolute;
      bottom: 0;
      width: 50%;
      left: 50%;
      height: 0;
      outline: none;
      padding-bottom: 50%;
      border-radius: 50%;
      background: #444;
      color: #fff;
      text-align: center;
      line-height: 45px;
      border: none;
      transform: translateY(50%) translateX(-50%) ;
    }

    // 第一次点击的提示
    .click-tip {
      position: fixed;
      z-index: 999;
      bottom: 0rem;
      right: 0;
      width: 8rem;
      height: 8rem;
      .click-tip-finger {
        position: absolute;
        bottom: 0.5rem;
        right: 0;
        width: 4rem;
        // opacity: 1;
        // transform: translateX(0);
      }
      div {
        border:3px solid #fff;
        position:absolute;
        top:50%;
        left:50%;
        border-radius:50%;
        margin-top: 1.2rem;
        margin-left: 0.7rem;
        &.w1{
	          animation:ripple 1s 1;
            animation-delay: .5s;
        }
        &.w2{
	          animation: ripple 1s 1;
             animation-delay: 1s;
        }
        &.w3{
	          animation: ripple 1s 1;
             animation-delay: 1.5s;
        }
      }
    }

  .right-in-enter-active, .right-in-leave-active {
    transition: all ease .3s;
  }
  .right-in-enter, .right-in-leave-to {
    transform: translateX(3rem);
    opacity: 0;
  }
    @keyframes ripple {
      from {opacity: 1;width:0;height:0;top:50%;left:50%;}
	    to {opacity : 0;width:100%;height:100%;top:0;left:0;}
    }
    @keyframes TextShow
    {
      from {
        transform: scale(1);
        opacity: 1;
      }
      to {
        transform: scale(1.2);
        opacity: 0.2;
      }
    }
  }
</style>
