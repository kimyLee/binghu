<template>
  <div class="powerline">
    <button @click="status = status ? 0 : 1" class="shotBtn">shot</button>
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
      clientWidth: 0,             // 屏幕宽度
      progress: 0,                // 力度， 0-100
      PowerIncrease: 1,           // 力度增强还是衰弱
      PowerIncreaseSpeed: 1,      // 力度增减速率
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
    
  }
</style>
