<template>
  <div class="powerline">
    <!-- <button @click="slowPowerDecrease" class="testBtn">click</button> -->
    <!-- <button @click="shot" class="shotBtn">shot</button> -->
    <!-- 画三个圆，分别构造圆环， 圆形按钮 -->
    <div class="outer-cycle"></div>
    <div class="middle-cycle"></div>
    <div class="inner-cycle">
      <span class="inner-cycle-icon"></span><br>
      <span class="inner-cycle-line"></span><br>
      <span class="inner-cycle-text" @click="shot">点击滑行</span>
    </div>
    <svg :width="clientWidth * 0.4" :height="clientWidth * 0.4" class="my-svg">
    <circle :cx="clientWidth * 0.2" :cy="clientWidth * 0.36" :r="clientWidth * 0.2 - 20" stroke-width="15" stroke="#fed744" fill="none"></circle>
    <circle class="inner-svg" :cx="clientWidth * 0.2" :cy="clientWidth * 0.36" :r="clientWidth * 0.2 - 20" stroke-width="15" stroke="#fcfcfc" fill="none"  :stroke-dasharray="circleDasharray"></circle>
    </svg>
    
  </div>
</template>

<script>
export default {
  name: 'powerline',
  props: [],
  data () {
    return {
      status: 0,                  // 进度条状态， 0：来回变化， 1：衰减， 2：停止
      beforeStatus: 0,            // 暂停之前状态
      clientWidth: 0,             // 屏幕宽度
      progress: 0,                // 力度， 0-100
      PowerIncrease: 1,           // 力度增强还是衰弱 1 / -1
      PowerIncreaseSpeed: 1,      // 力度摇摆增减速率
      PowerDecreaseTime: 50,      // 力度衰减时间间隔
      PowerDecreaseStep: 0.5,      // 力度衰减单位大小
      decreaseTimer: '',              // 力度衰减重复进行计时器
      slowTimer: '',              // 力度衰减减缓计时器
      PowerIncreaseFactor: 0      // 力度和stroke-dasharray计算因子
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
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init () {
      this.swingPower()
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
        window.requestAnimFrame(this.swingPower)
      }
    },
    shot () {
      this.status = 1
      this.$emit('changeStatus', this.status)     // 通知已经发射，改变状态
      this.decreasePower()
    },
    // 力度衰减
    decreasePower () {
      clearTimeout(this.decreaseTimer)
      this.progress = this.progress - this.PowerDecreaseStep
      this.$emit('returnSpeed', this.progress)
      if (this.progress <= 0) {
        return
      }
      this.decreaseTimer = setTimeout(() => {
        this.decreasePower()
      }, this.PowerDecreaseTime)
    },
    // 力度减缓
    slowPowerDecrease () {
      clearTimeout(this.slowTimer)
      this.PowerDecreaseStep = 0.25
      this.slowTimer = setTimeout(() => {
        this.PowerDecreaseStep = 0.5
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
      this.status = 0
      this.beforeStatus = 0
      this.progress = 0
      this.$emit('returnSpeed', this.progress)
      this.PowerIncrease = 1
      this.PowerIncreaseSpeed = 1
      this.PowerDecreaseTime = 50
      this.init()
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
    .my-svg {
      position: absolute;
      z-index: 99;
      
      .inner-svg {
        transform: rotate(30deg);
      transform-origin:50% 50%;
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
        // vertical-align: top;
        position: relative;
        display: inline-block;
        font-size: 1.4rem;
        color: #fff;
        font-weight: bold;
        // line-height: 3.2rem;
       //  height: 3.2rem;
        margin-top: -0.4rem;
       
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
    // .stopBtn {
    //   position: absolute;
    //   bottom: 0;
    //   left: 60px;
    // }
    
    
  }
</style>
