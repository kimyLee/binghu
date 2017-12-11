<template>
  <div class="option-btn" :class="side" @click="$emit('click')">
    <slot></slot>
  </div>
</template>

<script>
import canvasBtn from '@/lib/canvasBtn'
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
      canvasBtn.init(this.$el)
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
    height: 4rem;
    background: #444;
    color: #fff;
    text-align: center;
    line-height: 4rem;
    canvas {
      position: absolute;
      top: 0;
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
