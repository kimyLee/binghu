<template>
  <div class="option-btn" :class="side" @click="$emit('click')">
    <slot></slot>
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
    width: 20%;
    height: 3rem;
    border: 2px solid #444;
    background: #fff;
    // background: #444;
    // color: #fff;
    text-align: center;
    line-height: 3rem;
    canvas {
      position: absolute;
      bottom: 0;
      left: 0;
    }

    &.left {
      left: 0;
    }
    &.right {
      right: 0;
    }
  }
</style>
