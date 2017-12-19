<template>
  <div class="option-btn" :class="side" @click="$emit('click')">
    <span class="option-btn-text"><slot></slot></span>
  </div>
</template>

<script>
import CanvasBtn from '@/lib/canvasBtn'
export default {
  name: 'btns',
  props: {
    side: {
      type: String,
      default: 'left'
    }
  },
  mounted () {
    this.$nextTick(() => {
      /* eslint-disable no-unused-vars */
      let canvasBtn = new CanvasBtn(this.$el)
    })
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
  .option-btn {
    position: fixed;
    bottom: 0;
    // width: 20%;
    // height: 4rem;
    text-align: center;
    width: 30%;
    height: 0;
    padding-bottom: 20%;
    background: #fff;
    text-align: center;
    line-height: 4rem;
    canvas {
      position: absolute;
      bottom: 0;
      left: 0;
    }

    &.left {
      left: 0;
      background: url('/static/images/left_btn.png') no-repeat;
      background-size: 100%;
    }
    &.right {
      right: 0;
      background: url('/static/images/right_btn.png') no-repeat;
      background-size: 100%;
      .option-btn-text {
        left: 60%;
      }
    }
    .option-btn-text {
      color: #fff;
      position: absolute;
      display: inline-block;
      height: 2rem;
      line-height: 2rem;
      font-size: 1.4rem;
      font-weight: bold;
      transform: translateX(-50%);
      bottom: 0;
      left: 40%;
    }
  }
</style>
