<template>
  <div class="powerline">
    <button @click="slowPowerDecrease" class="testBtn">click</button>
    <button @click="decreasePower" class="shotBtn">shot</button>
    <button @click="switchOption" class="stopBtn">stop/start</button>
    <svg :width="clientWidth/2" :height="clientWidth/2">
    <circle :cx="clientWidth/4" :cy="clientWidth/2" :r="clientWidth/4 - 20" stroke-width="15" stroke="#ccc" fill="none"></circle>
    <circle :cx="clientWidth/4" :cy="clientWidth/2" :r="clientWidth/4 - 20" stroke-width="15" stroke="#444" fill="none"  :stroke-dasharray="circleDasharray"></circle>
    </svg>
    
  </div>
</template>

<script>
export default {
  name: 'powerline',
  data () {
    return {
      status: 0,                  // 进度条状态， 0：来回变化， 1：衰减， 2：停止
      beforeStatus: 0,            // 暂停之前状态
      clientWidth: 0,             // 屏幕宽度
      progress: 0,                // 力度， 0-100
      PowerIncrease: 1,           // 力度增强还是衰弱
      PowerIncreaseSpeed: 1,      // 力度摇摆增减速率
      PowerDecreaseTime: 50,      // 力度衰减时间间隔
      decreaseTimer: '',              // 力度衰减重复进行计时器
      slowTimer: '',              // 力度衰减减缓计时器
      PowerIncreaseFactor: 0      // 力度和stroke-dasharray计算因子
    }
  },
  computed: {
    // 1069是第2个参数，间距; factor: 存储计算因子，减少computed 开销
    circleDasharray () {
      return Math.round(this.PowerIncreaseFactor * (this.progress + 100)) + ' 1069'
    }
  },
  created () {
    this.clientWidth = window.innerWidth
    this.PowerIncreaseFactor = Math.PI * 2 * (this.clientWidth / 4 - 20) / 100 / 2
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
        window.requestAnimationFrame(this.swingPower)
      }
    },
    // 力度衰减
    decreasePower () {
      this.status = 1
      clearTimeout(this.decreaseTimer)
      this.progress = this.progress - 0.5
      if (this.progress < 0) {
        this.gameOver()
        return
      }
      this.decreaseTimer = setTimeout(() => {
        this.decreasePower()
      }, this.PowerDecreaseTime);
    },
    // 力度减缓
    slowPowerDecrease () {
      clearTimeout(this.slowTimer)
      this.PowerDecreaseTime = 100
      this.slowTimer = setTimeout(() => {
        this.PowerDecreaseTime = 50
      }, 200);
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
      this.PowerIncrease = 1
      this.PowerIncreaseSpeed = 1
      this.PowerDecreaseTime = 50
    },
    gameOver () {
      alert('over')
      this.reset()
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
    width: 50%;
    height: 0;
    padding-bottom: 50%;
    bottom: 0;
    overflow: hidden;
    .shotBtn {
      position: absolute;
      bottom: 0;
      left: 30px;
    }
    .stopBtn {
      position: absolute;
      bottom: 0;
      left: 60px;
    }
    .testBtn {
      position: fixed;
      bottom: 30px;
      width: 60px;
      height: 30px;
      left: 60px;
    }
    
  }
</style>
